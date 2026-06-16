import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadRecording, getRecordingStatus, deleteRecording } from "@/lib/api";

const DONE_STATUSES = ["completed", "failed"];

export function useRecordingStatus(meetingId: string, enabled = false) {
  return useQuery({
    queryKey: ["recording-status", meetingId],
    queryFn: () => getRecordingStatus(meetingId),
    enabled: enabled && !!meetingId,
    // Poll setiap 3 detik, berhenti otomatis jika sudah selesai atau gagal
    refetchInterval: (query) => {
      const status = query.state.data?.processing_status;
      if (status && DONE_STATUSES.includes(status)) return false;
      return 3000;
    },
  });
}

export function useUploadRecording(meetingId: string) {
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: (formData: FormData) => {
      setProgress(0);
      return uploadRecording(meetingId, formData, setProgress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meeting", meetingId] });
      queryClient.invalidateQueries({ queryKey: ["recording-status", meetingId] });
    },
    onSettled: () => {
      setProgress(0);
    },
  });

  return { ...mutation, progress: mutation.isPending ? progress : 0 };
}

export function useDeleteRecording(meetingId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteRecording(meetingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meeting", meetingId] });
      queryClient.removeQueries({ queryKey: ["recording-status", meetingId] });
    },
  });
}
