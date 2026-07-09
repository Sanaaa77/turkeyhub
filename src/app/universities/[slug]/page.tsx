"use client";

import { useUniversityProfile } from "@/hooks/useUniversityKnowledge";
import { MapPin, Globe, GraduationCap, Building2 } from "lucide-react";

export default function UniversityProfilePage({ params }: { params: { slug: string } }) {
  const { data: university, isLoading, error } = useUniversityProfile(params.slug);

  if (isLoading) return <main className="min-h-screen p-24">Loading university profile...</main>;
  if (error || !university) return <main className="min-h-screen p-24">University not found.</main>;

  const gallery = university.university_media?.filter((item) => ["gallery_image", "campus_image"].includes(item.media_type)) ?? [];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative min-h-[32rem] overflow-hidden px-6 py-28">
        <img src={university.hero_image_url || "/placeholder-campus.jpg"} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-6 inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-primary">
            {university.verification_status} · {university.data_completeness_score}% complete · Updated {new Date(university.last_updated_at).toLocaleDateString()}
          </div>
          <h1 className="max-w-4xl text-5xl font-black tracking-tight">{university.name}</h1>
          <p className="mt-5 max-w-3xl text-lg text-muted">{university.overview || university.description}</p>
          <div className="mt-8 flex flex-wrap gap-4 text-sm font-bold">
            <Badge icon={<MapPin />} text={university.city?.name ?? "Turkey"} />
            <Badge icon={<Building2 />} text={university.type} />
            <Badge icon={<GraduationCap />} text={`${university.programs?.length ?? 0} programs`} />
            {university.website_url && <Badge icon={<Globe />} text="Official website" />}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          <Panel title="Overview & History"><p>{university.history || university.overview || "Verified overview will appear after import."}</p></Panel>
          <Panel title="Programs"><div className="grid gap-3 md:grid-cols-2">{university.programs?.map((program) => <Card key={program.id} title={program.name} body={`${program.degree_level ?? "Degree"} · ${program.language ?? "Language"} · ${program.duration_years ?? "?"} years · ${program.tuition_fee ? `${program.tuition_fee} ${program.currency}` : "Tuition pending"}`} />)}</div></Panel>
          <Panel title="Admission Requirements"><List items={university.admission_requirements?.map((item) => `${item.requirement_type}: ${item.description}`)} /></Panel>
          <Panel title="Required Documents"><List items={university.required_documents?.map((item) => item.name || item.description)} /></Panel>
          <Panel title="Deadlines & Intakes"><List items={university.application_deadlines?.map((item) => `${item.deadline_type}: ${new Date(item.deadline_at).toLocaleDateString()} (${item.status})`)} /></Panel>
          <Panel title="Tuition, Scholarships & Living Costs"><List items={[...(university.scholarships?.map((item) => `Scholarship: ${item.name}`) ?? []), ...(university.living_costs?.map((item) => `${item.category}: ${item.amount_min ?? "?"}-${item.amount_max ?? "?"} ${item.currency}`) ?? [])]} /></Panel>
          <Panel title="Gallery">{gallery.length ? <div className="grid gap-4 md:grid-cols-3">{gallery.map((item) => <img key={item.id} src={item.url} alt={item.alt_text ?? item.title ?? university.name} className="h-44 rounded-3xl object-cover" />)}</div> : <p>No gallery assets imported yet.</p>}</Panel>
          <Panel title="FAQs"><div className="space-y-4">{university.university_faqs?.map((faq) => <Card key={faq.id} title={faq.question} body={faq.answer} />)}</div></Panel>
        </div>
        <aside className="space-y-6">
          <Panel title="Rankings"><List items={university.rankings?.map((ranking) => `${ranking.ranking_body} ${ranking.year}: ${ranking.rank_value ?? ranking.rank_band}`)} /></Panel>
          <Panel title="Campuses"><List items={university.campuses?.map((campus) => `${campus.name}${campus.address ? ` — ${campus.address}` : ""}`)} /></Panel>
          <Panel title="International Office"><List items={university.international_offices?.map((office) => `${office.name}: ${office.email ?? office.phone ?? office.website_url ?? "Contact pending"}`)} /></Panel>
          <Panel title="Exchange & Careers"><List items={[...(university.exchange_programs?.map((item) => item.name) ?? []), ...(university.career_outcomes?.map((item) => `${item.outcome_type}: ${item.description ?? "Outcome imported"}`) ?? [])]} /></Panel>
          <Panel title="Student Life"><List items={[...(university.student_clubs?.map((item) => `Club: ${item.name}`) ?? []), ...(university.research_centers?.map((item) => `Research: ${item.name}`) ?? [])]} /></Panel>
        </aside>
      </div>
    </main>
  );
}

function Badge({ icon, text }: { icon: React.ReactNode; text: string }) { return <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">{icon}{text}</span>; }
function Panel({ title, children }: { title: string; children: React.ReactNode }) { return <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6"><h2 className="mb-4 text-2xl font-black">{title}</h2><div className="text-muted leading-7">{children}</div></section>; }
function Card({ title, body }: { title: string; body: string }) { return <div className="rounded-3xl border border-white/10 bg-black/20 p-4"><h3 className="font-black text-foreground">{title}</h3><p className="mt-2 text-sm">{body}</p></div>; }
function List({ items }: { items?: string[] }) { return items?.length ? <ul className="space-y-2">{items.map((item, index) => <li key={`${item}-${index}`}>• {item}</li>)}</ul> : <p>Data pending verification/import.</p>; }
