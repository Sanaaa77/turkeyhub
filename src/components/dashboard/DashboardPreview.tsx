"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  FileText, 
  Clock, 
  Bell, 
  Calendar,
  Settings,
  Check
} from "lucide-react";
import { PremiumCard } from "@/components/ui/PremiumComponents";

export const DashboardPreview = () => {
  return (
    <section id="dashboard" className="py-32 px-6 bg-black relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[180px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 text-right">
            <div className="inline-block px-4 py-1.5 glass rounded-full text-[10px] font-black tracking-widest text-primary uppercase mb-6">Student Experience</div>
            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tighter">فراتر از یک وب‌سایت؛ <br /><span className="text-primary">یک دستیار هوشمند.</span></h2>
            <p className="opacity-50 text-xl mb-12 leading-relaxed">ما تمام فرآیند پذیرش، اسکان و ویزا را در یک پنل اختصاصی متمرکز کرده‌ایم.</p>
            <div className="space-y-4">
              {["بارگذاری هوشمند مدارک", "پیگیری لحظه‌ای ویزا", "مدیریت قراردادهای اسکان"].map((t, i) => (
                <div key={i} className="flex gap-4 group cursor-default">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary mt-1 shrink-0"><Check className="w-3 h-3" /></div>
                  <h4 className="font-bold text-lg">{t}</h4>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 perspective-1000">
            <motion.div initial={{ rotateY: -20, rotateX: 10 }} whileInView={{ rotateY: 0, rotateX: 0 }} transition={{ duration: 1.2 }} className="glass rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden">
              <div className="h-[500px] flex">
                <div className="w-20 border-l border-white/5 bg-white/[0.02] flex flex-col items-center py-8 gap-8">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xs">TH</div>
                  <LayoutDashboard className="w-5 h-5 opacity-20" />
                  <FileText className="w-5 h-5 opacity-20" />
                  <Calendar className="w-5 h-5 opacity-20" />
                </div>
                <div className="flex-1 p-10 space-y-8">
                   <div className="flex justify-between items-center">
                     <div className="h-4 w-32 bg-white/5 rounded-full" />
                     <div className="w-8 h-8 rounded-full bg-white/5" />
                   </div>
                   <div className="h-32 w-full bg-white/5 rounded-3xl" />
                   <div className="grid grid-cols-2 gap-4">
                     <div className="h-24 bg-white/5 rounded-2xl" />
                     <div className="h-24 bg-primary/20 rounded-2xl border border-primary/20" />
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
