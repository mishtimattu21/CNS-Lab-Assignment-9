import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LogOut, User, Info, Shield, Home, UserCircle, Key, BookOpen, Lock } from "lucide-react";

const DETAILS_ITEMS: { label: string; value: string }[] = [
  { label: "Name", value: "Mishti Mattu" },
  { label: "Registration No", value: "23BCE1067" },
  { label: "Course Code", value: "BCSE309L" },
  { label: "Course Name", value: "Cryptography and Network Security" },
  { label: "Slot", value: "L1+L2" },
];

function JWTFlowFigure() {
  return (
    <div className="my-4 rounded-xl border border-border/60 bg-muted/20 p-4 overflow-x-auto">
      <svg viewBox="0 0 520 200" className="w-full min-h-[180px]" style={{ color: "hsl(var(--foreground))" }} aria-label="JWT authentication flow">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
          </marker>
        </defs>
        <rect x="20" y="60" width="80" height="80" rx="8" fill="hsl(var(--primary) / 0.12)" stroke="hsl(var(--primary))" strokeWidth="1.5" />
        <text x="60" y="105" textAnchor="middle" fill="currentColor" fontSize="12" fontWeight="600">Client</text>
        <text x="60" y="122" textAnchor="middle" fill="currentColor" fontSize="10" opacity="0.7">(Browser)</text>
        <rect x="260" y="60" width="80" height="80" rx="8" fill="hsl(var(--primary) / 0.12)" stroke="hsl(var(--primary))" strokeWidth="1.5" />
        <text x="300" y="105" textAnchor="middle" fill="currentColor" fontSize="12" fontWeight="600">Server</text>
        <text x="300" y="122" textAnchor="middle" fill="currentColor" fontSize="10" opacity="0.7">(Node/Express)</text>
        <rect x="420" y="60" width="80" height="80" rx="8" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1.5" />
        <text x="460" y="105" textAnchor="middle" fill="currentColor" fontSize="12" fontWeight="600">Database</text>
        <text x="460" y="122" textAnchor="middle" fill="currentColor" fontSize="10" opacity="0.7">(Supabase)</text>
        <line x1="100" y1="100" x2="250" y2="100" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrowhead)" opacity="0.7" />
        <text x="175" y="92" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.8">username, password</text>
        <line x1="260" y1="100" x2="110" y2="100" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrowhead)" opacity="0.7" strokeDasharray="4 2" />
        <text x="185" y="118" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.8">JWT + user info</text>
        <line x1="100" y1="140" x2="250" y2="140" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrowhead)" opacity="0.7" />
        <text x="175" y="132" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.8">x-access-token: JWT</text>
        <line x1="340" y1="100" x2="412" y2="100" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrowhead)" opacity="0.5" />
      </svg>
      <p className="text-xs text-muted-foreground text-center mt-2">Figure 1: JWT authentication and protected request flow</p>
    </div>
  );
}

const navLinkClass = "text-sm text-muted-foreground hover:text-foreground transition-colors";
const activeClass = "text-foreground font-medium";

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-b from-orange-50/60 via-background to-background">
      <nav className="flex items-center justify-between border-b border-border/60 bg-white/70 backdrop-blur-md px-4 py-2.5">
        <div className="flex items-center gap-6">
          <Link to="/" className={`text-sm font-medium ${location.pathname === "/" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            CNS Experiment · JWT
          </Link>
          <div className="hidden sm:flex items-center gap-1">
            <Link to="/" className={`px-2 py-1 rounded-lg ${location.pathname === "/" ? activeClass : navLinkClass}`}>
              <Home className="h-3.5 w-3.5 inline mr-1" /> Home
            </Link>
            {user && (
              <>
                <Link to="/profile" className={`px-2 py-1 rounded-lg ${location.pathname === "/profile" ? activeClass : navLinkClass}`}>
                  <UserCircle className="h-3.5 w-3.5 inline mr-1" /> Profile
                </Link>
              </>
            )}
            <Link to="/jwt-decoder" className={`px-2 py-1 rounded-lg ${location.pathname === "/jwt-decoder" ? activeClass : navLinkClass}`}>
              <Key className="h-3.5 w-3.5 inline mr-1" /> JWT Decoder
            </Link>
            <Link to="/api-reference" className={`px-2 py-1 rounded-lg ${location.pathname === "/api-reference" ? activeClass : navLinkClass}`}>
              <BookOpen className="h-3.5 w-3.5 inline mr-1" /> API Reference
            </Link>
            <Link to="/security" className={`px-2 py-1 rounded-lg ${location.pathname === "/security" ? activeClass : navLinkClass}`}>
              <Lock className="h-3.5 w-3.5 inline mr-1" /> Security
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => setDetailsOpen(true)} className="gap-1.5 text-muted-foreground hover:bg-muted/80 hover:text-foreground rounded-lg">
            <User className="h-3.5 w-3.5" /> Details
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setAboutOpen(true)} className="gap-1.5 text-muted-foreground hover:bg-muted/80 hover:text-foreground rounded-lg">
            <Info className="h-3.5 w-3.5" /> About
          </Button>
          {user && (
            <Button variant="ghost" size="sm" onClick={logout} className="gap-1.5 text-muted-foreground hover:bg-muted/80 hover:text-foreground rounded-lg">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </Button>
          )}
        </div>
      </nav>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Details</DialogTitle>
            <DialogDescription>Student and course information.</DialogDescription>
          </DialogHeader>
          <dl className="space-y-3 pt-2">
            {DETAILS_ITEMS.map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-4 py-2 border-b border-border/50 last:border-0">
                <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
                <dd className="text-sm font-medium text-foreground text-right">{value}</dd>
              </div>
            ))}
          </dl>
        </DialogContent>
      </Dialog>

      <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> About this project</DialogTitle>
            <DialogDescription>JWT-based authentication and authorization web application.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2 text-sm text-foreground">
            <section>
              <h3 className="font-semibold text-foreground mb-2">What it does</h3>
              <p className="leading-relaxed text-muted-foreground">
                This is a full-stack web application that implements <strong className="text-foreground">JSON Web Token (JWT)</strong> for
                authentication and role-based authorization. Users can sign up and sign in; on successful login the server issues a JWT.
                The frontend stores the token and sends it in the <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">x-access-token</code> header
                when calling protected API routes. The server verifies the JWT and checks the user’s roles (user, moderator, admin) to allow or deny access.
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-foreground mb-2">How it works</h3>
              <ul className="list-disc list-inside space-y-1.5 text-muted-foreground leading-relaxed">
                <li><strong className="text-foreground">Sign up:</strong> Username, email, and password are stored in the database (Supabase/PostgreSQL). Passwords are hashed with bcrypt. Optional roles can be assigned.</li>
                <li><strong className="text-foreground">Sign in:</strong> The server checks credentials and, if valid, signs a JWT (with a secret and expiry, e.g. 24 hours) and returns it with user info.</li>
                <li><strong className="text-foreground">Token storage:</strong> The frontend keeps the JWT in <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">localStorage</code> and attaches it to requests that need authentication.</li>
                <li><strong className="text-foreground">Protected routes:</strong> Endpoints like <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">/api/test/user</code>, <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">/api/test/mod</code>, and <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">/api/test/admin</code> require a valid JWT; some also require specific roles.</li>
                <li><strong className="text-foreground">Verification:</strong> The backend verifies the JWT signature and expiry, reads the user id from the token, loads roles from the database, and then allows or denies the request.</li>
              </ul>
            </section>
            <JWTFlowFigure />
            <section>
              <h3 className="font-semibold text-foreground mb-2">Tech stack</h3>
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Backend:</strong> Node.js, Express, jsonwebtoken (JWT), bcryptjs, Sequelize, Supabase (PostgreSQL).
                <strong className="text-foreground block mt-1">Frontend:</strong> React, TypeScript, Vite; token sent via the <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">x-access-token</code> header.
              </p>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      <main className="flex-1 min-h-0 flex flex-col">
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-border/50 bg-muted/20 py-3 px-4 text-center text-xs text-muted-foreground">
        CNS Experiment · Cryptography and Network Security · JWT Web Application
      </footer>
    </div>
  );
}
