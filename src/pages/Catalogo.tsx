import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/utils/supabase";
import { listCourses } from "@/services/courses";
import type { Course } from "@/utils/supabase";

const CATEGORIES: (Category | "all")[] = [
  "all",
  "Pré-adoção",
  "Pós-adoção",
  "Acolhimento Institucional",
  "Aspectos Jurídicos",
];

export default function Catalogo() {
  const [filter, setFilter] = useState<Category | "all">("all");
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    listCourses(filter).then(setCourses).catch(() => setCourses([]));
  }, [filter]);

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 container py-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[hsl(var(--primary-dark))]">
              Catálogo de Cursos
            </h1>
            <p className="text-muted-foreground mt-1">
              Cursos gratuitos criados por profissionais voluntários.
            </p>
          </div>
          <div className="md:w-64">
            <Select value={filter} onValueChange={(v) => setFilter(v as Category | "all")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c === "all" ? "Todas as Categorias" : c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {courses.length === 0 ? (
          <p className="mt-12 text-center text-muted-foreground">
            Nenhum curso disponível nesta categoria.
          </p>
        ) : (
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((c) => (
              <Link
                key={c.id}
                to={`/curso/${c.id}`}
                className="block bg-background border border-border rounded-xl p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-soft)] hover:border-primary/40 transition"
              >
                <span className="inline-block text-xs font-medium px-2 py-1 rounded-md bg-secondary text-[hsl(var(--primary-dark))]">
                  {c.category}
                </span>
                <h3 className="mt-3 font-semibold text-lg text-[hsl(var(--primary-dark))]">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {c.description}
                </p>
                <div className="mt-4 pt-4 border-t border-border text-sm">
                  <p className="font-medium text-[hsl(var(--primary-dark))]">
                    {c.volunteer?.full_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {c.volunteer?.specialty}
                  </p>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Publicado em {new Date(c.created_at).toLocaleDateString("pt-BR")}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
