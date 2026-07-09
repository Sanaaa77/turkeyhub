import { getSupabaseClient } from "@/lib/supabase/utils";
import { Program, University, UniversityProfile } from "@/types/database";

export interface UniversitySearchFilters {
  query?: string;
  cityId?: string;
  universityId?: string;
  degree?: string;
  language?: "Turkish" | "English" | "Mixed";
  maxTuition?: number;
  scholarshipAvailable?: boolean;
  maxRanking?: number;
  maxIelts?: number;
  minGpa?: number;
  applicationStatus?: "open" | "closed" | "opening_soon" | "rolling" | "unknown";
}

const UNIVERSITY_PROFILE_SELECT = `
  *,
  city:cities(*),
  campuses(*),
  faculties(*),
  programs(*, degree:degrees(*), tuition_fees(*), language_requirements(*), required_documents(*), career_outcomes(*)),
  scholarships(*),
  rankings(*),
  admission_requirements(*),
  required_documents(*),
  language_requirements(*),
  application_deadlines(*),
  intakes(*),
  dormitories(*),
  living_costs(*),
  exchange_programs(*),
  career_outcomes(*),
  international_offices(*),
  contact_information(*),
  university_faqs(*),
  university_media(*),
  student_clubs(*),
  research_centers(*)
`;

export const UniversityService = {
  async getAll(filters: UniversitySearchFilters = {}): Promise<University[]> {
    const supabase = getSupabaseClient();
    let query = supabase
      .from("universities")
      .select("*, city:cities(*), programs(*), scholarships(*), rankings(*)");

    if (filters.universityId) query = query.eq("id", filters.universityId);
    if (filters.cityId) query = query.eq("city_id", filters.cityId);
    if (filters.maxRanking) query = query.or(`ranking_global.lte.${filters.maxRanking},ranking_local.lte.${filters.maxRanking}`);
    if (filters.query) query = query.or(`name.ilike.%${filters.query}%,slug.ilike.%${filters.query}%,legal_name.ilike.%${filters.query}%`);

    const { data, error } = await query.order("data_completeness_score", { ascending: false });

    if (error) throw new Error(error.message);

    return ((data || []) as University[]).filter((university) => {
      const programs = university.programs ?? [];
      const hasProgramFilters = Boolean(
        filters.degree ||
          filters.language ||
          filters.maxTuition !== undefined ||
          filters.scholarshipAvailable !== undefined ||
          filters.maxIelts !== undefined ||
          filters.minGpa !== undefined ||
          filters.applicationStatus,
      );

      if (!hasProgramFilters) return true;

      return programs.some((program: Program) => {
        if (filters.degree && program.degree_level !== filters.degree) return false;
        if (filters.language && program.language !== filters.language) return false;
        if (filters.maxTuition !== undefined && (program.tuition_fee ?? Number.POSITIVE_INFINITY) > filters.maxTuition) return false;
        if (filters.scholarshipAvailable !== undefined && program.scholarship_available !== filters.scholarshipAvailable) return false;
        if (filters.maxIelts !== undefined && (program.required_ielts ?? 0) > filters.maxIelts) return false;
        if (filters.minGpa !== undefined && (program.required_gpa ?? 0) > filters.minGpa) return false;
        if (filters.applicationStatus && program.application_status !== filters.applicationStatus) return false;
        return true;
      });
    });
  },

  async getBySlug(slug: string): Promise<UniversityProfile> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("universities")
      .select(UNIVERSITY_PROFILE_SELECT)
      .eq("slug", slug)
      .single();

    if (error) throw new Error(error.message);
    if (!data) throw new Error("University not found");
    return data as UniversityProfile;
  },

  async getProgramBySlug(universitySlug: string, programSlug: string): Promise<Program> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("programs")
      .select("*, university:universities!inner(slug, name), degree:degrees(*), tuition_fees(*), language_requirements(*), required_documents(*), career_outcomes(*)")
      .eq("universities.slug", universitySlug)
      .eq("slug", programSlug)
      .single();

    if (error) throw new Error(error.message);
    if (!data) throw new Error("Program not found");
    return data as Program;
  },

  async getImportHistory() {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("import_batches")
      .select("*, source:source_metadata(*)")
      .order("started_at", { ascending: false })
      .limit(50);

    if (error) throw new Error(error.message);
    return data || [];
  },
};
