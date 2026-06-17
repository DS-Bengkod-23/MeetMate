import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMeetings, createMeeting, searchMeetings, type MeetingsParams } from "@/lib/api";

export function useMeetings(params?: MeetingsParams) {
  return useQuery({
    queryKey: ["meetings", params],
    queryFn: () => getMeetings(params),
  });
}

export function useSearchMeetings(q: string) {
  return useQuery({
    queryKey: ["meetings", "search", q],
    queryFn: () => searchMeetings(q),
    enabled: q.trim().length > 0,
  });
}

export function useCreateMeeting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMeeting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
    },
  });
}
