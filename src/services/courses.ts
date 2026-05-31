import {
  supabase,
  Category,
  Course,
  Enrollment,
  Rating,
  Comment,
  Report,
} from "@/utils/supabase";

export async function listCourses(category?: Category | "all"): Promise<Course[]> {
  let query = supabase
    .from("courses")
    .select("*, volunteer:profiles!courses_volunteer_id_fkey(full_name, specialty)")
    .order("created_at", { ascending: false });
  if (category && category !== "all") query = query.eq("category", category);
  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as Course[];
}

export async function getCourse(id: number): Promise<Course | null> {
  const { data, error } = await supabase
    .from("courses")
    .select("*, volunteer:profiles!courses_volunteer_id_fkey(full_name, specialty)")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as Course;
}

export async function createCourse(input: Omit<Course, "id" | "created_at" | "volunteer">) {
  const { data, error } = await supabase.from("courses").insert(input).select().single();
  if (error) throw error;
  return data as Course;
}

export async function updateCourse(id: number, input: Partial<Omit<Course, "id" | "created_at" | "volunteer_id">>) {
  const { data, error } = await supabase.from("courses").update(input).eq("id", id).select().single();
  if (error) throw error;
  return data as Course;
}

export async function deleteCourse(id: number) {
  const { error } = await supabase.from("courses").delete().eq("id", id);
  if (error) throw error;
}

export async function myCourses(volunteerId: string): Promise<Course[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("volunteer_id", volunteerId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as Course[];
}

export async function enroll(userId: string, courseId: number) {
  const { error } = await supabase
    .from("enrollments")
    .insert({ alumni_id: userId, course_id: courseId });
  if (error) throw error;
}

export async function isEnrolled(userId: string, courseId: number): Promise<boolean> {
  const { data } = await supabase
    .from("enrollments")
    .select("id")
    .eq("alumni_id", userId)
    .eq("course_id", courseId)
    .maybeSingle();
  return !!data;
}

export async function myEnrollments(userId: string): Promise<Enrollment[]> {
  const { data, error } = await supabase
    .from("enrollments")
    .select("*, course:courses(*)")
    .eq("alumni_id", userId)
    .order("enrolled_at", { ascending: false });
  if (error) throw error;
  return (data || []) as Enrollment[];
}

// ---- Ratings ----
export async function getRatings(courseId: number): Promise<{ avg: number; count: number; mine?: number }> {
  const { data, error } = await supabase.from("ratings").select("stars,user_id").eq("course_id", courseId);
  if (error) return { avg: 0, count: 0 };
  const list = (data || []) as { stars: number; user_id: string }[];
  if (!list.length) return { avg: 0, count: 0 };
  const avg = list.reduce((s, r) => s + r.stars, 0) / list.length;
  const { data: auth } = await supabase.auth.getUser();
  const mine = auth.user ? list.find((r) => r.user_id === auth.user!.id)?.stars : undefined;
  return { avg, count: list.length, mine };
}

export async function rateCourse(userId: string, courseId: number, stars: number) {
  const { error } = await supabase
    .from("ratings")
    .upsert({ user_id: userId, course_id: courseId, stars }, { onConflict: "user_id,course_id" });
  if (error) throw error;
}
export async function getVolunteerEmail(volunteerId: string): Promise<string | null> {
  const { data } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", volunteerId)
    .single();
  return data?.email || null;
}
export async function listComments(courseId: number): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("course_id", courseId)
    .order("created_at", { ascending: false });
  if (error) throw error;

  const comments = (data || []) as Comment[];

  // Busca os nomes dos usuários separadamente
  const userIds = [...new Set(comments.map((c) => c.user_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", userIds);

  return comments.map((c) => ({
    ...c,
    user: profiles?.find((p) => p.id === c.user_id)
      ? { full_name: profiles.find((p) => p.id === c.user_id)!.full_name }
      : undefined,
  }));
}

export async function addComment(userId: string, courseId: number, content: string) {
  const { error } = await supabase
    .from("comments")
    .insert({ user_id: userId, course_id: courseId, content });
  if (error) throw error;
}


export async function reportCourse(userId: string, courseId: number, reason: string) {
  const { error } = await supabase
    .from("reports")
    .insert({ user_id: userId, course_id: courseId, reason });
  if (error) throw error;
}
