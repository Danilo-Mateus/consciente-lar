// Mock backend storage using localStorage. Replace with Supabase calls later.

export type UserType = "volunteer" | "aluno";

export interface Profile {
  id: string;
  full_name: string;
  user_type: UserType;
  cpf: string;
  specialty?: string;
  institution_id?: number;
  email: string;
  created_at: string;
}

export interface Institution {
  id: number;
  cnpj: string;
  nome_fantasia: string;
  created_at: string;
}

export type Category =
  | "Pré-adoção"
  | "Pós-adoção"
  | "Acolhimento Institucional"
  | "Aspectos Jurídicos";

export interface Course {
  id: number;
  volunteer_id: string;
  title: string;
  description: string;
  category: Category;
  video_url: string;
  extra_material?: string;
  created_at: string;
}

export interface Enrollment {
  id: number;
  alumni_id: string;
  course_id: number;
  enrolled_at: string;
}

interface AuthRecord {
  email: string;
  password: string;
  profileId: string;
}

interface DbShape {
  profiles: Profile[];
  institutions: Institution[];
  courses: Course[];
  enrollments: Enrollment[];
  auth: AuthRecord[];
  session: string | null; // profileId
}

const KEY = "constroi_vinculo_db_v1";

function load(): DbShape {
  const raw = localStorage.getItem(KEY);
  if (raw) return JSON.parse(raw);
  const seed: DbShape = {
    profiles: [
      {
        id: "vol-seed-1",
        full_name: "Dra. Ana Beatriz Lima",
        user_type: "volunteer",
        cpf: "111.222.333-44",
        specialty: "Psicóloga Clínica",
        email: "ana@exemplo.com",
        created_at: new Date().toISOString(),
      },
    ],
    institutions: [],
    courses: [
      {
        id: 1,
        volunteer_id: "vol-seed-1",
        title: "Preparando-se para a adoção: o que esperar",
        description:
          "Um panorama dos primeiros passos emocionais e práticos para famílias que iniciam o processo de adoção.",
        category: "Pré-adoção",
        video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        extra_material:
          "Guia da habilitação - https://www.cnj.jus.br\nLivro recomendado: Adoção - Construindo Famílias",
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        volunteer_id: "vol-seed-1",
        title: "Vínculos saudáveis no pós-adoção",
        description:
          "Estratégias para fortalecer o vínculo familiar nos primeiros meses de convivência.",
        category: "Pós-adoção",
        video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        created_at: new Date().toISOString(),
      },
    ],
    enrollments: [],
    auth: [{ email: "ana@exemplo.com", password: "123456", profileId: "vol-seed-1" }],
    session: null,
  };
  localStorage.setItem(KEY, JSON.stringify(seed));
  return seed;
}

function save(db: DbShape) {
  localStorage.setItem(KEY, JSON.stringify(db));
}

function uid() {
  return "u-" + Math.random().toString(36).slice(2, 10);
}

// ========= Auth =========

export interface SignUpInput {
  email: string;
  password: string;
  full_name: string;
  cpf: string;
  user_type: UserType;
  specialty?: string;
  institution?: { cnpj: string; nome_fantasia: string };
}

export const mockDb = {
  signUp(input: SignUpInput): Profile {
    const db = load();
    if (db.auth.find((a) => a.email.toLowerCase() === input.email.toLowerCase())) {
      throw new Error("Email já em uso");
    }
    if (db.profiles.find((p) => p.cpf === input.cpf)) {
      throw new Error("CPF já cadastrado");
    }
    let institution_id: number | undefined;
    if (input.institution) {
      let inst = db.institutions.find((i) => i.cnpj === input.institution!.cnpj);
      if (!inst) {
        inst = {
          id: (db.institutions.at(-1)?.id ?? 0) + 1,
          cnpj: input.institution.cnpj,
          nome_fantasia: input.institution.nome_fantasia,
          created_at: new Date().toISOString(),
        };
        db.institutions.push(inst);
      }
      institution_id = inst.id;
    }
    const profile: Profile = {
      id: uid(),
      full_name: input.full_name,
      user_type: input.user_type,
      cpf: input.cpf,
      specialty: input.specialty,
      institution_id,
      email: input.email,
      created_at: new Date().toISOString(),
    };
    db.profiles.push(profile);
    db.auth.push({ email: input.email, password: input.password, profileId: profile.id });
    db.session = profile.id;
    save(db);
    return profile;
  },

  signIn(email: string, password: string): Profile {
    const db = load();
    const rec = db.auth.find(
      (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password,
    );
    if (!rec) throw new Error("Email ou senha inválidos");
    db.session = rec.profileId;
    save(db);
    return db.profiles.find((p) => p.id === rec.profileId)!;
  },

  signOut() {
    const db = load();
    db.session = null;
    save(db);
  },

  currentProfile(): Profile | null {
    const db = load();
    if (!db.session) return null;
    return db.profiles.find((p) => p.id === db.session) ?? null;
  },

  // ========= Courses =========
  listCourses(category?: Category | "all"): (Course & { volunteer: Profile })[] {
    const db = load();
    return db.courses
      .filter((c) => !category || category === "all" || c.category === category)
      .map((c) => ({
        ...c,
        volunteer: db.profiles.find((p) => p.id === c.volunteer_id)!,
      }))
      .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  },

  getCourse(id: number): (Course & { volunteer: Profile }) | null {
    const db = load();
    const c = db.courses.find((x) => x.id === id);
    if (!c) return null;
    return { ...c, volunteer: db.profiles.find((p) => p.id === c.volunteer_id)! };
  },

  myCourses(volunteerId: string): Course[] {
    const db = load();
    return db.courses
      .filter((c) => c.volunteer_id === volunteerId)
      .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  },

  createCourse(input: Omit<Course, "id" | "created_at">): Course {
    const db = load();
    const course: Course = {
      ...input,
      id: (db.courses.at(-1)?.id ?? 0) + 1,
      created_at: new Date().toISOString(),
    };
    db.courses.push(course);
    save(db);
    return course;
  },

  // ========= Enrollments =========
  isEnrolled(alumniId: string, courseId: number): boolean {
    const db = load();
    return !!db.enrollments.find(
      (e) => e.alumni_id === alumniId && e.course_id === courseId,
    );
  },

  enroll(alumniId: string, courseId: number) {
    const db = load();
    if (db.enrollments.find((e) => e.alumni_id === alumniId && e.course_id === courseId))
      return;
    db.enrollments.push({
      id: (db.enrollments.at(-1)?.id ?? 0) + 1,
      alumni_id: alumniId,
      course_id: courseId,
      enrolled_at: new Date().toISOString(),
    });
    save(db);
  },

  myEnrollments(alumniId: string): (Enrollment & { course: Course })[] {
    const db = load();
    return db.enrollments
      .filter((e) => e.alumni_id === alumniId)
      .map((e) => ({ ...e, course: db.courses.find((c) => c.id === e.course_id)! }))
      .filter((e) => e.course)
      .sort((a, b) => (a.enrolled_at < b.enrolled_at ? 1 : -1));
  },
};

// Initialize on first import
load();
