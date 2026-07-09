import { getSupabaseClient } from "@/lib/supabase/utils";
import { Profile } from "@/types/database";

export const ProfileService = {
  async getOwnProfile(): Promise<Profile | null> {
    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) throw new Error(authError.message);
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') return null; // NotFound
      throw new Error(error.message);
    }
    return data as Profile;
  },

  async updateProfile(updates: Partial<Profile>): Promise<void> {
    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) throw new Error(authError.message);
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);
      
    if (error) throw new Error(error.message);
  }
};
