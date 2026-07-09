"use client";

import { useMemo, useState } from "react";
import { UploadCloud, History, Database, CheckCircle2 } from "lucide-react";
import { useImportHistory, useUniversityImport, useUniversities } from "@/hooks/useUniversityKnowledge";
import { ImportPayload } from "@/services";

const emptyPayload: ImportPayload = {
  format: "json",
  sourceName: "Admin upload",
  conflictStrategy: "prefer_verified",
  universities: [],
};

export default function KnowledgeManagementPage() {
  const [rawJson, setRawJson] = useState(JSON.stringify(emptyPayload, null, 2));
  const importMutation = useUniversityImport();
  const { data: universities = [] } = useUniversities();
  const { data: importHistory = [] } = useImportHistory();

  const publishedCount = useMemo(
    () => universities.filter((university) => university.publication_status === "published").length,
    [universities],
  );

  const handleImport = async () => {
    const payload = JSON.parse(rawJson) as ImportPayload;
    await importMutation.mutateAsync(payload);
  };

  return (
    <main className="min-h-screen bg-background px-6 py-24 text-foreground">
      <div className="mx-auto max-w-7xl space-y-10">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 shadow-2xl">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.4em] text-primary">Admin Knowledge Management</p>
          <h1 className="text-4xl font-black tracking-tight">University Knowledge Platform</h1>
          <p className="mt-4 max-w-3xl text-muted">
            Import, validate, synchronize, publish and audit university data without changing application code. The import engine supports official APIs, JSON, CSV, Excel metadata and admin uploads through the same normalized pipeline.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric icon={<Database />} label="Universities" value={universities.length} />
          <Metric icon={<CheckCircle2 />} label="Published" value={publishedCount} />
          <Metric icon={<UploadCloud />} label="Imports" value={importHistory.length} />
          <Metric icon={<History />} label="Latest Status" value={importHistory[0]?.status ?? "None"} />
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
            <h2 className="mb-4 text-2xl font-black">Import data</h2>
            <p className="mb-4 text-sm text-muted">
              Paste a validated import payload from an official API, structured JSON conversion, CSV/Excel parser, or admin upload. Matching is performed by slug and university name to prevent duplicate records.
            </p>
            <textarea
              value={rawJson}
              onChange={(event) => setRawJson(event.target.value)}
              className="h-[32rem] w-full rounded-3xl border border-white/10 bg-black/30 p-5 font-mono text-sm outline-none focus:border-primary"
            />
            <button
              onClick={handleImport}
              disabled={importMutation.isPending}
              className="mt-4 rounded-full bg-primary px-8 py-4 font-black text-white disabled:opacity-50"
            >
              {importMutation.isPending ? "Importing..." : "Validate & Import"}
            </button>
            {importMutation.data && <p className="mt-4 text-sm text-primary">Batch {importMutation.data.batchId} completed with {importMutation.data.inserted} inserts and {importMutation.data.updated} updates.</p>}
            {importMutation.error && <p className="mt-4 text-sm text-red-400">{importMutation.error.message}</p>}
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
            <h2 className="mb-4 text-2xl font-black">Import history</h2>
            <div className="space-y-3">
              {importHistory.map((batch: any) => (
                <div key={batch.id} className="rounded-3xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-black">{batch.import_type}</span>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{batch.status}</span>
                  </div>
                  <p className="mt-2 text-xs text-muted">{batch.started_at}</p>
                  <p className="mt-2 text-sm text-muted">Inserted {batch.inserted_records}, updated {batch.updated_records}, duplicates {batch.duplicate_records}, errors {batch.error_records}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-4 text-primary">{icon}</div>
      <p className="text-sm font-bold uppercase tracking-widest text-muted">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}
