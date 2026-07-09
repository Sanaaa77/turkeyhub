"use client";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UniversityService, UniversitySearchFilters } from "@/services";
import { University } from "@/types/database";
import { Search, MapPin, Star, ArrowRight, Bookmark, Sparkles } from "lucide-react";
import { PremiumCard, MagneticButton } from "@/components/ui/PremiumComponents";
import { transitionMd } from "@/lib/utils";
import { useJourney } from "@/hooks/useJourney";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/react-query/queryKeys";

export const UniversitySearch = () => {
  const { user, bookmarks, toggleBookmark } = useJourney();
  const [query, setQuery] = useState("");
  const budgetValue = ('budget' in user ? user.budget : 0) || 30000;
  const [priceRange, setPriceRange] = useState(budgetValue);
  const [degree, setDegree] = useState("");
  const [language, setLanguage] = useState("");
  const [applicationStatus, setApplicationStatus] = useState("");
  const [scholarshipOnly, setScholarshipOnly] = useState(false);

  const filters = useMemo<UniversitySearchFilters>(() => ({
    query,
    degree: degree || undefined,
    language: (language || undefined) as UniversitySearchFilters["language"],
    maxTuition: priceRange,
    scholarshipAvailable: scholarshipOnly || undefined,
    applicationStatus: (applicationStatus || undefined) as UniversitySearchFilters["applicationStatus"],
    maxRanking: 2000,
  }), [applicationStatus, degree, language, priceRange, query, scholarshipOnly]);

  const { data: universities = [] } = useQuery({
    queryKey: [QUERY_KEYS.UNIVERSITIES, filters],
    queryFn: () => UniversityService.getAll(filters),
  });

  const filteredUnis = universities;

  return (
    <div id="universities" className="w-full space-y-16">
      <div className="text-center space-y-4 max-w-2xl mx-auto mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-[10px] font-black tracking-widest uppercase border border-primary/20"
        >
          <Sparkles className="w-3 h-3 fill-current" />
          پیشنهاد شده برای بودجه ${budgetValue.toLocaleString()} شما
        </motion.div>
        <p className="text-muted text-sm font-medium leading-relaxed">
          ما نتایج را بر اساس پتانسیل واقعی پذیرش و سوابق تحصیلی شما اولویت‌بندی کرده‌ایم.
        </p>
      </div>

      <div className="relative max-w-5xl mx-auto">
        <div className="absolute -inset-1 bg-primary/20 blur-2xl rounded-full opacity-0 hover:opacity-100 transition-opacity duration-700" />
        <div className="relative glass p-2 rounded-full border-white/10 shadow-2xl flex items-center gap-4">
          <div className="flex-1 flex items-center px-8">
            <Search className="w-6 h-6 text-primary ml-4" />
            <input 
              type="text" 
              placeholder="جستجوی هوشمند رشته، شهر یا دانشگاه..." 
              className="bg-transparent border-none outline-none w-full font-bold text-lg placeholder:text-muted/20"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="hidden md:flex items-center gap-4 px-8 border-r border-white/10">
            <span className="text-xs font-black text-muted uppercase tracking-widest">Max Tuition</span>
            <input 
              type="range" min="0" max="30000" step="1000" 
              value={priceRange} 
              onChange={(e) => setPriceRange(parseInt(e.target.value))} 
              className="w-32 accent-primary cursor-pointer" 
            />
          </div>
          <MagneticButton className="px-10 py-5 rounded-full bg-primary text-white font-black text-xl shadow-xl shadow-primary/20">
            بگرد
          </MagneticButton>
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl gap-3 md:grid-cols-5">
        <select value={degree} onChange={(e) => setDegree(e.target.value)} className="rounded-2xl border border-white/10 bg-background/80 p-3 text-sm font-bold outline-none">
          <option value="">All degrees</option>
          <option value="Associate">Associate</option>
          <option value="Bachelor">Bachelor</option>
          <option value="Master">Master</option>
          <option value="PhD">PhD</option>
          <option value="Medicine">Medicine</option>
        </select>
        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="rounded-2xl border border-white/10 bg-background/80 p-3 text-sm font-bold outline-none">
          <option value="">All languages</option>
          <option value="English">English</option>
          <option value="Turkish">Turkish</option>
          <option value="Mixed">Mixed</option>
        </select>
        <select value={applicationStatus} onChange={(e) => setApplicationStatus(e.target.value)} className="rounded-2xl border border-white/10 bg-background/80 p-3 text-sm font-bold outline-none">
          <option value="">Any status</option>
          <option value="open">Open</option>
          <option value="opening_soon">Opening soon</option>
          <option value="rolling">Rolling</option>
          <option value="closed">Closed</option>
        </select>
        <label className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-background/80 p-3 text-sm font-bold">
          <input type="checkbox" checked={scholarshipOnly} onChange={(e) => setScholarshipOnly(e.target.checked)} /> Scholarship
        </label>
        <button onClick={() => { setDegree(""); setLanguage(""); setApplicationStatus(""); setScholarshipOnly(false); setQuery(""); }} className="rounded-2xl border border-white/10 p-3 text-sm font-black">Reset filters</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <AnimatePresence mode="popLayout">
          {filteredUnis.map((uni, i) => (
            <UniversityCard 
              key={uni.id} 
              university={uni} 
              isBookmarked={bookmarks.includes(uni.id)}
              onBookmark={() => toggleBookmark(uni.id)}
              index={i}
            />
          ))}
        </AnimatePresence>
      </div>
      
      {filteredUnis.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-40 glass rounded-card border border-dashed border-white/10"
        >
          <div className="text-6xl mb-8">✨</div>
          <h3 className="text-2xl font-black mb-4 text-foreground">هنوز مچ (Match) صددرصدی پیدا نشد.</h3>
          <p className="text-muted max-w-sm mx-auto leading-relaxed">
            نگران نباش، گاهی اوقات تغییر کوچیک در بودجه یا انتخاب شهر، درهای جدیدی رو باز می‌کنه.
          </p>
          <button onClick={() => { setQuery(""); setPriceRange(30000); setDegree(""); setLanguage(""); setApplicationStatus(""); setScholarshipOnly(false); }} className="mt-8 text-primary font-bold underline">نمایش مجدد همه گزینه‌ها</button>
        </motion.div>
      )}
    </div>
  );
};

interface UniversityCardProps {
  university: University;
  isBookmarked: boolean;
  onBookmark: () => void;
  index: number;
}

const UniversityCard = ({ university, isBookmarked, onBookmark, index }: UniversityCardProps) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
    transition={{ ...transitionMd, delay: index * 0.05 }}
  >
    <PremiumCard className="p-0 overflow-hidden group flex flex-col h-full bg-surface-glass">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={university.hero_image_url || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800'} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
          alt={university.name} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute top-6 right-6 flex gap-2">
          <div className="glass px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase backdrop-blur-md">
            #{university.ranking_global} Global
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onBookmark(); }}
            className={`p-3 rounded-full backdrop-blur-md border border-white/10 transition-all ${isBookmarked ? 'bg-primary border-primary text-white' : 'glass hover:bg-white/10'}`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="absolute bottom-6 right-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 flex items-center justify-center p-2 text-[8px] font-bold">
               {university.logo_url ? <img src={university.logo_url} alt="" className="w-full h-full object-contain brightness-0 invert" /> : "LOGO"}
            </div>
            {university.verified && (
              <div className="bg-primary p-2 rounded-full text-white shadow-xl shadow-primary/40">
                <Star className={`w-3 h-3 fill-current`} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-10 flex-1 flex flex-col text-right">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-black mb-2 tracking-tight group-hover:text-primary transition-colors text-foreground">{university.name}</h3>
            <div className="flex items-center gap-2 text-muted text-sm font-bold tracking-tight">
              <MapPin className="w-4 h-4" /> {university.city?.name}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5 flex flex-col items-center gap-2">
            <span className="text-[10px] font-black text-muted uppercase tracking-widest">Degree</span>
            <span className="font-bold text-sm text-foreground">Bachelor</span>
          </div>
          <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5 flex flex-col items-center gap-2">
            <span className="text-[10px] font-black text-muted uppercase tracking-widest">Type</span>
            <span className="font-bold text-sm text-foreground">{university.type}</span>
          </div>
        </div>

        <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
          <div className="flex -space-x-3 rtl:space-x-reverse">
            {[1,2,3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-background overflow-hidden bg-white/10">
                <img src={`https://i.pravatar.cc/100?u=${i+index}`} alt="" />
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-background bg-primary flex items-center justify-center text-[10px] font-bold text-white">+12</div>
          </div>
          <button className="flex items-center gap-3 text-sm font-black group/btn text-foreground">
            <span>مشاهده جزئیات</span>
            <div className="w-8 h-8 rounded-full glass border border-white/10 flex items-center justify-center group-hover/btn:bg-primary group-hover/btn:text-white transition-all">
              <ArrowRight className="w-4 h-4 rotate-180" />
            </div>
          </button>
        </div>
      </div>
    </PremiumCard>
  </motion.div>
);
