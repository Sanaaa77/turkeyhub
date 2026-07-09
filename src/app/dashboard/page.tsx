"use client";
import React, { useState, useEffect } from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { PremiumCard } from "@/components/ui/PremiumComponents";
import { 
  CheckCircle, 
  Clock, 
  ArrowUpRight, 
  Calendar, 
  FileText,
  MessageSquare,
  HelpCircle,
  Zap,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useJourney } from "@/hooks/useJourney";
import { JOURNEY_STEPS } from "@/data/userJourney";
import { ApplicationService, NotificationService } from "@/services";
import { AcademyDashboardWidgets } from "@/components/academy/AcademyDashboardWidgets";

export default function Dashboard() {
  const { user, progress, currentStep, completeTask, tasks } = useJourney();
  const [appCount, setAppCount] = useState(0);
  const [notifCount, setNotifCount] = useState(0);
  const nextTask = tasks.find(t => t.status === "pending");
  const currentStepInfo = JOURNEY_STEPS.find(s => s.id === currentStep);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [apps, notifs] = await Promise.all([
          ApplicationService.getMyApplications(),
          NotificationService.getMyNotifications()
        ]);
        setAppCount(apps.length);
        setNotifCount(notifs.filter(n => !n.read).length);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <PortalLayout>
      <div className="space-y-10 py-6">
        {/* Living Header: Next Step Logic */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <PremiumCard className="lg:col-span-2 p-10 bg-gradient-to-br from-primary/10 to-transparent flex flex-col justify-between border-primary/20">
            <div className="text-right">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                <Zap className="w-3 h-3 fill-current" /> وضعیت لحظه‌ای مسیر
              </span>
              <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">گام فعلی: {currentStepInfo?.label}</h1>
              <p className="opacity-60 text-lg leading-relaxed max-w-xl">
                شما {Math.round(progress)}٪ از کل مسیر مهاجرت رو با موفقیت طی کردید. تمرکز فعلی ما روی «{currentStepInfo?.label}» هست.
              </p>
            </div>
            <div className="flex gap-4 mt-12 justify-end">
              <button className="glass px-8 py-4 rounded-2xl font-black text-sm">جزئیات گام {currentStep}</button>
              <button className="bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-primary/20 text-sm">اقدام بعدی</button>
            </div>
          </PremiumCard>

          {/* Living Widget: Urgent Action */}
          <PremiumCard className="p-10 flex flex-col justify-between border-accent/20 bg-accent/5">
            <div className="text-right">
              <div className="text-[10px] font-black tracking-widest uppercase opacity-40 mb-2">Priority Action</div>
              {nextTask ? (
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-accent">{nextTask.label}</h3>
                  <p className="text-sm opacity-50 font-bold">انجام این وظیفه برای ورود به مرحله «ویزای تحصیلی» حیاتی است.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-green-500">تمام وظایف انجام شد!</h3>
                  <p className="text-sm opacity-50 font-bold">منتظر تایید نهایی از سمت دانشگاه باشید.</p>
                </div>
              )}
            </div>
            {nextTask && (
              <button 
                onClick={() => completeTask(nextTask.id)}
                className="w-full bg-accent text-black py-4 rounded-2xl font-black mt-8 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
              >
                <span>تکمیل و ارسال</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </PremiumCard>
        </div>

        <AcademyDashboardWidgets />

        {/* Dynamic Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="اپلیکیشن‌های فعال" value={appCount.toString()} icon={<Zap className="text-primary" />} />
          <StatCard label="مدارک تایید شده" value={`${tasks.filter(t => t.status === "completed").length}/${tasks.length}`} icon={<FileText className="text-green-500" />} />
          <StatCard label="روز تا ددلاین بعدی" value="۱۲" icon={<Clock className="text-accent" />} />
          <StatCard label="پیام‌های جدید" value={notifCount.toString()} icon={<MessageSquare className="text-purple-500" />} />
        </div>

        {/* Application Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <PremiumCard className="lg:col-span-8 p-10">
            <h3 className="text-2xl font-black mb-10 flex items-center gap-3 justify-end">
               زمان‌بندی اپلای (Fall 2026) <Calendar className="text-primary" />
            </h3>
            <div className="space-y-8 relative">
              <div className="absolute top-0 right-4 w-px h-full bg-white/5" />
              {tasks.slice(0, 4).map((task, i) => (
                <TimelineItem 
                  key={task.id}
                  status={task.status} 
                  title={task.label} 
                  date={task.due_date || "تعیین نشده"} 
                  desc={task.category || ""} 
                />
              ))}
            </div>
          </PremiumCard>

          <div className="lg:col-span-4 space-y-6">
            <PremiumCard className="p-8">
              <h4 className="font-black mb-6">پشتیبانی اختصاصی</h4>
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/20 overflow-hidden">
                  <img src="https://i.pravatar.cc/100?u=advisor" alt="Advisor" />
                </div>
                <div>
                  <div className="text-sm font-black">علیرضا محمدی</div>
                  <div className="text-[10px] opacity-40 font-bold uppercase tracking-widest">ارشد پذیرش</div>
                </div>
              </div>
              <button className="w-full bg-primary py-4 rounded-xl font-black text-sm shadow-lg shadow-primary/20">پیام به مشاور</button>
            </PremiumCard>

            <PremiumCard className="p-8 border-dashed border-white/20 hover:border-primary/50 transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/5 rounded-xl group-hover:text-primary transition-colors"><HelpCircle /></div>
                <ArrowUpRight className="w-5 h-5 opacity-20" />
              </div>
              <h5 className="font-bold mb-2">راهنمای اسکان</h5>
              <p className="text-xs opacity-40 leading-relaxed">چگونه بهترین خوابگاه را در استانبول رزرو کنیم؟</p>
            </PremiumCard>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

const StatCard = ({ label, value, icon }: { label: string, value: string, icon: any }) => (
  <PremiumCard className="p-6 flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">{icon}</div>
      <ArrowUpRight className="w-4 h-4 opacity-20" />
    </div>
    <div>
      <div className="text-3xl font-black tracking-tighter">{value}</div>
      <div className="text-[10px] font-black uppercase tracking-widest opacity-30 mt-1">{label}</div>
    </div>
  </PremiumCard>
);

const TimelineItem = ({ status, title, date, desc }: { status: "completed" | "pending" | "locked", title: string, date: string, desc: string }) => (
  <div className="flex gap-6 relative group">
    <div className={cn(
      "w-8 h-8 rounded-full border-4 border-[#030712] flex items-center justify-center shrink-0 z-10 transition-all",
      status === 'completed' ? 'bg-primary shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 
      status === 'pending' ? 'bg-accent animate-pulse' : 'bg-white/10'
    )}>
      {status === 'completed' && <CheckCircle className="w-3 h-3 text-white" />}
    </div>
    <div className="flex-1 text-right">
      <div className="flex justify-between items-start mb-1">
        <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">{date}</span>
        <h4 className={cn("font-bold text-lg transition-colors", status === 'locked' ? 'opacity-40' : 'opacity-100')}>{title}</h4>
      </div>
      <p className="text-sm opacity-40 leading-relaxed">{desc}</p>
    </div>
  </div>
);
