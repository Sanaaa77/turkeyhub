import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImportPayload, UniversityImportEngine, UniversityService, UniversitySearchFilters } from "@/services";
import { QUERY_KEYS } from "@/lib/react-query/queryKeys";

export const useUniversities = (filters: UniversitySearchFilters = {}) =>
  useQuery({
    queryKey: [QUERY_KEYS.UNIVERSITIES, filters],
    queryFn: () => UniversityService.getAll(filters),
  });

export const useUniversityProfile = (slug: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.UNIVERSITIES, slug],
    queryFn: () => UniversityService.getBySlug(slug),
    enabled: Boolean(slug),
  });

export const useUniversityImport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ImportPayload) => UniversityImportEngine.importUniversities(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.UNIVERSITIES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.IMPORT_HISTORY] });
    },
  });
};

export const useImportHistory = () =>
  useQuery({
    queryKey: [QUERY_KEYS.IMPORT_HISTORY],
    queryFn: () => UniversityService.getImportHistory(),
  });
