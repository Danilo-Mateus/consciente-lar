import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { mockDb } from "@/lib/mockDb";

function toEmbed(url: string) {
  // Convert common YouTube URLs to embed form
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com") && u.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
    }
    if (u.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    return url;
  } catch {
    return url;
  }
}

export default function CursoDetalhes() {
  const { id } = useParams();
  const { profile } = useAuth();
  const courseId = Number(id);
  const course = mockDb.getCourse(courseId);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    if (profile && course) setEnrolled(mockDb.isEnrolled(profile.id, course.id));
  }, [profile, course]);

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <AppHeader />
        <main className="flex-1 container py-12 text-center">
          <p className="text-muted-foreground">Curso não encontrado.</p>
          <Button className="mt-4" asChild>
            <Link to="/catalogo">Voltar ao catálogo</Link>
          </Button>
        </main>
      </div>
    );
  }

  const isOwner =
    profile?.user_type === "volunteer" && profile.id === course.volunteer_id;
  const isAluno = profile?.user_type === "aluno";

  const handleEnroll = () => {
    mockDb.enroll(profile!.id, course.id);
    setEnrolled(true);
    toast.success("Inscrição realizada com sucesso!");
  };

  const materials = (course.extra_material || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 container py-10 max-w-4xl">
        <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-md bg-secondary text-[hsl(var(--primary-dark))]">
          {course.category}
        </span>
        <h1 className="mt-3 text-3xl md:text-4xl font-bold text-[hsl(var(--primary-dark))]">
          {course.title}
        </h1>
        <div className="mt-3 text-sm text-muted-foreground">
          Por{" "}
          <span className="font-medium text-[hsl(var(--primary-dark))]">
            {course.volunteer?.full_name}
          </span>{" "}
          · {course.volunteer?.specialty}
        </div>

        <div className="mt-8 aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-[var(--shadow-soft)]">
          <iframe
            src={toEmbed(course.video_url)}
            title={course.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-[hsl(var(--primary-dark))]">
            Sobre o curso
          </h2>
          <p className="mt-3 text-muted-foreground whitespace-pre-line">
            {course.description}
          </p>
        </section>

        {materials.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold text-[hsl(var(--primary-dark))]">
              Material Complementar
            </h2>
            <ul className="mt-3 space-y-2">
              {materials.map((m, i) => {
                const url = m.match(/https?:\/\/\S+/)?.[0];
                return (
                  <li key={i} className="text-sm">
                    {url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline break-all"
                      >
                        {m}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">{m}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <div className="mt-10">
          {isOwner && (
            <div className="rounded-xl border border-border bg-secondary/50 p-4 text-sm font-medium text-[hsl(var(--primary-dark))]">
              Este é seu curso.
            </div>
          )}
          {isAluno && (
            <Button
              size="lg"
              className="w-full md:w-auto"
              disabled={enrolled}
              onClick={handleEnroll}
            >
              {enrolled ? (
                <>
                  <CheckCircle2 className="h-5 w-5 mr-2" /> Você já está inscrito
                </>
              ) : (
                "Inscrever-se"
              )}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
