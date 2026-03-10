const PRACTICES = [
  {
    title: "Use HTTPS in production",
    description: "JWTs are sent in headers; without HTTPS they can be intercepted. Always use TLS/SSL for the API and frontend.",
  },
  {
    title: "Keep tokens short-lived",
    description: "This app uses 24-hour expiry. Shorter expiry (e.g. 15–60 minutes) with refresh tokens reduces the impact of token theft.",
  },
  {
    title: "Store tokens securely",
    description: "The demo uses localStorage for simplicity. For higher security, consider httpOnly cookies (if the frontend is same-origin with the API) or memory-only storage with refresh token in httpOnly cookie.",
  },
  {
    title: "Never put secrets in the payload",
    description: "JWT payload is base64-encoded, not encrypted. Anyone can decode it. Put only non-sensitive claims (e.g. user id, roles, expiry).",
  },
  {
    title: "Use a strong secret for signing",
    description: "The server signs JWTs with a secret key. Use a long, random secret (e.g. 256-bit) and keep it in environment variables, not in code.",
  },
  {
    title: "Validate signature and expiry on every request",
    description: "The backend must verify the JWT signature and exp claim on every protected request. This app does both via the authJwt middleware.",
  },
  {
    title: "Hash passwords before storing",
    description: "User passwords are hashed with bcrypt before saving to the database. Never store plain-text passwords.",
  },
];

export default function Security() {
  return (
    <div className="py-10 px-4">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Security &amp; best practices</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Guidelines for using JWT and keeping this application secure.
          </p>
        </div>

        <div className="space-y-4">
          {PRACTICES.map((item, i) => (
            <div key={i} className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
              <h2 className="font-heading text-sm font-semibold text-foreground">{item.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <h2 className="font-heading text-sm font-semibold text-foreground">What this project does</h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Passwords are hashed with bcrypt; JWTs are signed with HS256 and a server secret; protected routes verify the token and roles. For a production system you would add HTTPS, shorter-lived tokens, and consider refresh tokens and secure cookie options.
          </p>
        </div>
      </div>
    </div>
  );
}
