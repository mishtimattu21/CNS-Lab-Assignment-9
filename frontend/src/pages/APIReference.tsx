const API_DOCS = [
  {
    method: "POST",
    path: "/api/auth/signup",
    auth: "No",
    description: "Register a new user. Send username, email, password; optionally roles (array of 'user' | 'moderator' | 'admin').",
    body: { username: "string", email: "string", password: "string", roles: "string[] (optional)" },
  },
  {
    method: "POST",
    path: "/api/auth/signin",
    auth: "No",
    description: "Authenticate and receive a JWT. Send username and password. Returns accessToken, id, username, email, roles.",
    body: { username: "string", password: "string" },
  },
  {
    method: "GET",
    path: "/api/test/all",
    auth: "No",
    description: "Public endpoint. Returns a message without requiring authentication.",
    body: null,
  },
  {
    method: "GET",
    path: "/api/test/user",
    auth: "JWT required",
    description: "Protected endpoint. Requires valid JWT in x-access-token header. Any authenticated user can access.",
    body: null,
  },
  {
    method: "GET",
    path: "/api/test/mod",
    auth: "JWT + Moderator or Admin",
    description: "Protected endpoint. Requires valid JWT and moderator or admin role.",
    body: null,
  },
  {
    method: "GET",
    path: "/api/test/admin",
    auth: "JWT + Admin",
    description: "Protected endpoint. Requires valid JWT and admin role.",
    body: null,
  },
];

export default function APIReference() {
  return (
    <div className="py-10 px-4">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">API Reference</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete list of backend endpoints for this JWT application. Base URL: <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">http://localhost:8080</code>
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
          <div className="border-b border-border/60 bg-muted/30 px-4 py-3">
            <h2 className="font-heading text-sm font-semibold text-foreground">Endpoints</h2>
          </div>
          <div className="divide-y divide-border/50">
            {API_DOCS.map((api, i) => (
              <div key={i} className="p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded px-2 py-0.5 text-xs font-semibold ${
                    api.method === "GET" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                  }`}>
                    {api.method}
                  </span>
                  <code className="font-mono text-sm text-foreground">{api.path}</code>
                  <span className="text-xs text-muted-foreground">· Auth: {api.auth}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{api.description}</p>
                {api.body && (
                  <p className="mt-1 text-xs text-muted-foreground font-mono">
                    Request body: {JSON.stringify(api.body)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-muted/20 p-6">
          <h2 className="font-heading text-sm font-semibold text-foreground mb-2">Example: Protected request</h2>
          <p className="text-sm text-muted-foreground mb-3">Include the JWT in the request header when calling protected routes:</p>
          <pre className="rounded-lg bg-background p-4 font-mono text-xs text-foreground overflow-x-auto">
{`fetch('http://localhost:8080/api/test/user', {
  headers: {
    'x-access-token': '<your-jwt>',
    'Content-Type': 'application/json'
  }
});`}
          </pre>
        </div>
      </div>
    </div>
  );
}
