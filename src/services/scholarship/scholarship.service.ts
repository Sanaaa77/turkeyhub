import { getSupabaseClient } from "@/lib/supabase/utils";
import { Scholarship } from "@/types/database";

export const ScholarshipService = {
  async getAll(): Promise<Scholarship[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('scholarships')
      .select('*, university:universities(*)');
    if (error) throw new Error(error.message);
    return (data || []) as Scholarship[];
  },
  async getByUniversity(universityId: string): Promise<Scholarship[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('scholarships')
      .select('*')
      .eq('university_id', universityId);
    if (error) throw new Error(error.message);
    return (data || []) as Scholarship[];
  }
};
