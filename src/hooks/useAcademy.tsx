"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import { AcademyService } from "@/services";

export const useAcademy = () => {
  const queryClient = useQueryClient();
  const dashboardQuery = useQuery({
    queryKey: [QUERY_KEYS.ACADEMY_DASHBOARD],
    queryFn: AcademyService.getDashboard,
  });

  const completeLessonMutation = useMutation({
    mutationFn: (lessonId: string) => AcademyService.completeLesson(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACADEMY_DASHBOARD] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE] });
    },
  });

  return { ...dashboardQuery, completeLesson: completeLessonMutation.mutateAsync, isCompletingLesson: completeLessonMutation.isPending };
};
