import { getSupabaseClient } from "@/lib/supabase/utils";
import { University } from "@/types/database";

export const UniversityService = {
  async getAll(): Promise<University[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('universities')
      .select('*, city:cities(*)');
      
    if (error) throw new Error(error.message);
    return (data || []) as University[];
  },

  async getBySlug(slug: string): Promise<University> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('universities')
      .select('*, city:cities(*), programs(*), scholarships(*)')
      .eq('slug', slug)
      .single();
      
    if (error) throw new Error(error.message);
    if (!data) throw new Error("University not found");
    return data;
  }
};
