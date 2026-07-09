"use client";
import React, { createContext, useContext, useMemo } from "react";
import { INITIAL_USER } from "@/data/userJourney";
import { SmartRecommendation } from "@/types/decision";
import { MOCK_RECOMMENDATIONS } from "@/data/decisionData";
import { useAuth } from "@/hooks/useAuth";
import { ProfileService, TaskService } from "@/services";
import { Profile, Task } from "@/types/database";
import { useQuery, useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/react-query/queryKeys";

interface JourneyContextValue {
  user: Profile | typeof INITIAL_USER;
  updateUser: (updates: Partial<Profile>) => Promise<void>;
  currentStep: number;
  progress: number;
  recommendations: SmartRecommendation[];
  bookmarks: string[];
  toggleBookmark: (id: string) => void;
  completeTask: (taskId: string) => Promise<void>;
  isLoading: boolean;
  tasks: Task[];
  updateProfileMutation: UseMutationResult<void, Error, Partial<Profile>>;
}

const JourneyContext = createContext<JourneyContextValue | undefined>(undefined);

export const JourneyProvider = ({ children }: { children: React.ReactNode }) => {
  const { user: authUser } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: [QUERY_KEYS.PROFILE, authUser?.id],
    queryFn: () => ProfileService.getOwnProfile(),
    enabled: !!authUser,
  });

  const { data: tasks = [], isLoading: isTasksLoading } = useQuery({
    queryKey: [QUERY_KEYS.TASKS, authUser?.id],
    queryFn: () => TaskService.getMyTasks(),
    enabled: !!authUser,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (updates: Partial<Profile>) => ProfileService.updateProfile(updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE] }),
  });

  const completeTaskMutation = useMutation({
    mutationFn: (taskId: string) => TaskService.complete(taskId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS] }),
  });

  const userData = useMemo(() => profile || INITIAL_USER, [profile]);
  
  const currentStep = useMemo(() => {
    if ('current_step' in userData) return userData.current_step || 1;
    if ('currentStep' in userData) return (userData as any).currentStep || 1;
    return 1;
  }, [userData]);
  
  const progress = useMemo(() => {
    if (!tasks || tasks.length === 0) return 0;
    const completedCount = tasks.filter(t => t.status === "completed").length;
    return (completedCount / tasks.length) * 100;
  }, [tasks]);

  const toggleBookmark = (id: string) => {
    console.log("Toggle bookmark", id);
  };

  const isLoading = isProfileLoading || isTasksLoading;

  const value = useMemo(() => ({ 
    user: userData, 
    updateUser: async (updates: Partial<Profile>) => { await updateProfileMutation.mutateAsync(updates); }, 
    currentStep, 
    progress, 
    recommendations: MOCK_RECOMMENDATIONS,
    bookmarks: [],
    toggleBookmark,
    completeTask: async (taskId: string) => { await completeTaskMutation.mutateAsync(taskId); },
    isLoading,
    tasks,
    updateProfileMutation
  }), [userData, currentStep, progress, tasks, isLoading, updateProfileMutation, completeTaskMutation]);

  return (
    <JourneyContext.Provider value={value}>
      {children}
    </JourneyContext.Provider>
  );
};

export const useJourney = () => {
  const context = useContext(JourneyContext);
  if (context === undefined) {
    throw new Error("useJourney must be used within a JourneyProvider");
  }
  return context;
};
