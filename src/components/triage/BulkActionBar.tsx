"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowUpRight, XCircle, Tag, UserCheck, X, MessageSquareText } from "lucide-react";
import { useBulkSelectStore } from "@/stores/bulkSelectStore";
import { bulkPromote, bulkSpam } from "@/server/actions/issues";
import { AnimatePresence, motion } from "framer-motion";

export function BulkActionBar() {
  const { selectedIds, clearSelection } = useBulkSelectStore();
  const router = useRouter();
  const count = selectedIds.size;
  const ids = Array.from(selectedIds);

  const handlePromoteAll = async () => {
    await bulkPromote(ids);
    clearSelection();
    toast.success(`${count} issues promoted to board`);
    router.refresh();
  };

  const handleSpamAll = async () => {
    await bulkSpam(ids);
    clearSelection();
    toast.success(`${count} issues marked as spam`);
    router.refresh();
  };

  return (
    <AnimatePresence>
      {count >= 2 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 bg-[#26262c] border border-[#5a5a6a] rounded-lg shadow-2xl"
        >
          <span className="text-[13px] font-medium text-[#dcdcde] mr-2">
            <span className="text-[#7759c2] font-semibold">{count}</span> selected
          </span>

          <div className="w-px h-4 bg-[#404048]" />

          <button
            onClick={handlePromoteAll}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#2a1f4d] hover:bg-[#7759c2] text-[#7759c2] hover:text-white text-[12px] font-medium rounded transition-all"
          >
            <ArrowUpRight size={13} />
            Promote All
          </button>

          <button
            onClick={() => toast.info("Mass reply — coming soon")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#303036] hover:bg-[#404048] text-[#dcdcde] text-[12px] font-medium rounded transition-colors"
          >
            <MessageSquareText size={13} />
            Mass Reply & Close
          </button>

          <button
            onClick={() => toast.info("Assign — coming soon")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#303036] hover:bg-[#404048] text-[#dcdcde] text-[12px] rounded transition-colors"
          >
            <UserCheck size={13} />
            Assign…
          </button>

          <button
            onClick={() => toast.info("Label — coming soon")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#303036] hover:bg-[#404048] text-[#dcdcde] text-[12px] rounded transition-colors"
          >
            <Tag size={13} />
            Label…
          </button>

          <button
            onClick={handleSpamAll}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#3d0808] hover:bg-[#c84040] text-[#c84040] hover:text-white text-[12px] rounded transition-all"
          >
            <XCircle size={13} />
            Spam All
          </button>

          <div className="w-px h-4 bg-[#404048]" />

          <button
            onClick={clearSelection}
            className="p-1.5 hover:bg-[#404048] rounded text-[#9191a0] hover:text-[#dcdcde] transition-colors"
            aria-label="Clear selection"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
