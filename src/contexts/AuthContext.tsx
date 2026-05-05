import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { mockDb, Profile, SignUpInput } from "@/lib/mockDb";

interface AuthCtx {
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<Profile>;
  signUp: (input: SignUpInput) => Promise<Profile>;
  signOut: () => void;
}

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProfile(mockDb.currentProfile());
    setLoading(false);
  }, []);

  const value: AuthCtx = {
    profile,
    loading,
    async signIn(email, password) {
      const p = mockDb.signIn(email, password);
      setProfile(p);
      return p;
    },
    async signUp(input) {
      const p = mockDb.signUp(input);
      setProfile(p);
      return p;
    },
    signOut() {
      mockDb.signOut();
      setProfile(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
