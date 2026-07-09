import { getSupabaseClient } from "@/lib/supabase/utils";
import { City } from "@/types/database";

export const CityService = {
  async getAll(): Promise<City[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from('cities').select('*');
    if (error) throw new Error(error.message);
    return data as City[];
  }
};
