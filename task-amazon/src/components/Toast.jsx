import { useStore } from "../store/useStore";
import { CheckCircle2 } from "lucide-react";

export default function Toast() {
  const toast = useStore((s) => s.toast);
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-navy text-white px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 text-sm animate-[fadein_.15s_ease-out]">
      <CheckCircle2 size={16} className="text-green-400" />
      {toast}
    </div>
  );
}
