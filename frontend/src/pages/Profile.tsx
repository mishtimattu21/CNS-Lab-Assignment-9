import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
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

function getTokenExpiry(token: string): { exp?: number; iat?: number; expiresIn?: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    if (payload.exp) {
      const now = Math.floor(Date.now() / 1000);
      const secLeft = payload.exp - now;
      const hours = Math.floor(secLeft / 3600);
      const mins = Math.floor((secLeft % 3600) / 60);
      payload.expiresIn = secLeft <= 0 ? "Expired" : `${hours}h ${mins}m`;
    }
    return payload;
  } catch {
    return null;
  }
}

export default function Profile() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!user) return <Navigate to="/" replace />;

  const tokenInfo = getTokenExpiry(user.token);

  const copyToken = () => {
    navigator.clipboard.writeText(user.token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-10 px-4">
      <div className="mx-auto max-w-xl space-y-8">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your account and session details.</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-4">
          <h2 className="font-heading text-sm font-semibold text-foreground">Account</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Username</dt><dd className="font-mono text-foreground">{user.username}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Email</dt><dd className="font-mono text-foreground break-all">{user.email}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">User ID</dt><dd className="font-mono text-foreground">{user.id}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Roles</dt><dd className="font-mono text-foreground">{user.roles.join(", ") || "—"}</dd></div>
          </dl>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-4">
          <h2 className="font-heading text-sm font-semibold text-foreground">JWT token</h2>
          <p className="text-xs text-muted-foreground">Your current access token (preview). Do not share it.</p>
          <div className="rounded-lg bg-muted/50 p-3 font-mono text-xs text-foreground break-all">
            {user.token.slice(0, 50)}…
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copyToken}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              {copied ? "Copied!" : "Copy full token"}
            </button>
          </div>
          {tokenInfo && (tokenInfo.expiresIn || tokenInfo.exp) && (
            <div className="text-xs text-muted-foreground">
              {tokenInfo.expiresIn && <span>Expires: {tokenInfo.expiresIn}</span>}
              {tokenInfo.exp && (
                <span className="ml-4">
                  Expiry timestamp: {new Date(tokenInfo.exp * 1000).toLocaleString()}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
