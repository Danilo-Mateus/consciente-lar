import { createClient } from '@supabase/supabase-js';

// IMPORTANTE: Configure estas variáveis com as credenciais do seu projeto Supabase
// Você pode encontrá-las em: https://supabase.com/dashboard/project/_/settings/api
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase não configurado. Verifique suas variáveis de ambiente:');
    console.error('VITE_SUPABASE_URL:', supabaseUrl);
    console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Presente' : '❌ Ausente');
    throw new Error('Missing Supabase environment variables');
}

console.log('✅ Supabase configurado com sucesso!');
console.log('URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Definição dos tipos do banco de dados do Constroi Vínculo
export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    email: string;
                    full_name: string;
                    user_type: 'volunteer' | 'aluno';
                    cpf: string;
                    specialty: string | null;
                    institution_id: number | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    email: string;
                    full_name: string;
                    user_type: 'volunteer' | 'aluno';
                    cpf: string;
                    specialty?: string | null;
                    institution_id?: number | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    email?: string;
                    full_name?: string;
                    user_type?: 'volunteer' | 'aluno';
                    cpf?: string;
                    specialty?: string | null;
                    institution_id?: number | null;
                    created_at?: string;
                };
            };
            institutions: {
                Row: {
                    id: number;
                    cnpj: string;
                    nome_fantasia: string;
                    created_at: string;
                };
                Insert: {
                    id?: number;
                    cnpj: string;
                    nome_fantasia: string;
                    created_at?: string;
                };
                Update: {
                    id?: number;
                    cnpj?: string;
                    nome_fantasia?: string;
                    created_at?: string;
                };
            };
            courses: {
                Row: {
                    id: number;
                    volunteer_id: string;
                    title: string;
                    description: string;
                    category: 'Pré-adoção' | 'Pós-adoção' | 'Acolhimento Institucional' | 'Aspectos Jurídicos';
                    video_url: string;
                    extra_material: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: number;
                    volunteer_id: string;
                    title: string;
                    description: string;
                    category: 'Pré-adoção' | 'Pós-adoção' | 'Acolhimento Institucional' | 'Aspectos Jurídicos';
                    video_url: string;
                    extra_material?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: number;
                    volunteer_id?: string;
                    title?: string;
                    description?: string;
                    category?: 'Pré-adoção' | 'Pós-adoção' | 'Acolhimento Institucional' | 'Aspectos Jurídicos';
                    video_url?: string;
                    extra_material?: string | null;
                    created_at?: string;
                };
            };
            enrollments: {
                Row: {
                    id: number;
                    alumni_id: string;
                    course_id: number;
                    enrolled_at: string;
                };
                Insert: {
                    id?: number;
                    alumni_id: string;
                    course_id: number;
                    enrolled_at?: string;
                };
                Update: {
                    id?: number;
                    alumni_id?: string;
                    course_id?: number;
                    enrolled_at?: string;
                };
            };
        };
    };
};