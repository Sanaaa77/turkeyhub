import { getSupabaseClient } from "@/lib/supabase/utils";

export type ImportFormat = "official_api" | "csv" | "json" | "excel" | "admin_upload";
export type ConflictStrategy = "prefer_verified" | "prefer_newer" | "manual_review" | "overwrite";
export type VerificationStatus = "unverified" | "pending" | "verified" | "rejected" | "stale";

export interface UniversityImportRecord {
  external_id?: string;
  name: string;
  legal_name?: string | null;
  slug?: string | null;
  city?: string | null;
  type?: "Public" | "Private" | null;
  overview?: string | null;
  history?: string | null;
  website_url?: string | null;
  logo_url?: string | null;
  hero_image_url?: string | null;
  verification_status?: VerificationStatus;
  source_url?: string | null;
  programs?: ProgramImportRecord[];
}

export interface ProgramImportRecord {
  external_id?: string;
  name: string;
  slug?: string | null;
  faculty?: string | null;
  degree_level?: string | null;
  language?: "Turkish" | "English" | "Mixed" | null;
  duration_years?: number | null;
  credits?: number | null;
  tuition_fee?: number | null;
  currency?: string | null;
  required_gpa?: number | null;
  required_ielts?: number | null;
  required_toefl?: number | null;
  required_tomer?: string | null;
  portfolio_required?: boolean;
  interview_required?: boolean;
  scholarship_available?: boolean;
  career_opportunities?: string[];
}

export interface ImportPayload {
  format: ImportFormat;
  sourceName: string;
  sourceUrl?: string;
  fileUrl?: string;
  checksum?: string;
  conflictStrategy?: ConflictStrategy;
  universities: UniversityImportRecord[];
}

export interface ImportResult {
  batchId: string;
  status: "completed" | "completed_with_warnings" | "failed";
  inserted: number;
  updated: number;
  skipped: number;
  duplicates: number;
  errors: string[];
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const completeness = (record: Record<string, unknown>, fields: string[]) => {
  const present = fields.filter((field) => {
    const value = record[field];
    return value !== undefined && value !== null && value !== "";
  }).length;

  return Math.round((present / fields.length) * 10000) / 100;
};

export const UniversityImportEngine = {
  slugify,

  validateUniversity(record: UniversityImportRecord): string[] {
    const errors: string[] = [];
    if (!record.name?.trim()) errors.push("University name is required.");
    if (record.type && !["Public", "Private"].includes(record.type)) errors.push("University type must be Public or Private.");
    if (record.programs) {
      record.programs.forEach((program, index) => {
        if (!program.name?.trim()) errors.push(`Program #${index + 1} name is required.`);
        if (program.language && !["Turkish", "English", "Mixed"].includes(program.language)) {
          errors.push(`Program #${index + 1} language is invalid.`);
        }
      });
    }
    return errors;
  },

  async importUniversities(payload: ImportPayload): Promise<ImportResult> {
    const supabase = getSupabaseClient();
    const conflictStrategy = payload.conflictStrategy ?? "prefer_verified";
    const errors: string[] = [];
    let inserted = 0;
    let updated = 0;
    let skipped = 0;
    let duplicates = 0;

    const { data: source, error: sourceError } = await supabase
      .from("source_metadata")
      .insert({
        source_type: payload.format,
        name: payload.sourceName,
        url: payload.sourceUrl,
        file_url: payload.fileUrl,
        checksum: payload.checksum,
      })
      .select("id")
      .single();

    if (sourceError) throw new Error(sourceError.message);

    const { data: batch, error: batchError } = await supabase
      .from("import_batches")
      .insert({
        source_id: source.id,
        import_type: payload.format,
        status: "importing",
        conflict_strategy: conflictStrategy,
        total_records: payload.universities.length,
      })
      .select("id")
      .single();

    if (batchError) throw new Error(batchError.message);

    for (const record of payload.universities) {
      const validationErrors = this.validateUniversity(record);
      const slug = record.slug ? slugify(record.slug) : slugify(record.name);

      if (validationErrors.length > 0) {
        skipped += 1;
        errors.push(...validationErrors.map((message) => `${record.name || "Unknown"}: ${message}`));
        await supabase.from("import_logs").insert({
          batch_id: batch.id,
          entity_type: "university",
          action: "error",
          severity: "error",
          external_id: record.external_id,
          slug,
          message: validationErrors.join(" "),
          raw_record: record,
        });
        continue;
      }

      const { data: existing } = await supabase
        .from("universities")
        .select("id, name, slug, verification_status, updated_at")
        .or(`slug.eq.${slug},name.ilike.${record.name}`)
        .maybeSingle();

      const universityPayload = {
        name: record.name.trim(),
        legal_name: record.legal_name,
        slug,
        type: record.type,
        overview: record.overview,
        history: record.history,
        description: record.overview,
        website_url: record.website_url,
        logo_url: record.logo_url,
        hero_image_url: record.hero_image_url,
        verification_status: record.verification_status ?? "pending",
        data_completeness_score: completeness(record as unknown as Record<string, unknown>, [
          "name",
          "type",
          "overview",
          "history",
          "website_url",
          "logo_url",
          "hero_image_url",
        ]),
        source_id: source.id,
        last_updated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      let universityId = existing?.id as string | undefined;

      if (existing) {
        duplicates += 1;
        if (conflictStrategy === "manual_review") {
          skipped += 1;
          await supabase.from("import_logs").insert({
            batch_id: batch.id,
            entity_type: "university",
            entity_id: universityId,
            action: "duplicate",
            severity: "warning",
            external_id: record.external_id,
            slug,
            message: "Potential duplicate sent to manual review.",
            raw_record: record,
          });
          continue;
        }

        const { error } = await supabase.from("universities").update(universityPayload).eq("id", universityId);
        if (error) {
          errors.push(error.message);
          continue;
        }
        updated += 1;
        await supabase.from("import_logs").insert({ batch_id: batch.id, entity_type: "university", entity_id: universityId, action: "update", slug, raw_record: record });
      } else {
        const { data: insertedUniversity, error } = await supabase
          .from("universities")
          .insert(universityPayload)
          .select("id")
          .single();
        if (error) {
          errors.push(error.message);
          continue;
        }
        universityId = insertedUniversity.id;
        inserted += 1;
        await supabase.from("import_logs").insert({ batch_id: batch.id, entity_type: "university", entity_id: universityId, action: "insert", slug, raw_record: record });
      }

      for (const program of record.programs ?? []) {
        await this.upsertProgram(universityId!, program, source.id, batch.id);
      }
    }

    const status = errors.length > 0 ? "completed_with_warnings" : "completed";
    await supabase
      .from("import_batches")
      .update({
        status,
        inserted_records: inserted,
        updated_records: updated,
        skipped_records: skipped,
        duplicate_records: duplicates,
        error_records: errors.length,
        completed_at: new Date().toISOString(),
        summary: { errors },
      })
      .eq("id", batch.id);

    return { batchId: batch.id, status, inserted, updated, skipped, duplicates, errors };
  },

  async upsertProgram(universityId: string, program: ProgramImportRecord, sourceId: string, batchId: string) {
    const supabase = getSupabaseClient();
    const slug = program.slug ? slugify(program.slug) : slugify(program.name);
    const payload = {
      university_id: universityId,
      name: program.name,
      slug,
      faculty: program.faculty,
      degree_level: program.degree_level,
      language: program.language,
      duration_years: program.duration_years,
      credits: program.credits,
      tuition_fee: program.tuition_fee,
      currency: program.currency ?? "USD",
      required_gpa: program.required_gpa,
      required_ielts: program.required_ielts,
      required_toefl: program.required_toefl,
      required_tomer: program.required_tomer,
      portfolio_required: program.portfolio_required ?? false,
      interview_required: program.interview_required ?? false,
      scholarship_available: program.scholarship_available ?? false,
      career_opportunities: program.career_opportunities,
      data_completeness_score: completeness(program as unknown as Record<string, unknown>, ["name", "degree_level", "language", "duration_years", "tuition_fee", "required_gpa", "required_ielts"]),
      verification_status: "pending" as VerificationStatus,
      source_id: sourceId,
      last_updated_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: existing } = await supabase
      .from("programs")
      .select("id")
      .eq("university_id", universityId)
      .eq("slug", slug)
      .maybeSingle();

    if (existing) {
      await supabase.from("programs").update(payload).eq("id", existing.id);
      await supabase.from("import_logs").insert({ batch_id: batchId, entity_type: "program", entity_id: existing.id, action: "update", slug, raw_record: program });
      return existing.id as string;
    }

    const { data } = await supabase.from("programs").insert(payload).select("id").single();
    await supabase.from("import_logs").insert({ batch_id: batchId, entity_type: "program", entity_id: data?.id, action: "insert", slug, raw_record: program });
    return data?.id as string | undefined;
  },

  async rollback(batchId: string) {
    const supabase = getSupabaseClient();
    const { data: logs, error } = await supabase
      .from("import_logs")
      .select("entity_type, entity_id, action")
      .eq("batch_id", batchId)
      .in("action", ["insert"]);

    if (error) throw new Error(error.message);

    for (const log of logs ?? []) {
      if (log.entity_type === "program" && log.entity_id) await supabase.from("programs").delete().eq("id", log.entity_id);
      if (log.entity_type === "university" && log.entity_id) await supabase.from("universities").delete().eq("id", log.entity_id);
    }

    await supabase.from("import_batches").update({ status: "rolled_back", completed_at: new Date().toISOString() }).eq("id", batchId);
  },
};
