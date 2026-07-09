"use client";

import { useQuery } from "@tanstack/react-query";
import { UniversityService } from "@/services";
import { QUERY_KEYS } from "@/lib/react-query/queryKeys";

export default function ProgramProfilePage({ params }: { params: { slug: string; programSlug: string } }) {
  const { data: program, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.UNIVERSITIES, params.slug, "program", params.programSlug],
    queryFn: () => UniversityService.getProgramBySlug(params.slug, params.programSlug),
  });

  if (isLoading) return <main className="min-h-screen p-24">Loading program...</main>;
  if (error || !program) return <main className="min-h-screen p-24">Program not found.</main>;

  return (
    <main className="min-h-screen bg-background px-6 py-24 text-foreground">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.4em] text-primary">Program Profile</p>
          <h1 className="text-4xl font-black">{program.name}</h1>
          <p className="mt-4 text-muted">{program.degree_level} · {program.language} · {program.duration_years ?? "Duration pending"} years · {program.credits ?? "Credits pending"} credits</p>
          <p className="mt-4 text-sm text-muted">Verification: {program.verification_status ?? "unverified"} · Completeness: {program.data_completeness_score ?? 0}% · Updated {program.last_updated_at ? new Date(program.last_updated_at).toLocaleDateString() : "pending"}</p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Metric label="Annual Tuition" value={program.tuition_fee ? `${program.tuition_fee} ${program.currency}` : "Pending"} />
          <Metric label="Required GPA" value={program.required_gpa ?? "Pending"} />
          <Metric label="IELTS / TOEFL" value={`${program.required_ielts ?? "—"} / ${program.required_toefl ?? "—"}`} />
        </section>

        <section className="grid gap-8 md:grid-cols-2">
          <Panel title="Admissions"><List items={[`TÖMER: ${program.required_tomer ?? "Not specified"}`, `Portfolio: ${program.portfolio_required ? "Required" : "Not required"}`, `Interview: ${program.interview_required ? "Required" : "Not required"}`, `Scholarship: ${program.scholarship_available ? "Available" : "Not specified"}`]} /></Panel>
          <Panel title="Application Documents"><List items={program.required_documents?.map((document) => document.name || document.description)} /></Panel>
          <Panel title="Language Requirements"><List items={program.language_requirements?.map((requirement) => `${requirement.test_name}: ${requirement.minimum_score}`)} /></Panel>
          <Panel title="Career Opportunities"><List items={program.career_opportunities ?? program.career_outcomes?.map((outcome) => outcome.description ?? outcome.outcome_type)} /></Panel>
        </section>

        <Panel title="Curriculum">
          <pre className="overflow-auto rounded-3xl bg-black/30 p-4 text-sm text-muted">{JSON.stringify(program.curriculum ?? [], null, 2)}</pre>
        </Panel>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) { return <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6"><p className="text-xs font-black uppercase tracking-widest text-muted">{label}</p><p className="mt-3 text-2xl font-black">{value}</p></div>; }
function Panel({ title, children }: { title: string; children: React.ReactNode }) { return <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6"><h2 className="mb-4 text-2xl font-black">{title}</h2>{children}</section>; }
function List({ items }: { items?: (string | undefined | null)[] }) { const clean = items?.filter(Boolean) as string[] | undefined; return clean?.length ? <ul className="space-y-2 text-muted">{clean.map((item, index) => <li key={`${item}-${index}`}>• {item}</li>)}</ul> : <p className="text-muted">Data pending verification/import.</p>; }
