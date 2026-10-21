-- Share links: the interpretation is now opt-in, because interpretations can quote or paraphrase
-- the question and the private context. When the question is not shared, any literal copy of it
-- inside the interpretation is also redacted (defence in depth).
alter table public.shared_readings add column include_interpretation boolean not null default false;
grant update (include_interpretation) on public.shared_readings to authenticated;

create or replace function public.get_shared_reading(share_token text) returns jsonb
language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'spread', r.spread,
    'category', r.category,
    'question', case when s.include_question then r.question else null end,
    'createdAt', r.created_at,
    'cards', (
      select coalesce(jsonb_agg(jsonb_build_object('cardId', c.card_id, 'position', c.position, 'reversed', c.reversed) order by c.position), '[]'::jsonb)
      from public.reading_cards c where c.reading_id = r.id
    ),
    'interpretation', case when s.include_interpretation then (
      select case
        when s.include_question or coalesce(r.question, '') = '' then i.interpretation
        -- Replace the JSON-escaped question text wherever it appears.
        else replace(i.interpretation::text, trim(both '"' from to_json(r.question)::text), '[question not shared]')::jsonb
      end
      from public.interpretation_snapshots i
      where i.reading_id = r.id order by i.created_at desc limit 1
    ) else null end
  )
  from public.shared_readings s
  join public.readings r on r.id = s.reading_id
  where s.token = share_token and s.revoked_at is null;
$$;

revoke all on function public.get_shared_reading(text) from public;
grant execute on function public.get_shared_reading(text) to anon, authenticated;

-- Ask PostgREST to pick up the new column immediately.
notify pgrst, 'reload schema';
