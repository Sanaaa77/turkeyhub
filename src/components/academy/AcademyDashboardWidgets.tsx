"use client";
import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Flame, GraduationCap, Medal, Sparkles, Target, Trophy, Zap } from "lucide-react";
import { PremiumCard } from "@/components/ui/PremiumComponents";
import { useAcademy } from "@/hooks/useAcademy";

const Skeleton = () => <div className="h-32 animate-pulse rounded-3xl bg-white/5" />;

export const AcademyDashboardWidgets = () => {
  const { data, isLoading, isError, completeLesson, isCompletingLesson } = useAcademy();
  if (isLoading) return <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)}</div>;
  if (isError || !data) return <PremiumCard className="p-8 border-red-500/30 text-right"><h3 className="font-black text-red-300">Academy temporarily unavailable</h3><p className="text-sm opacity-50 mt-2">Your readiness data is safe. Refresh the dashboard to try again.</p></PremiumCard>;

  const lesson = data.todayLesson;
  const xpIntoLevel = data.progress.total_xp % 500;
  const xpPercent = (xpIntoLevel / 500) * 100;

  return (
    <section className="space-y-6" aria-label="Language Academy readiness widgets">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 text-right">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest"><GraduationCap className="w-3 h-3" /> Language Academy</span>
          <h2 className="text-3xl font-black mt-3">آکادمی زبان متصل به آمادگی دانشگاه</h2>
          <p className="text-sm opacity-50 mt-2">English and Turkish lessons now directly increase Language Readiness and Overall University Readiness.</p>
        </div>
        <div className="text-left text-sm opacity-60">Updated readiness: <b className="text-white">{Math.round(data.progress.overall_readiness)}%</b></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <PremiumCard className="xl:col-span-5 p-8 bg-gradient-to-br from-primary/15 to-transparent border-primary/20">
          <div className="flex items-start justify-between gap-6">
            <div className="p-3 rounded-2xl bg-primary/20 text-primary"><BookOpen /></div>
            <div className="text-right">
              <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Today’s Lesson</div>
              <h3 className="text-2xl font-black mt-2">{lesson.title}</h3>
              <p className="text-sm opacity-55 mt-3 leading-7">{lesson.summary}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 my-6 text-center">
            <Pill label="XP" value={`+${lesson.xp_reward}`} />
            <Pill label="Readiness" value={`+${lesson.readiness_gain}%`} />
            <Pill label="Minutes" value={lesson.duration_minutes.toString()} />
          </div>
          <button disabled={isCompletingLesson} onClick={() => completeLesson(lesson.id)} className="w-full rounded-2xl bg-primary py-4 font-black text-white shadow-xl shadow-primary/20 transition hover:scale-[1.01] disabled:opacity-50">Continue Learning</button>
        </PremiumCard>

        <PremiumCard className="xl:col-span-4 p-8 border-accent/20 bg-accent/5 text-right">
          <div className="flex items-center justify-end gap-3 mb-5"><h3 className="text-xl font-black">AI Study Coach</h3><Sparkles className="text-accent" /></div>
          <p className="leading-8 text-sm opacity-70">“{data.coachRecommendation}”</p>
          <div className="mt-6 rounded-2xl bg-black/20 p-4 border border-white/5"><span className="text-[10px] font-black uppercase tracking-widest opacity-40">Dream University Progress</span><Progress value={data.dreamUniversityProgress} /></div>
        </PremiumCard>

        <div className="xl:col-span-3 grid grid-cols-2 xl:grid-cols-1 gap-6">
          <Mini icon={<Flame />} label="Learning Streak" value={`${data.progress.current_streak} days`} />
          <Mini icon={<Zap />} label="Readiness Gain" value={`+${data.readinessGainToday}%`} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Metric icon={<Trophy />} label="XP Progress" value={`Level ${data.progress.level}`} percent={xpPercent} />
        <Metric icon={<Target />} label="Weekly Goal" value={`${data.weeklyCompleted}/${data.progress.weekly_goal_lessons} lessons`} percent={(data.weeklyCompleted / data.progress.weekly_goal_lessons) * 100} />
        <Metric icon={<BookOpen />} label="English Level" value={data.progress.english_level} percent={72} />
        <Metric icon={<GraduationCap />} label="Turkish Level" value={data.progress.turkish_level} percent={46} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PremiumCard className="p-7 text-right"><h3 className="font-black mb-5 flex justify-end gap-2"><Medal className="text-primary" /> Achievements</h3><div className="space-y-3">{data.achievements.map(a => <div key={a.id} className="flex items-center justify-between rounded-2xl bg-white/5 p-4"><span className="text-2xl">{a.badge_icon}</span><div><b>{a.title}</b><p className="text-xs opacity-40 mt-1">+{a.xp_reward} XP</p></div></div>)}</div></PremiumCard>
        <PremiumCard className="p-7 text-right"><h3 className="font-black mb-5">Daily & Weekly Missions</h3><div className="space-y-3">{data.missions.map(m => <div key={m.id} className="rounded-2xl bg-white/5 p-4"><div className="flex justify-between text-sm font-bold"><span>{m.progress}/{m.target}</span><span>{m.title}</span></div><Progress value={(m.progress / m.target) * 100} /></div>)}</div></PremiumCard>
        <PremiumCard className="p-7 text-right"><h3 className="font-black mb-5">Recently completed lessons</h3>{data.recentCompletions.length ? <div className="space-y-3">{data.recentCompletions.map(c => <div key={c.id} className="rounded-2xl bg-white/5 p-4 text-sm"><b>+{c.xp_earned} XP</b><span className="opacity-50"> · readiness +{c.readiness_gain}%</span></div>)}</div> : <Empty />}</PremiumCard>
      </div>
    </section>
  );
};

const Pill = ({ label, value }: { label: string; value: string }) => <div className="rounded-2xl bg-white/5 p-3"><div className="text-lg font-black">{value}</div><div className="text-[9px] uppercase tracking-widest opacity-35">{label}</div></div>;
const Progress = ({ value }: { value: number }) => <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, value)}%` }} className="h-full rounded-full bg-primary" /></div>;
const Mini = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => <PremiumCard className="p-6"><div className="flex items-center justify-between"><div className="text-primary">{icon}</div><div className="text-right"><div className="text-2xl font-black">{value}</div><div className="text-[10px] uppercase tracking-widest opacity-35">{label}</div></div></div></PremiumCard>;
const Metric = ({ icon, label, value, percent }: { icon: React.ReactNode; label: string; value: string; percent: number }) => <PremiumCard className="p-6"><div className="flex justify-between items-center"><div className="text-primary">{icon}</div><div className="text-right"><div className="font-black">{value}</div><div className="text-[10px] uppercase tracking-widest opacity-35">{label}</div></div></div><Progress value={percent} /></PremiumCard>;
const Empty = () => <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm opacity-40">Complete a lesson to build your calendar.</div>;
