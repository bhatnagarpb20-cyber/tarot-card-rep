/**
 * Integration tests for the database schema and row-level security, run against a real local
 * PostgreSQL with a minimal Supabase auth stub. Skipped unless TEST_DATABASE_URL is set, e.g.
 *   TEST_DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5432/postgres npm run test:db
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import pg from "pg";
import { buildSeedSql } from "../../scripts/generate-seed";

const ADMIN_URL = process.env.TEST_DATABASE_URL;
const DB_NAME = "daily_arcana_rls_test";
const root = path.resolve(__dirname, "..");

const userA = randomUUID();
const userB = randomUUID();

let db: pg.Client;

async function asRole<T>(role: "authenticated" | "anon", uid: string | null, fn: (c: pg.Client) => Promise<T>): Promise<T> {
  await db.query("begin");
  try {
    await db.query(`set local role ${role}`);
    await db.query("select set_config('request.jwt.claim.sub', $1, true)", [uid ?? ""]);
    const result = await fn(db);
    await db.query("commit");
    return result;
  } catch (e) {
    await db.query("rollback");
    throw e;
  }
}
const asUser = <T>(uid: string, fn: (c: pg.Client) => Promise<T>) => asRole("authenticated", uid, fn);
const asAnon = <T>(fn: (c: pg.Client) => Promise<T>) => asRole("anon", null, fn);

async function createReading(uid: string, opts: { kind?: string; localDate?: string } = {}): Promise<string> {
  return asUser(uid, async (c) => {
    const { rows } = await c.query(
      `insert into public.readings (user_id, kind, spread, category, local_date, timezone, allow_reversals, content_version)
       values ($1, $2, 'daily', 'general', $3, 'Europe/London', true, '1.0.0') returning id`,
      [uid, opts.kind ?? "question", opts.localDate ?? "2026-10-21"],
    );
    await c.query(`insert into public.reading_cards (reading_id, user_id, position, position_key, card_id, reversed) values ($1, $2, 0, 'today', 'major-00-the-fool', false)`, [rows[0].id, uid]);
    return rows[0].id as string;
  });
}

describe.skipIf(!ADMIN_URL)("database schema and row-level security", () => {
  beforeAll(async () => {
    const admin = new pg.Client({ connectionString: ADMIN_URL });
    await admin.connect();
    await admin.query(`drop database if exists ${DB_NAME} with (force)`);
    await admin.query(`create database ${DB_NAME}`);
    await admin.end();

    const url = new URL(ADMIN_URL!);
    url.pathname = `/${DB_NAME}`;
    db = new pg.Client({ connectionString: url.toString() });
    await db.connect();
    await db.query(readFileSync(path.join(root, "tests/stub-supabase.sql"), "utf8"));
    for (const file of readdirSync(path.join(root, "migrations")).sort()) {
      await db.query(readFileSync(path.join(root, "migrations", file), "utf8"));
    }
    await db.query(buildSeedSql());
    await db.query("insert into auth.users (id, email) values ($1, 'a@example.com'), ($2, 'b@example.com')", [userA, userB]);
  });

  afterAll(async () => {
    await db?.end();
  });

  it("seeds all 78 cards and creates profiles and preferences on sign-up", async () => {
    const cards = await db.query("select count(*)::int as n from public.tarot_cards");
    expect(cards.rows[0].n).toBe(78);
    const prefs = await db.query("select count(*)::int as n from public.user_preferences where user_id = any($1)", [[userA, userB]]);
    expect(prefs.rows[0].n).toBe(2);
  });

  it("lets anonymous visitors read cards and lessons but nothing private", async () => {
    const n = await asAnon((c) => c.query("select count(*)::int as n from public.tarot_cards"));
    expect(n.rows[0].n).toBe(78);
    const lessons = await asAnon((c) => c.query("select count(*)::int as n from public.learning_lessons"));
    expect(lessons.rows[0].n).toBeGreaterThan(0);
    await expect(asAnon((c) => c.query("select * from public.readings"))).rejects.toThrow(/permission denied/);
    await expect(asAnon((c) => c.query("select * from public.journal_entries"))).rejects.toThrow(/permission denied/);
    await expect(asAnon((c) => c.query("select * from public.profiles"))).rejects.toThrow(/permission denied/);
  });

  it("isolates readings between users", async () => {
    const readingA = await createReading(userA);
    const seenByA = await asUser(userA, (c) => c.query("select id from public.readings where id = $1", [readingA]));
    expect(seenByA.rowCount).toBe(1);
    const seenByB = await asUser(userB, (c) => c.query("select id from public.readings where id = $1", [readingA]));
    expect(seenByB.rowCount).toBe(0);
    const cardsSeenByB = await asUser(userB, (c) => c.query("select * from public.reading_cards where reading_id = $1", [readingA]));
    expect(cardsSeenByB.rowCount).toBe(0);
  });

  it("prevents creating rows on behalf of another user", async () => {
    await expect(
      asUser(userB, (c) =>
        c.query(`insert into public.readings (user_id, kind, spread, local_date, timezone, allow_reversals, content_version) values ($1, 'question', 'one-card', '2026-10-21', 'UTC', true, '1.0.0')`, [userA]),
      ),
    ).rejects.toThrow(/row-level security/);
    const readingA = await createReading(userA);
    await expect(
      asUser(userB, (c) => c.query(`insert into public.reading_cards (reading_id, user_id, position, position_key, card_id, reversed) values ($1, $2, 1, 'x', 'major-01-the-magician', false)`, [readingA, userB])),
    ).rejects.toThrow(/row-level security/);
    await expect(
      asUser(userB, (c) => c.query(`insert into public.journal_entries (user_id, reading_id, kind, body) values ($1, $2, 'reflection', 'sneaky')`, [userB, readingA])),
    ).rejects.toThrow(/row-level security/);
  });

  it("keeps journal entries private and editable only by their owner", async () => {
    const { rows } = await asUser(userA, (c) => c.query(`insert into public.journal_entries (user_id, kind, body) values ($1, 'free', 'private thoughts') returning id`, [userA]));
    const id = rows[0].id;
    const updatedByB = await asUser(userB, (c) => c.query("update public.journal_entries set body = 'hacked' where id = $1", [id]));
    expect(updatedByB.rowCount).toBe(0);
    const deletedByB = await asUser(userB, (c) => c.query("delete from public.journal_entries where id = $1", [id]));
    expect(deletedByB.rowCount).toBe(0);
    const stillThere = await asUser(userA, (c) => c.query("select body from public.journal_entries where id = $1", [id]));
    expect(stillThere.rows[0].body).toBe("private thoughts");
  });

  it("allows only one saved daily card per user per local day", async () => {
    await createReading(userA, { kind: "daily", localDate: "2026-10-22" });
    await expect(createReading(userA, { kind: "daily", localDate: "2026-10-22" })).rejects.toThrow(/readings_one_daily_per_day/);
    // An explicitly requested extra pull is a separate event and is allowed.
    await expect(createReading(userA, { kind: "daily_extra", localDate: "2026-10-22" })).resolves.toBeTruthy();
    // Another user's daily card on the same date is unaffected.
    await expect(createReading(userB, { kind: "daily", localDate: "2026-10-22" })).resolves.toBeTruthy();
  });

  it("forbids duplicate cards in one spread", async () => {
    const readingA = await createReading(userA);
    await expect(
      asUser(userA, (c) => c.query(`insert into public.reading_cards (reading_id, user_id, position, position_key, card_id, reversed) values ($1, $2, 1, 'challenge', 'major-00-the-fool', true)`, [readingA, userA])),
    ).rejects.toThrow(/duplicate key/);
  });

  it("makes drawn cards and interpretation snapshots immutable", async () => {
    const readingA = await createReading(userA);
    await expect(asUser(userA, (c) => c.query("update public.reading_cards set card_id = 'major-19-the-sun' where reading_id = $1", [readingA]))).rejects.toThrow(/permission denied/);
    await expect(asUser(userA, (c) => c.query("update public.readings set local_date = '2020-01-01' where id = $1", [readingA]))).rejects.toThrow(/permission denied/);
    const bookmark = await asUser(userA, (c) => c.query("update public.readings set bookmarked = true where id = $1", [readingA]));
    expect(bookmark.rowCount).toBe(1);
    await asUser(userA, (c) =>
      c.query(`insert into public.interpretation_snapshots (reading_id, user_id, source, generator, content_version, interpretation) values ($1, $2, 'reference', 'reference@1.0.0', '1.0.0', '{"directAnswer":"x"}')`, [readingA, userA]),
    );
    await expect(asUser(userA, (c) => c.query("update public.interpretation_snapshots set interpretation = '{}' where reading_id = $1", [readingA]))).rejects.toThrow(/permission denied/);
  });

  it("shares readings only through an unrevoked token, hiding the question unless opted in", async () => {
    const readingA = await asUser(userA, async (c) => {
      const { rows } = await c.query(
        `insert into public.readings (user_id, kind, spread, category, question, context, local_date, timezone, allow_reversals, content_version)
         values ($1, 'question', 'one-card', 'love', 'A private question', 'private context', '2026-10-21', 'UTC', true, '1.0.0') returning id`,
        [userA],
      );
      await c.query(`insert into public.reading_cards (reading_id, user_id, position, position_key, card_id, reversed) values ($1, $2, 0, 'focus', 'cups-02-two', false)`, [rows[0].id, userA]);
      return rows[0].id as string;
    });
    const { rows } = await asUser(userA, (c) => c.query("insert into public.shared_readings (reading_id, user_id) values ($1, $2) returning token", [readingA, userA]));
    const token = rows[0].token as string;
    expect(token).toMatch(/^[A-Za-z0-9_-]{24}$/);

    const shared = await asAnon((c) => c.query("select public.get_shared_reading($1) as r", [token]));
    expect(shared.rows[0].r.cards).toEqual([{ cardId: "cups-02-two", position: 0, reversed: false }]);
    expect(shared.rows[0].r.question).toBeNull();
    expect(JSON.stringify(shared.rows[0].r)).not.toContain("private context");

    // Anonymous users cannot enumerate shares directly.
    await expect(asAnon((c) => c.query("select * from public.shared_readings"))).rejects.toThrow(/permission denied/);
    // Another user cannot revoke or see it.
    const revokeByB = await asUser(userB, (c) => c.query("update public.shared_readings set revoked_at = now() where token = $1", [token]));
    expect(revokeByB.rowCount).toBe(0);

    await asUser(userA, (c) => c.query("update public.shared_readings set revoked_at = now() where token = $1", [token]));
    const afterRevoke = await asAnon((c) => c.query("select public.get_shared_reading($1) as r", [token]));
    expect(afterRevoke.rows[0].r).toBeNull();
  });

  it("enforces the daily AI quota from settings users cannot change", async () => {
    await db.query("update private.settings set value = '3'::jsonb where key = 'ai_daily_request_limit'");
    const results: boolean[] = [];
    for (let i = 0; i < 5; i++) {
      const { rows } = await asUser(userB, (c) => c.query("select public.consume_ai_quota() as ok"));
      results.push(rows[0].ok);
    }
    expect(results).toEqual([true, true, true, false, false]);
    await expect(asUser(userB, (c) => c.query("update private.settings set value = '999'::jsonb"))).rejects.toThrow(/permission denied/);
    await expect(asUser(userB, (c) => c.query("insert into public.ai_usage (user_id, usage_date, requests) values ($1, current_date + 1, 0)", [userB]))).rejects.toThrow(/permission denied/);
    const anon = await asAnon((c) => c.query("select 1")).then(() => true);
    expect(anon).toBe(true);
    await expect(asAnon((c) => c.query("select public.consume_ai_quota()"))).rejects.toThrow(/permission denied/);
  });

  it("deletes all of a user's data when their account is deleted", async () => {
    await createReading(userB);
    await db.query("delete from auth.users where id = $1", [userB]);
    for (const table of ["profiles", "readings", "reading_cards", "journal_entries", "ai_usage", "user_preferences"]) {
      const col = table === "profiles" ? "id" : "user_id";
      const { rows } = await db.query(`select count(*)::int as n from public.${table} where ${col} = $1`, [userB]);
      expect(rows[0].n, table).toBe(0);
    }
  });
});
