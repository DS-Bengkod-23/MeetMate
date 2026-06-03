import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyActionItems, updateActionItem } from "@/lib/api";

export function useMyActionItems(status?: "open" | "done") {
  return useQuery({
    queryKey: ["action-items", status],
    queryFn: () => getMyActionItems(status),
  });
}

export function useUpdateActionItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "open" | "done" }) =>
      updateActionItem(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["action-items"] });
    },
  });
}
