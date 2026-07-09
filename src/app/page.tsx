"use client";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { UniversitySearch } from "@/components/search/UniversitySearch";
import { CostCalculator } from "@/components/calculators/CostCalculator";
import { AIAdvisor } from "@/components/ai/AIAdvisor";
import { DecisionCenter } from "@/components/decision/DecisionCenter";
import { ScenarioExplorer } from "@/components/decision/ScenarioExplorer";
import { CityLifestyleMatch } from "@/components/decision/CityLifestyleMatch";
import { FutureTimeline } from "@/components/decision/FutureTimeline";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { JourneyLivingMap } from "@/components/journey/JourneyLivingMap";
import { LifeSimulator } from "@/components/simulator/LifeSimulator";
import { FuturePredictor } from "@/components/ai/FuturePredictor";
import { SmartChecklist } from "@/components/documents/SmartChecklist";
import { AIDocumentReview } from "@/components/documents/AIDocumentReview";
import { MagneticButton } from "@/components/ui/PremiumComponents";
import { motion, useScroll, useSpring } from "framer-motion";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <main className="min-h-screen selection:bg-primary/30 text-foreground bg-[#030712] relative pb-40">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-primary z-[200] origin-right" style={{ scaleX }} />
      <Navbar />
      <Hero />
      <Stats />

      {/* 1. Intelligent Journey Tracking */}
      <JourneyLivingMap />

      {/* 2. Decision Support: The Core Upgrade */}
      <DecisionCenter />

      {/* 3. Scenario Analysis */}
      <ScenarioExplorer />

      <CityLifestyleMatch />

      {/* 4. AI & Risk Prediction */}
      <FuturePredictor />
      
      <FutureTimeline />

      <section id="search" className="py-40 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-32 relative">
             <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 blur-[120px] -z-10" />
             <span className="text-primary font-black tracking-[0.4em] uppercase text-[10px] mb-6 block">Expert Guidance</span>
             <h2 className="text-6xl md:text-9xl font-black mb-8 tracking-tighter leading-none text-right md:text-center">پیدا کردن <br /> <span className="text-primary underline decoration-primary/10 underline-offset-[20px]">دانشگاه ایده‌آل.</span></h2>
          </div>
          <ErrorBoundary>
            <UniversitySearch />
          </ErrorBoundary>
        </div>
      </section>

      <section className="py-40 px-6 bg-white/[0.01] border-y border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center mb-24">
          <h2 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-tight text-right md:text-center">پاسخ‌های دقیق، <br /><span className="text-primary">همین حالا و اینجا.</span></h2>
        </div>
        <ErrorBoundary>
          <AIAdvisor />
        </ErrorBoundary>
      </section>

      <ErrorBoundary>
        <LifeSimulator />
      </ErrorBoundary>
      
      <div className="bg-white/[0.01] py-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <ErrorBoundary>
            <SmartChecklist />
          </ErrorBoundary>
          <div className="text-right">
             <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tighter">مدیریت هوشمند <br />بر اساس شخصیت شما.</h2>
          </div>
        </div>
      </div>

      <ErrorBoundary>
        <AIDocumentReview />
      </ErrorBoundary>
      
      <ErrorBoundary>
        <CostCalculator />
      </ErrorBoundary>

      <section className="py-60 px-6 relative text-center">
          <h2 className="text-7xl md:text-[10rem] font-black mb-20 leading-none tracking-tighter">
            زمان شما <br /><span className="text-primary">اکنون است.</span>
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-10">
            <MagneticButton className="bg-primary text-white px-20 py-10 rounded-[2.5rem] font-black text-4xl shadow-2xl">شروع اپلای</MagneticButton>
          </div>
      </section>
    </main>
  );
}
