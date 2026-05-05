import { Link, Navigate } from "react-router-dom";
import { GraduationCap, Settings, Heart, HandHeart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/AppHeader";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { profile, loading } = useAuth();
  if (loading) return null;
  if (profile)
    return (
      <Navigate
        to={profile.user_type === "volunteer" ? "/dashboard-voluntario" : "/catalogo"}
        replace
      />
    );

  return (
    <div
      className="min-h-screen flex flex-col bg-fixed bg-center bg-cover bg-no-repeat"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1920")',
      }}
    >
      <div className="bg-white/85 backdrop-blur-sm flex flex-col min-h-screen">
        <AppHeader />

        {/* Hero */}
        <section className="py-20 md:py-28">
          <div className="container grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-[hsl(var(--primary-dark))]">
                Conhecimento especializado para transformar a jornada da adoção
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                O Portal ConscienteLar conecta profissionais voluntários a pais
                adotantes e instituições de acolhimento, oferecendo cursos gratuitos
                sobre os desafios reais de quem acolhe e adota.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button size="lg" asChild>
                  <Link to="/cadastro?tipo=voluntario">Quero ser Voluntário</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/cadastro?tipo=aluno">Quero Aprender</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-3xl bg-white shadow-[var(--shadow-soft)] flex items-center justify-center">
                <div className="grid grid-cols-2 gap-6 p-10">
                  <div className="aspect-square rounded-2xl bg-secondary flex items-center justify-center">
                    <GraduationCap className="h-12 w-12 text-primary" />
                  </div>
                  <div className="aspect-square rounded-2xl bg-primary flex items-center justify-center">
                    <Heart className="h-12 w-12 text-primary-foreground" fill="currentColor" />
                  </div>
                  <div className="aspect-square rounded-2xl bg-primary flex items-center justify-center">
                    <Users className="h-12 w-12 text-primary-foreground" />
                  </div>
                  <div className="aspect-square rounded-2xl bg-secondary flex items-center justify-center">
                    <HandHeart className="h-12 w-12 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Como funciona */}
        <section className="py-20 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold text-center text-[hsl(var(--primary-dark))]">
              Como Funciona
            </h2>
            <div className="mt-12 grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: GraduationCap,
                  title: "1. Profissionais se Voluntariam",
                  text: "Psicólogos, pedagogos, advogados e outros especialistas compartilham seu conhecimento criando cursos gratuitos.",
                },
                {
                  icon: Settings,
                  title: "2. A Plataforma Organiza",
                  text: "Os cursos são organizados por categorias como Pré-adoção, Pós-adoção e Acolhimento Institucional.",
                },
                {
                  icon: Heart,
                  title: "3. Famílias e Instituições Aprendem",
                  text: "Pais adotantes e profissionais de abrigos acessam os cursos gratuitamente e aplicam o conhecimento.",
                },
              ].map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="text-center p-6 rounded-xl border border-border shadow-[var(--shadow-card)]"
                >
                  <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-secondary flex items-center justify-center">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg text-[hsl(var(--primary-dark))]">
                    {title}
                  </h3>
                  <p className="mt-2 text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Para quem */}
        <section className="py-20 bg-secondary">
          <div className="container">
            <h2 className="text-3xl font-bold text-center text-[hsl(var(--primary-dark))]">
              Feito Para
            </h2>
            <div className="mt-12 grid md:grid-cols-2 gap-8">
              <div className="bg-background rounded-2xl p-8 shadow-[var(--shadow-card)]">
                <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center">
                  <HandHeart className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mt-4 text-2xl font-bold text-[hsl(var(--primary-dark))]">
                  Você, Profissional
                </h3>
                <p className="mt-1 font-medium text-primary">Doe seu conhecimento</p>
                <p className="mt-3 text-muted-foreground">
                  Transforme sua expertise em impacto social. Crie cursos e ajude a
                  capacitar quem está na linha de frente do acolhimento.
                </p>
                <Button className="mt-6" asChild>
                  <Link to="/cadastro?tipo=voluntario">Cadastrar como Voluntário</Link>
                </Button>
              </div>
              <div className="bg-background rounded-2xl p-8 shadow-[var(--shadow-card)]">
                <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mt-4 text-2xl font-bold text-[hsl(var(--primary-dark))]">
                  Você, Pai/Mãe ou Instituição
                </h3>
                <p className="mt-1 font-medium text-primary">Acesse conhecimento</p>
                <p className="mt-3 text-muted-foreground">
                  Encontre cursos práticos sobre adaptação familiar, traumas, aspectos
                  jurídicos e muito mais.
                </p>
                <Button className="mt-6" variant="outline" asChild>
                  <Link to="/cadastro?tipo=aluno">Explorar Cursos</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-[hsl(var(--primary-dark))] text-white py-8 mt-auto">
          <div className="container text-center text-sm">
            Portal ConscienteLar — Projeto Acadêmico 2026. Conectando conhecimento,
            transformando vidas.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;