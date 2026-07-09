"use client";
import React from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { PremiumCard } from "@/components/ui/PremiumComponents";
import { ACADEMY_COURSES, ACADEMY_LESSONS, ACADEMY_MODULES } from "@/data/academyData";
import { BookOpen, FileUp, Layers3, ListChecks, Video } from "lucide-react";

const adminTools = [
  { title: "Manage Courses", value: ACADEMY_COURSES.length, icon: <BookOpen /> },
  { title: "Manage Modules", value: ACADEMY_MODULES.length, icon: <Layers3 /> },
  { title: "Manage Lessons", value: ACADEMY_LESSONS.length, icon: <ListChecks /> },
  { title: "Upload Videos", value: "MP4/HLS", icon: <Video /> },
  { title: "Upload PDFs", value: "Secure", icon: <FileUp /> },
];

export default function AcademyAdminPage() {
  return (
    <PortalLayout>
      <div className="space-y-8 py-6 text-right">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Academy Management</span>
          <h1 className="text-4xl font-black mt-2">کنترل محتوای آکادمی زبان</h1>
          <p className="mt-3 opacity-50">Manage courses, modules, lessons, quizzes, vocabulary, XP rewards, and publish states from the integrated platform admin.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">{adminTools.map(tool => <PremiumCard key={tool.title} className="p-6"><div className="text-primary mb-4">{tool.icon}</div><div className="text-2xl font-black">{tool.value}</div><div className="text-xs opacity-40 mt-1 font-bold">{tool.title}</div></PremiumCard>)}</div>
        <PremiumCard className="p-8">
          <div className="flex items-center justify-between mb-6"><button className="rounded-2xl bg-primary px-5 py-3 text-sm font-black text-white">Create lesson</button><h2 className="text-2xl font-black">Publish Queue</h2></div>
          <div className="overflow-hidden rounded-3xl border border-white/10"><table className="w-full text-sm"><thead className="bg-white/5 text-white/40"><tr><th className="p-4 text-right">Status</th><th className="p-4 text-right">XP</th><th className="p-4 text-right">Readiness</th><th className="p-4 text-right">Lesson</th></tr></thead><tbody>{ACADEMY_LESSONS.map(lesson => <tr key={lesson.id} className="border-t border-white/5"><td className="p-4"><span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-300">{lesson.status}</span></td><td className="p-4">{lesson.xp_reward}</td><td className="p-4">+{lesson.readiness_gain}%</td><td className="p-4 font-bold">{lesson.title}</td></tr>)}</tbody></table></div>
        </PremiumCard>
      </div>
    </PortalLayout>
  );
}
