// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/utils/supabase";
import { User } from "@supabase/supabase-js";

// Interfaces alinhadas com o mockDb
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  user_type: "volunteer" | "aluno";
  cpf: string;
  specialty?: string;
  institution_id?: number;
  created_at: string;
}

export interface SignUpInput {
  email: string;
  password: string;
  full_name: string;
  cpf: string;
  user_type: "volunteer" | "aluno";
  specialty?: string;
  institution?: { cnpj: string; nome_fantasia: string };
}

interface AuthCtx {
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<Profile>;
  signUp: (input: SignUpInput) => Promise<Profile>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data as Profile;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  };

  const handleInstitution = async (institution?: { cnpj: string; nome_fantasia: string }) => {
    if (!institution) return null;

    // Verifica se instituição já existe
    const { data: existing } = await supabase
      .from("institutions")
      .select("id")
      .eq("cnpj", institution.cnpj)
      .single();

    if (existing) return existing.id;

    // Cria nova instituição
    const { data: newInst, error } = await supabase
      .from("institutions")
      .insert([{
        cnpj: institution.cnpj,
        nome_fantasia: institution.nome_fantasia
      }])
      .select()
      .single();

    if (error) throw error;
    return newInst.id;
  };

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);

      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const userProfile = await fetchProfile(session.user.id);
        setProfile(userProfile);
      }

      setLoading(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const userProfile = await fetchProfile(session.user.id);
          setProfile(userProfile);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<Profile> => {
    try {
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      if (!authData.user) throw new Error("Usuário não encontrado");

      const userProfile = await fetchProfile(authData.user.id);
      if (!userProfile) throw new Error("Perfil não encontrado");

      setProfile(userProfile);
      return userProfile;
    } catch (error: any) {
      console.error("Sign in error:", error);
      throw new Error(error.message || "Erro ao fazer login");
    }
  };

  const signUp = async (input: SignUpInput): Promise<Profile> => {
    try {
      // Processar instituição se for voluntário
      let institution_id = null;
      if (input.user_type === 'volunteer' && input.institution) {
        institution_id = await handleInstitution(input.institution);
      }

      // Criar usuário no Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: {
            full_name: input.full_name,
            user_type: input.user_type,
            cpf: input.cpf,
            specialty: input.specialty || null,
          },
        },
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error("Erro ao criar usuário");

      // Atualizar o perfil com institution_id se necessário
      if (institution_id) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ institution_id })
          .eq("id", authData.user.id);

        if (updateError) throw updateError;
      }

      // Buscar o perfil criado
      const userProfile = await fetchProfile(authData.user.id);
      if (!userProfile) throw new Error("Erro ao carregar perfil");

      setProfile(userProfile);
      return userProfile;
    } catch (error: any) {
      console.error("Sign up error:", error);
      throw new Error(error.message || "Erro ao criar conta");
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setProfile(null);
    } catch (error: any) {
      console.error("Sign out error:", error);
      throw new Error(error.message || "Erro ao fazer logout");
    }
  };

  const value: AuthCtx = {
    profile,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}