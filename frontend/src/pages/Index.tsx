import { useAuth } from "@/context/AuthContext";
import AuthPanel from "@/components/AuthPanel";
import Dashboard from "@/components/Dashboard";

export default function Index() {
  const { user } = useAuth();

  return (
    <div className={`flex-1 flex flex-col min-h-0 ${user ? "py-6 px-4" : "py-6 px-4 flex items-center justify-center"}`}>
      <div className={`mx-auto w-full flex-1 flex flex-col min-h-0 ${user ? "max-w-6xl overflow-hidden min-h-0" : "flex items-center justify-center"}`}>
        {user ? <Dashboard /> : (
          <div className="w-full max-w-sm">
            <AuthPanel />
          </div>
        )}
      </div>
    </div>
  );
}
