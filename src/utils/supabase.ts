import { createClient } from "@supabase/supabase-js";

// Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env quando for conectar.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder-anon-key";

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    "⚠️ Supabase ainda não conectado. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserType = "volunteer" | "aluno";
export type Category =
  | "Pré-adoção"
  | "Pós-adoção"
  | "Acolhimento Institucional"
  | "Aspectos Jurídicos";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  user_type: UserType;
  cpf: string;
  specialty?: string | null;
  institution_id?: number | null;
  created_at: string;
}

export interface Course {
  id: number;
  volunteer_id: string;
  title: string;
  description: string;
  category: Category;
  video_url: string;
  extra_material?: string | null;
  created_at: string;
  volunteer?: { full_name: string; specialty?: string | null };
}

export interface Enrollment {
  id: number;
  alumni_id: string;
  course_id: number;
  enrolled_at: string;
  course?: Course;
}

export interface Rating {
  id: number;
  course_id: number;
  user_id: string;
  stars: number;
  created_at: string;
}

export interface Comment {
  id: number;
  course_id: number;
  user_id: string;
  content: string;
  created_at: string;
  user?: { full_name: string };
}

export interface Report {
  id: number;
  course_id: number;
  user_id: string;
  reason: string;
  created_at: string;
}
