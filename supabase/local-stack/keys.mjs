// Prints anon and service-role JWTs for the local stack, signed with the shared JWT secret.
import { createHmac } from "node:crypto";

const secret = process.env.JWT_SECRET ?? "local-stack-jwt-secret-at-least-32-characters";
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const sign = (payload) => {
  const head = b64({ alg: "HS256", typ: "JWT" });
  const body = b64(payload);
  const sig = createHmac("sha256", secret).update(`${head}.${body}`).digest("base64url");
  return `${head}.${body}.${sig}`;
};
const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365;
console.log(`ANON_KEY=${sign({ role: "anon", iss: "supabase", exp })}`);
console.log(`SERVICE_ROLE_KEY=${sign({ role: "service_role", iss: "supabase", exp })}`);
