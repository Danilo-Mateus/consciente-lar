import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, BookOpen } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { mockDb, Course } from "@/lib/mockDb";

export default function DashboardVoluntario() {
  const { profile } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (profile) setCourses(mockDb.myCourses(profile.id));
  }, [profile]);

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 container py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[hsl(var(--primary-dark))]">
              Olá, {profile?.full_name}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie e crie cursos para a comunidade.
            </p>
          </div>
          <Button size="lg" asChild>
            <Link to="/criar-curso">
              <Plus className="h-5 w-5 mr-2" /> Criar Novo Curso
            </Link>
          </Button>
        </div>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-[hsl(var(--primary-dark))]">
            Meus Cursos
          </h2>
          {courses.length === 0 ? (
            <div className="mt-6 border border-dashed border-border rounded-2xl p-12 text-center">
              <BookOpen className="h-10 w-10 mx-auto text-muted-foreground" />
              <p className="mt-3 text-muted-foreground">
                Você ainda não publicou nenhum curso.
              </p>
              <Button className="mt-4" asChild>
                <Link to="/criar-curso">Criar primeiro curso</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map((c) => (
                <Link
                  to={`/curso/${c.id}`}
                  key={c.id}
                  className="block bg-background border border-border rounded-xl p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-soft)] hover:border-primary/40 transition"
                >
                  <span className="inline-block text-xs font-medium px-2 py-1 rounded-md bg-secondary text-[hsl(var(--primary-dark))]">
                    {c.category}
                  </span>
                  <h3 className="mt-3 font-semibold text-[hsl(var(--primary-dark))]">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Publicado em{" "}
                    {new Date(c.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
