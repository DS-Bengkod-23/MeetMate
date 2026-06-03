import { AlertCircle } from "lucide-react";

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
      <AlertCircle size={14} className="shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );
}
