"use client";
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ScholarshipService } from "@/services";
import { Scholarship } from "@/types/database";
import { PremiumCard } from "@/components/ui/PremiumComponents";
import { Award, Calendar, ArrowLeft, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export const ScholarshipSearch = () => {
  const [query, setQuery] = useState("");
  
  const { data: scholarships = [], isLoading } = useQuery({
    queryKey: ['scholarships'],
    queryFn: () => ScholarshipService.getAll(),
  });

  const filtered = useMemo(() => {
    return scholarships.filter(s => 
      s.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [scholarships, query]);

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 text-right">
          <div>
            <span className="text-primary font-black uppercase text-[10px] tracking-widest mb-2 block">Scholarship Intelligence</span>
            <h2 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter">فرصت‌های طلایی.</h2>
          </div>
          <div className="flex bg-white/5 p-2 rounded-2xl border border-white/5 w-full md:w-auto">
             <Search className="w-5 h-5 opacity-40 mx-4 self-center" />
             <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="جستجو..." className="bg-transparent p-4 outline-none font-bold" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filtered.map((s, i) => (
            <PremiumCard key={i} className="flex flex-col h-full border-white/5 group">
              <div className="flex justify-between items-start mb-8 text-right">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Award /></div>
                <div className="text-3xl font-black text-primary">{s.coverage_percentage}%</div>
              </div>
              <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors text-right">{s.name}</h3>
              <p className="opacity-40 text-sm mb-10 leading-relaxed flex-1 text-right">{s.description}</p>
              <div className="pt-8 border-t border-white/5 flex justify-between items-center text-[10px] font-bold opacity-30">
                <span>DEADLINE: {s.deadline}</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </div>
            </PremiumCard>
          ))}
        </div>
      </div>
    </section>
  );
};
