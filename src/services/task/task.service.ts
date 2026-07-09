import { getSupabaseClient } from "@/lib/supabase/utils";
import { Task } from "@/types/database";

export const TaskService = {
  async getMyTasks(): Promise<Task[]> {
    const supabase = getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('profile_id', user.id)
      .order('created_at', { ascending: true });
      
    if (error) throw new Error(error.message);
    return data as Task[];
  },

  async complete(taskId: string): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('tasks')
      .update({ status: 'completed' })
      .eq('id', taskId);
      
    if (error) throw new Error(error.message);
  }
};
