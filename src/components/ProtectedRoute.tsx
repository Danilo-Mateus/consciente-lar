import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserType } from "@/utils/supabase";

interface Props {
  children: JSX.Element;
  allow?: UserType;
}

export default function ProtectedRoute({ children, allow }: Props) {
  const { profile, loading } = useAuth();
  if (loading) return (
  <div className="min-h-screen flex items-center justify-center">
    <p className="text-muted-foreground">Carregando...</p>
  </div>
);
  if (!profile) return <Navigate to="/login" replace />;
  if (allow && profile.user_type !== allow) {
    return (
      <Navigate
        to={profile.user_type === "volunteer" ? "/dashboard-voluntario" : "/catalogo"}
        replace
      />
    );
  }
  return children;
}
