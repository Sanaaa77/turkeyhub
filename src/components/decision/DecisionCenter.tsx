"use client";
import React from "react";
import { PremiumCard, MagneticButton } from "@/components/ui/PremiumComponents";
import { 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRightLeft,
  Zap,
  Target,
  ArrowRight,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { useJourney } from "@/hooks/useJourney";
import { cn } from "@/lib/utils";

interface InsightBoxProps {
  title: string;
  pros: string[];
  cons: string[];
}

const InsightBox = ({ title, pros, cons }: InsightBoxProps) => (
  <div className="space-y-8">
    <div className="font-black text-lg border-b border-white/5 pb-4 text-foreground">{title}</div>
    <div className="space-y-4">
      {pros.map((p) => (
        <div key={p} className="flex items-center justify-end gap-3 text-sm font-bold text-green-500/80">
          {p} <ThumbsUp className="w-4 h-4" />
        </div>
      ))}
      {cons.map((c) => (
        <div key={c} className="flex items-center justify-end gap-3 text-sm font-bold text-red-500/80">
          {c} <ThumbsDown className="w-4 h-4" />
        </div>
      ))}
    </div>
  </div>
);

export const DecisionCenter = () => {
  const { user } = useJourney();

  const userName = (user as any).first_name || (user as any).name || "دانشجو";
  const userMajor = (user as any).preferred_major || (user as any).major || "رشته انتخابی";

  return (
    <section id="decision-center" className="py-32 px-6 bg-[#020617] relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6 border-white/5">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-xs font-black tracking-widest uppercase">Decision Engine 2.0</span>
          </div>
          <h2 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter text-foreground text-right md:text-center">اتاق فکر <br /><span className="text-primary">مسیر {userName}.</span></h2>
          <p className="text-muted text-xl max-w-2xl mx-auto text-right md:text-center leading-relaxed">ما با تحلیل تمام متغیرها، بهترین مسیر برای شروع رشته {userMajor} رو برات مهندسی کردیم.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            <PremiumCard className="p-12">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-2xl font-black flex items-center gap-3 text-foreground">
                  <ArrowRightLeft className="text-primary" /> تحلیل تضادها (Trade-offs)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-right">
                <InsightBox 
                  title="دانشگاه کوچ" 
                  pros={["رنکینگ جهانی درخشان", "امنیت شغلی بالا در اروپا"]} 
                  cons={["هزینه زندگی بالا", "دوری از مرکز شهر"]} 
                />
                <InsightBox 
                  title="دانشگاه باهچه‌شهیر" 
                  pros={["لوکیشن طلایی در قلب استانبول", "بورسیه در دسترس‌تر"]} 
                  cons={["رنکینگ علمی پایین‌تر", "کلاس‌های شلوغ‌تر"]} 
                />
              </div>

              <div className="mt-16 p-10 bg-primary/5 border border-primary/10 rounded-card relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Zap className="w-24 h-24" />
                </div>
                <div className="text-right relative z-10">
                   <h4 className="text-xl font-black mb-4 flex items-center justify-end gap-2 text-foreground">
                     پیشنهاد نهایی مشاور <CheckCircle2 className="w-5 h-5 text-primary" />
                   </h4>
                   <p className="text-sm text-muted leading-relaxed max-w-xl ml-auto">
                     با توجه به معدل {user.gpa} شما، پیشنهاد ما تمرکز روی **بورسیه ۵۰٪ باهچه‌شهیر** است. این گزینه بهترین تعادل رو بین «هزینه» و «کیفیت لایف‌استایل» در استانبول برات می‌سازه.
                   </p>
                </div>
              </div>
            </PremiumCard>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-xl font-black mb-8 px-4 text-right text-foreground">اقدام بعدی شما</h3>
            <PremiumCard className="p-10 border-primary/20 bg-primary/5">
               <div className="text-right space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                    <ArrowRight className="w-6 h-6 rotate-180" />
                  </div>
                  <h4 className="text-2xl font-black tracking-tight text-foreground">رزرو وقت مشاوره جهت اپلای بورسیه</h4>
                  <p className="text-xs text-muted leading-relaxed">ددلاین دریافت بورسیه‌های تشویقی دانشگاه باهچه‌شهیر فقط ۱۰ روز دیگر به اتمام می‌رسد.</p>
                  <MagneticButton className="w-full py-5 text-lg font-black shadow-xl">تایید و رزرو وقت</MagneticButton>
               </div>
            </PremiumCard>

            <PremiumCard className="p-8">
               <div className="flex items-center gap-6 text-right">
                  <div className="flex-1 text-right">
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-1">Confidence</div>
                    <div className="text-2xl font-black text-green-500">۹۴٪</div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-muted"><AlertTriangle className="opacity-20" /></div>
               </div>
               <p className="text-[10px] text-muted font-bold mt-4 leading-relaxed text-right">این تحلیل بر اساس دیتای ۱۲,۰۰۰ پرونده مشابه شما انجام شده است.</p>
            </PremiumCard>
          </div>
        </div>
      </div>
    </section>
  );
};
