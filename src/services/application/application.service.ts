import { getSupabaseClient } from "@/lib/supabase/utils";
import { Application } from "@/types/database";

export const ApplicationService = {
  async getMyApplications(): Promise<Application[]> {
    const supabase = getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('applications')
      .select('*, university:universities(*), program:programs(*)')
      .eq('profile_id', user.id);
      
    if (error) throw new Error(error.message);
    return data as Application[];
  },

  async create(universityId: string, programId: string): Promise<void> {
    const supabase = getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from('applications')
      .insert({
        profile_id: user.id,
        university_id: universityId,
        program_id: programId,
        status: 'Draft'
      });
      
    if (error) throw new Error(error.message);
  }
};
