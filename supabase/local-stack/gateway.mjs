// Minimal stand-in for Supabase's API gateway: routes /auth/v1 to GoTrue and /rest/v1 to PostgREST.
import http from "node:http";

const routes = [
  ["/auth/v1", 9999],
  ["/rest/v1", 3001],
];
const port = Number(process.env.GATEWAY_PORT ?? 54321);

http
  .createServer((req, res) => {
    // CORS, as Supabase's hosted gateway allows browser calls from any origin.
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin ?? "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", req.headers["access-control-request-headers"] ?? "authorization,apikey,content-type,x-client-info,prefer,range");
    res.setHeader("Access-Control-Expose-Headers", "content-range,x-supabase-api-version");
    if (req.method === "OPTIONS") {
      res.writeHead(204).end();
      return;
    }
    const route = routes.find(([prefix]) => req.url.startsWith(prefix));
    if (!route) {
      res.writeHead(404).end("not found");
      return;
    }
    const [prefix, target] = route;
    const headers = { ...req.headers, host: `127.0.0.1:${target}` };
    // Supabase's gateway accepts the apikey header as the bearer token when none is given.
    if (!headers.authorization && headers.apikey) headers.authorization = `Bearer ${headers.apikey}`;
    const upstream = http.request({ host: "127.0.0.1", port: target, path: req.url.slice(prefix.length) || "/", method: req.method, headers }, (up) => {
      const { "access-control-allow-origin": _o, "access-control-allow-credentials": _c, ...rest } = up.headers;
      res.writeHead(up.statusCode ?? 502, rest);
      up.pipe(res);
    });
    upstream.on("error", (e) => res.writeHead(502).end(String(e)));
    req.pipe(upstream);
  })
  .listen(port, () => console.log(`gateway on :${port}`));
