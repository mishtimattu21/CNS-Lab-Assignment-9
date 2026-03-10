import { useAuth } from "@/context/AuthContext";
import AuthPanel from "@/components/AuthPanel";
import Dashboard from "@/components/Dashboard";

export default function Index() {
  const { user } = useAuth();

  return (
    <div className="py-10 px-4">
      <div className="mx-auto w-full max-w-xl card-surface p-8 md:p-10">
        {user ? <Dashboard /> : <AuthPanel />}
      </div>
    </div>
  );
}
