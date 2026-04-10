"use client";

import { useState } from "react";
import { useCreateIssueStore } from "@/stores/createIssueStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { createIssue } from "@/server/actions/issues";
import { toast } from "sonner";
import { Priority } from "@prisma/client";
import { cn } from "@/lib/utils";

const PRIORITIES = [
  { value: Priority.NONE, label: "None", color: "text-[#9191a0] bg-[#303036] border-[#404048]" },
  { value: Priority.LOW, label: "Low", color: "text-[#6e9fff] bg-[#1a2638] border-[#6e9fff]/30" },
  { value: Priority.MEDIUM, label: "Medium", color: "text-[#c8a000] bg-[#2a2205] border-[#c8a000]/30" },
  { value: Priority.HIGH, label: "High", color: "text-[#c84040] bg-[#3d0808] border-[#c84040]/30" },
  { value: Priority.CRITICAL, label: "Critical", color: "text-[#ff4d4f] bg-[#4a0b0b] border-[#ff4d4f]/30" },
];

export function CreateIssueModal() {
  const { isOpen, closeModal } = useCreateIssueStore();
  
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [priority, setPriority] = useState<Priority>(Priority.NONE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Since Shadcn base-ui Dialog expects to control open via local state usually, 
  // we pass `open={isOpen}` and `onOpenChange={(open) => !open && closeModal()}`
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const issue = await createIssue({ title, body, priority });
      toast.success(`Complaint #${issue.number} created successfully`);
      
      // reset
      setTitle("");
      setBody("");
      setPriority(Priority.NONE);
      closeModal();
    } catch (err) {
      toast.error("Failed to create complaint");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="bg-[#1f2023] border-[#404048] text-[#dcdcde] w-full max-w-2xl p-0 gap-0 shadow-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="px-5 py-4 border-b border-[#404048]">
            <DialogTitle className="text-[16px] font-semibold">New Complaint</DialogTitle>
          </DialogHeader>

          <div className="p-5 space-y-4 bg-[#26262c]">
            {/* Title */}
            <div>
              <label className="block text-[11px] font-semibold text-[#9191a0] uppercase tracking-wider mb-1.5">
                Title
              </label>
              <input
                autoFocus
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Complaint title..."
                className="w-full bg-[#1f2023] border border-[#404048] rounded px-3 py-2 text-[14px] text-[#dcdcde] placeholder:text-[#5a5a6a] focus:outline-none focus:border-[#7759c2] transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-semibold text-[#9191a0] uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Describe the complaint details..."
                rows={5}
                className="w-full bg-[#1f2023] border border-[#404048] rounded px-3 py-2 text-[13px] text-[#dcdcde] placeholder:text-[#5a5a6a] resize-y focus:outline-none focus:border-[#7759c2] transition-colors"
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                    e.preventDefault();
                    if (!isSubmitting) handleSubmit(e);
                  }
                }}
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-[11px] font-semibold text-[#9191a0] uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPriority(p.value)}
                    className={cn(
                      "px-3 py-1.5 rounded text-[12px] font-medium border transition-all",
                      priority === p.value
                        ? p.color
                        : "text-[#9191a0] bg-[#1f2023] border-[#404048] hover:border-[#5a5a6a]"
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="px-5 py-3 border-t border-[#404048] bg-[#1f2023] flex items-center justify-between sm:justify-between">
            <div className="text-[11px] text-[#9191a0]">
              <kbd className="kbd">⌘</kbd> + <kbd className="kbd">↵</kbd> to submit
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-1.5 rounded border border-[#404048] text-[#dcdcde] text-[13px] hover:bg-[#303036] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !title.trim()}
                className="px-4 py-1.5 rounded bg-[#7759c2] text-white text-[13px] font-medium hover:bg-[#8b6fd4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Creating..." : "Create Complaint"}
              </button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
