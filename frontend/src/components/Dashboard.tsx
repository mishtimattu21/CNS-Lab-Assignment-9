import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { testEndpointWithFlow, type ClientServerMessage } from "@/lib/api";
import {
  BookOpen,
  User,
  Route,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
  ArrowRight,
  Monitor,
  Server,
} from "lucide-react";

const ENDPOINTS = [
  { path: "all", label: "Public", desc: "No JWT required", auth: false },
  { path: "user", label: "User", desc: "JWT required", auth: true },
  { path: "mod", label: "Moderator", desc: "JWT + moderator role", auth: true },
  { path: "admin", label: "Admin", desc: "JWT + admin role", auth: true },
] as const;

interface TestResult {
  path: string;
  response: string;
  ok: boolean;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [results, setResults] = useState<TestResult[]>([]);
  const [loadingPath, setLoadingPath] = useState<string | null>(null);
  const [lastFlow, setLastFlow] = useState<ClientServerMessage | null>(null);

  if (!user) return null;

  const callEndpoint = async (path: string) => {
    setLoadingPath(path);
    setLastFlow(null);
    try {
      const flow = await testEndpointWithFlow(path, user.token);
      setLastFlow(flow);
      setResults((prev) => [
        { path, response: flow.responseBody || flow.responseStatus.toString(), ok: flow.ok },
        ...prev.filter((r) => r.path !== path),
      ]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Request failed";
      setResults((prev) => [
        { path, response: msg, ok: false },
        ...prev.filter((r) => r.path !== path),
      ]);
    } finally {
      setLoadingPath(null);
    }
  };

  return (
    <div className="w-full h-full min-h-0 flex flex-col lg:flex-row">
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* LEFT PART: Static — How JWT works here + Your session (no scroll) */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="flex-shrink-0 lg:w-[min(48%,420px)] lg:pr-6 flex flex-col gap-6 overflow-hidden border-0 lg:border-r-2 lg:border-border/70">
        <section className="rounded-2xl border border-border/50 bg-gradient-to-br from-primary/5 to-transparent p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="h-4 w-4" />
            </div>
            <h2 className="section-heading">How JWT works here</h2>
          </div>
          <ol className="list-decimal list-inside space-y-2.5 text-sm leading-relaxed text-muted-foreground">
            <li>You signed in; the server issued a <strong className="text-foreground">JWT (access token)</strong>.</li>
            <li>The token is stored and sent in the <code className="rounded bg-muted/80 px-1.5 py-0.5 text-foreground">x-access-token</code> header for protected APIs.</li>
            <li>Use the route cards below to call each endpoint and see which require the token or a specific role.</li>
          </ol>
        </section>

        <section>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <User className="h-4 w-4" />
            </div>
            <h2 className="section-heading">Your session</h2>
          </div>
          <div className="rounded-2xl border border-border/50 bg-muted/30 p-5 space-y-3">
            <Row label="Username" value={user.username} />
            <Row label="Email" value={user.email} />
            <Row label="Roles" value={user.roles.join(", ") || "—"} />
            <Row label="User ID" value={String(user.id)} />
            <Row label="Token (preview)" value={user.token ? `${user.token.slice(0, 24)}…` : "—"} />
          </div>
        </section>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* RIGHT PART: Scrollable — Client–Server, Protected routes, API responses (scrollbar on right) */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 min-w-0 min-h-0 flex flex-col gap-6 overflow-y-auto overflow-x-hidden lg:pl-6">
        <section className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-5">
          <h2 className="section-heading flex items-center gap-2 mb-2">
            <Monitor className="h-4 w-4 text-primary" /> Client – Server Architecture
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            This app uses a <strong className="text-foreground">client–server</strong> model: the <strong className="text-foreground">client</strong> (browser) sends messages (HTTP requests) to the <strong className="text-foreground">server</strong> (API). The server processes the request and sends back a response. When you call a route below, the last exchange is shown here.
          </p>
          {lastFlow ? (
            <ClientServerFlowMessage flow={lastFlow} />
          ) : (
            <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 p-5 text-center text-sm text-muted-foreground">
              <Route className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No request yet. Click a route below to see the client → server message flow.</p>
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Route className="h-4 w-4" />
            </div>
            <h2 className="section-heading">Protected routes</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4 pl-11">
            Click a route to call the API. Your JWT is sent automatically when required.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {ENDPOINTS.map((ep) => {
              const loading = loadingPath === ep.path;
              return (
                <button
                  key={ep.path}
                  type="button"
                  onClick={() => callEndpoint(ep.path)}
                  disabled={loading}
                  className="group flex flex-col items-start rounded-xl border border-border/50 bg-card p-4 text-left transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm disabled:opacity-70"
                >
                  <span className="font-mono text-sm font-medium text-foreground flex items-center gap-1.5">
                    /api/test/{ep.path}
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 -ml-1 group-hover:opacity-100 transition-opacity" />
                  </span>
                  <span className="mt-1.5 text-xs text-muted-foreground">{ep.desc}</span>
                  {loading && (
                    <span className="mt-2 flex items-center gap-1.5 text-xs text-primary">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Calling…
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {results.length > 0 && (
          <section>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MessageSquare className="h-4 w-4" />
              </div>
              <h2 className="section-heading">API responses</h2>
            </div>
            <div className="space-y-2.5">
              {results.map((r) => (
                <div
                  key={r.path}
                  className={`flex items-start gap-3 rounded-xl border px-4 py-3.5 font-mono text-sm ${
                    r.ok
                      ? "border-emerald-200/70 bg-emerald-50/60 text-foreground"
                      : "border-amber-200/70 bg-amber-50/50 text-amber-900"
                  }`}
                >
                  {r.ok ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-muted-foreground">{r.path}</span>
                    <span className="mx-1.5">·</span>
                    <span className={r.ok ? "text-foreground" : "text-amber-800"}>{r.response}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 text-sm">
      <span className="min-w-[110px] font-medium text-muted-foreground">{label}</span>
      <span className="font-mono text-foreground break-all">{value}</span>
    </div>
  );
}

function ClientServerFlowMessage({ flow }: { flow: ClientServerMessage }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card space-y-4 p-4 font-mono text-xs">
      <div className="flex items-start gap-3">
        <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-blue-100 text-blue-800 px-2 py-1">
          <Monitor className="h-3.5 w-3.5" /> Client
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="text-muted-foreground">Sends message to server:</div>
          <div className="rounded bg-muted/50 px-2 py-1.5 break-all">
            <span className="text-foreground font-medium">{flow.method}</span> {flow.url}
          </div>
          <div className="text-muted-foreground mt-2">Headers:</div>
          <pre className="rounded bg-muted/50 px-2 py-1.5 overflow-x-auto whitespace-pre-wrap break-all">
            {Object.entries(flow.requestHeaders).map(([k, v]) => `${k}: ${k === "x-access-token" ? "[JWT present]" : v}`).join("\n")}
          </pre>
        </div>
      </div>
      <div className="flex justify-center">
        <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
      </div>
      <div className="flex items-start gap-3">
        <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-100 text-emerald-800 px-2 py-1">
          <Server className="h-3.5 w-3.5" /> Server
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="text-muted-foreground">Responds to client:</div>
          <div className="rounded bg-muted/50 px-2 py-1.5">
            Status: <span className={flow.ok ? "text-emerald-600 font-medium" : "text-amber-600 font-medium"}>{flow.responseStatus}</span>
          </div>
          <div className="text-muted-foreground mt-2">Body:</div>
          <pre className="rounded bg-muted/50 px-2 py-1.5 overflow-x-auto whitespace-pre-wrap break-all text-foreground">
            {flow.responseBody}
          </pre>
        </div>
      </div>
    </div>
  );
}
