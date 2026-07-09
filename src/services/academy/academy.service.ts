import { getSupabaseClient } from "@/lib/supabase/utils";
import { ACADEMY_DASHBOARD } from "@/data/academyData";
import { AcademyDashboard, StudentLessonCompletion } from "@/types/database";

const readinessAfterCompletion = (dashboard: AcademyDashboard, lessonId: string): AcademyDashboard => {
  const lesson = dashboard.lessons.find((item) => item.id === lessonId) || dashboard.todayLesson;
  const completion: StudentLessonCompletion = {
    id: `local-${lesson.id}`,
    profile_id: dashboard.progress.profile_id,
    lesson_id: lesson.id,
    score: 92,
    xp_earned: lesson.xp_reward,
    readiness_gain: lesson.readiness_gain,
    completed_at: new Date().toISOString(),
  };

  return {
    ...dashboard,
    progress: {
      ...dashboard.progress,
      total_xp: dashboard.progress.total_xp + lesson.xp_reward,
      level: Math.floor((dashboard.progress.total_xp + lesson.xp_reward) / 500) + 1,
      language_readiness: Math.min(100, dashboard.progress.language_readiness + lesson.readiness_gain),
      overall_readiness: Math.min(100, dashboard.progress.overall_readiness + lesson.readiness_gain * 0.35),
      last_lesson_id: lesson.id,
      updated_at: completion.completed_at,
    },
    recentCompletions: [completion, ...dashboard.recentCompletions].slice(0, 5),
    readinessGainToday: lesson.readiness_gain,
    weeklyCompleted: dashboard.weeklyCompleted + 1,
  };
};

export const AcademyService = {
  async getDashboard(): Promise<AcademyDashboard> {
    const supabase = getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return ACADEMY_DASHBOARD;

    const [{ data: progress }, { data: completions }] = await Promise.all([
      supabase.from("academy_student_progress").select("*").eq("profile_id", user.id).maybeSingle(),
      supabase.from("academy_lesson_completions").select("*").eq("profile_id", user.id).order("completed_at", { ascending: false }).limit(5),
    ]);

    return {
      ...ACADEMY_DASHBOARD,
      progress: progress ? { ...ACADEMY_DASHBOARD.progress, ...progress } : { ...ACADEMY_DASHBOARD.progress, profile_id: user.id },
      recentCompletions: (completions as StudentLessonCompletion[] | null) || ACADEMY_DASHBOARD.recentCompletions,
    };
  },

  async completeLesson(lessonId: string): Promise<AcademyDashboard> {
    const supabase = getSupabaseClient();
    const dashboard = await this.getDashboard();
    const nextDashboard = readinessAfterCompletion(dashboard, lessonId);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return nextDashboard;

    const lesson = nextDashboard.lessons.find((item) => item.id === lessonId) || nextDashboard.todayLesson;
    await supabase.from("academy_lesson_completions").upsert({
      profile_id: user.id,
      lesson_id: lesson.id,
      score: 92,
      xp_earned: lesson.xp_reward,
      readiness_gain: lesson.readiness_gain,
    }, { onConflict: "profile_id,lesson_id" });

    await supabase.from("academy_student_progress").upsert({
      ...nextDashboard.progress,
      profile_id: user.id,
    }, { onConflict: "profile_id" });

    return nextDashboard;
  },
};
