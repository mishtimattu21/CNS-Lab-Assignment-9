import { useState } from "react";

function base64UrlDecode(str: string): string {
  try {
    const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, "=");
    return decodeURIComponent(
      atob(padded)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch {
    return "";
  }
}

export default function JWTDecoder() {
  const [input, setInput] = useState("");
  const [header, setHeader] = useState<string | null>(null);
  const [payload, setPayload] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const decode = () => {
    setError(null);
    setHeader(null);
    setPayload(null);
    const trimmed = input.trim();
    if (!trimmed) {
      setError("Enter a JWT to decode.");
      return;
    }
    const parts = trimmed.split(".");
    if (parts.length !== 3) {
      setError("Invalid JWT: expected 3 parts (header.payload.signature).");
      return;
    }
    try {
      const headerJson = base64UrlDecode(parts[0]);
      const payloadJson = base64UrlDecode(parts[1]);
      setHeader(JSON.stringify(JSON.parse(headerJson), null, 2));
      setPayload(JSON.stringify(JSON.parse(payloadJson), null, 2));
    } catch (e) {
      setError("Failed to decode: invalid base64 or JSON in header/payload.");
    }
  };

  return (
    <div className="py-10 px-4">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">JWT Decoder</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Paste a JWT below to decode its <strong className="text-foreground">header</strong> and <strong className="text-foreground">payload</strong>. The signature is not verified here (client-side only).
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <h2 className="font-heading text-sm font-semibold text-foreground mb-2">JWT structure</h2>
          <p className="text-sm text-muted-foreground mb-4">
            A JWT has three base64url-encoded parts separated by dots: <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">header.payload.signature</code>. The header usually contains <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">alg</code> and <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">typ</code>. The payload contains claims (e.g. <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">sub</code>, <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">iat</code>, <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">exp</code>, <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">id</code>).
          </p>
          <textarea
            placeholder="Paste your JWT here (e.g. eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 font-mono text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[120px]"
            rows={4}
          />
          <button
            type="button"
            onClick={decode}
            className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Decode JWT
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {(header !== null || payload !== null) && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <h3 className="font-heading text-sm font-semibold text-foreground mb-2">Header</h3>
              <pre className="overflow-x-auto rounded-lg bg-background p-4 font-mono text-xs text-foreground whitespace-pre-wrap break-all">
                {header}
              </pre>
            </div>
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <h3 className="font-heading text-sm font-semibold text-foreground mb-2">Payload (claims)</h3>
              <pre className="overflow-x-auto rounded-lg bg-background p-4 font-mono text-xs text-foreground whitespace-pre-wrap break-all">
                {payload}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
