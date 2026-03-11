import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { signin, signup } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { KeyRound, UserPlus, LogIn } from "lucide-react";
import { z } from "zod";

const signinSchema = z.object({
  username: z.string().trim().min(1, "Required").max(50),
  password: z.string().min(1, "Required").max(100),
});

const signupSchema = z.object({
  username: z.string().trim().min(3, "At least 3 characters").max(50),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "At least 6 characters").max(100),
});

type View = "signin" | "signup";

export default function AuthPanel() {
  const { login } = useAuth();
  const [view, setView] = useState<View>("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState<string[]>([]);

  const reset = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setRoles([]);
    setError("");
  };

  const switchView = (v: View) => {
    reset();
    setView(v);
  };

  const toggleRole = (role: string) => {
    setRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = signinSchema.safeParse({ username, password });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      const data = await signin({ username: result.data.username, password: result.data.password });
      login(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = signupSchema.safeParse({ username, email, password });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      await signup({
        username: result.data.username,
        email: result.data.email,
        password: result.data.password,
        roles: roles.length > 0 ? roles : undefined,
      });
      toast.success("Account created!", {
        description: "Please sign in with your credentials.",
      });
      switchView("signin");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex gap-3 rounded-lg border border-border/50 bg-muted/20 p-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <KeyRound className="h-3.5 w-3.5" />
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground pt-0.5">
          Sign up or sign in. After login you’ll receive a{" "}
          <strong className="text-foreground">JWT</strong> for protected routes.
        </p>
      </div>

      {view === "signin" ? (
        <form onSubmit={handleSignin} className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <LogIn className="h-3.5 w-3.5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-foreground">Sign in</h2>
              <p className="text-xs text-muted-foreground">Enter your credentials.</p>
            </div>
          </div>

          <FieldBlock label="Username" value={username} onChange={setUsername} placeholder="Your username" />
          <FieldBlock label="Password" value={password} onChange={setPassword} type="password" placeholder="Your password" />

          {error && <ErrorLine message={error} />}

          <Button type="submit" disabled={loading} className="w-full rounded-lg font-medium py-2 text-sm">
            {loading ? "Signing in…" : "Sign in"}
          </Button>

          <p className="text-center text-xs text-muted-foreground pt-0.5">
            Don’t have an account?{" "}
            <button type="button" onClick={() => switchView("signup")} className="font-medium text-primary underline underline-offset-2 hover:no-underline">
              Create one
            </button>
          </p>
        </form>
      ) : (
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserPlus className="h-3.5 w-3.5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-foreground">Create account</h2>
              <p className="text-xs text-muted-foreground">Register to get a JWT.</p>
            </div>
          </div>

          <FieldBlock label="Username" value={username} onChange={setUsername} placeholder="Choose a username" />
          <FieldBlock label="Email" value={email} onChange={setEmail} type="email" placeholder="you@example.com" />
          <FieldBlock label="Password" value={password} onChange={setPassword} type="password" placeholder="At least 6 characters" />

          <div className="space-y-2">
            <label className="block text-xs font-medium text-foreground">Role (optional)</label>
            <div className="flex flex-wrap gap-1.5">
              {["user", "moderator", "admin"].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    roles.includes(role)
                      ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {error && <ErrorLine message={error} />}

          <Button type="submit" disabled={loading} className="w-full rounded-lg font-medium py-2 text-sm">
            {loading ? "Creating account…" : "Create account"}
          </Button>

          <p className="text-center text-xs text-muted-foreground pt-0.5">
            Already have an account?{" "}
            <button type="button" onClick={() => switchView("signin")} className="font-medium text-primary underline underline-offset-2 hover:no-underline">
              Sign in
            </button>
          </p>
        </form>
      )}
    </div>
  );
}

function FieldBlock({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-colors"
        autoComplete={type === "password" ? "current-password" : undefined}
      />
    </div>
  );
}

function ErrorLine({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-amber-200/80 bg-amber-50/80 px-3 py-2 text-xs text-amber-800">
      {message}
    </div>
  );
}
