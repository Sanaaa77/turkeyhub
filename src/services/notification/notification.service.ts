import { getSupabaseClient } from "@/lib/supabase/utils";
import { Notification } from "@/types/database";

export const NotificationService = {
  async getMyNotifications(): Promise<Notification[]> {
    const supabase = getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('profile_id', user.id)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data as Notification[];
  },
  async markAsRead(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);
    if (error) throw new Error(error.message);
  }
};
