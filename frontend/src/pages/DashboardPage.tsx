import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Dashboard from "@/components/Dashboard";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" replace />;

  return (
    <div className="py-10 px-4">
      <div className="mx-auto w-full max-w-xl card-surface p-8 md:p-10">
        <Dashboard />
      </div>
    </div>
  );
}
