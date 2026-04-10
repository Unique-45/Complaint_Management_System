"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X, ExternalLink, Copy, ArrowUpRight, GitMerge, Flag, Maximize2 } from "lucide-react";
import { toast } from "sonner";
import { useDrawerStore } from "@/stores/drawerStore";
import { promoteIssue, markSpam, markDone } from "@/server/actions/issues";
import { cn, PRIORITY_META, STATUS_META, CI_META, formatRelativeDate, isStale, similarityColor, similarityBg } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MessageSquare, Lock, Globe, GitPullRequest, CircleDot, Clock, Link2 } from "lucide-react";

type FullIssue = {
  id: string; number: number; title: string; body: string;
  source: string; status: string; priority: string;
  discordAuthorName: string | null; discordAvatarUrl: string | null;
  discordReplies: any; githubIssueNumber: number | null;
  githubIssueUrl: string | null; similarityScore: number | null;
  createdAt: Date; lastActivityAt: Date;
  assignees: Array<{ member: { id: string; name: string; handle: string; avatarUrl: string | null } }>;
  labels: Array<{ label: { id: string; name: string; color: string } }>;
  linkedPRs: Array<{ id: string; prNumber: number; ciStatus: string; title: string; prUrl: string }>;
  milestone: { id: string; title: string } | null;
  duplicateOf: { id: string; number: number; title: string } | null;
  notes: Array<{ id: string; body: string; isPublic: boolean; createdAt: Date; author: { name: string; handle: string; avatarUrl: string | null } }>;
};

export function IssueDrawer() {
  const { isOpen, issueId, closeDrawer } = useDrawerStore();
  const [issue, setIssue] = useState<FullIssue | null>(null);
  const [loading, setLoading] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onFocus = () => setFocusMode((f) => !f);
    window.addEventListener("toggle-focus-mode", onFocus);
    return () => window.removeEventListener("toggle-focus-mode", onFocus);
  }, []);

  useEffect(() => {
    if (!issueId) { setIssue(null); return; }
    setLoading(true);
    fetch(`/api/issues/${issueId}`)
      .then((r) => r.json())
      .then((data) => { setIssue(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [issueId]);

  const handlePromote = async () => {
    if (!issue) return;
    await promoteIssue(issue.id);
    toast.success(`#${issue.number} promoted to board`);
    closeDrawer();
    router.refresh();
  };

  const handleSpam = async () => {
    if (!issue) return;
    await markSpam(issue.id);
    toast.success(`#${issue.number} marked as spam`);
    closeDrawer();
    router.refresh();
  };

  const isDiscord = issue?.source === "DISCORD";
  const priority = issue ? PRIORITY_META[issue.priority as keyof typeof PRIORITY_META] : null;
  const status = issue ? STATUS_META[issue.status as keyof typeof STATUS_META] : null;
  const simScore = issue?.similarityScore ?? 0;
  const stale = issue ? isStale(issue.lastActivityAt) : false;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-40 bg-black/40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className={cn(
              "fixed top-0 right-0 bottom-0 z-50 flex flex-col bg-[#1f2023] border-l border-[#404048] shadow-2xl",
              focusMode ? "w-[90vw]" : "w-[72vw] max-w-[960px]"
            )}
          >
            {loading ? (
              <DrawerSkeleton onClose={closeDrawer} />
            ) : issue ? (
              <DrawerContent
                issue={issue}
                isDiscord={isDiscord}
                priority={priority!}
                status={status!}
                simScore={simScore}
                stale={stale}
                focusMode={focusMode}
                onClose={closeDrawer}
                onPromote={handlePromote}
                onSpam={handleSpam}
                onFocusMode={() => setFocusMode(!focusMode)}
              />
            ) : null}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function DrawerContent({ issue, isDiscord, priority, status, simScore, stale, focusMode, onClose, onPromote, onSpam, onFocusMode }: any) {
  const replies: any[] = issue.discordReplies ?? [];

  return (
    <>
      {/* Header */}
      <div className="flex items-start gap-3 px-5 py-3.5 border-b border-[#404048] flex-shrink-0">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="issue-number">#{issue.number}</span>
            {status && (
              <span className={cn("inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium", status.bgColor, status.color)}>
                {status.label}
              </span>
            )}
            {stale && (
              <span className="inline-flex items-center gap-1 text-[10px] text-[#c87a00]">
                <Clock size={9} /> Stale
              </span>
            )}
          </div>
          <h2 className="text-[16px] font-semibold text-[#dcdcde] leading-snug">{issue.title}</h2>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <Tooltip>
            <TooltipTrigger render={
              <button onClick={onFocusMode} className="p-1.5 rounded hover:bg-[#303036] text-[#9191a0] hover:text-[#dcdcde] transition-colors">
                <Maximize2 size={14} />
              </button>
            } />
            <TooltipContent className="bg-[#303036] border-[#404048] text-[11px]">Focus mode <kbd className="kbd ml-1">f</kbd></TooltipContent>
          </Tooltip>
          <button
            onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied"); }}
            className="p-1.5 rounded hover:bg-[#303036] text-[#9191a0] hover:text-[#dcdcde] transition-colors"
          >
            <Copy size={14} />
          </button>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-[#303036] text-[#9191a0] hover:text-[#dcdcde] transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Quick Action Toolbar */}
      <div className="flex items-center gap-1.5 px-5 py-2 border-b border-[#404048] bg-[#26262c] flex-shrink-0 flex-wrap">
        {/* Priority */}
        {priority && (
          <button className={cn("flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[12px] font-medium border transition-colors", priority.color, "border-[#404048] hover:border-[#5a5a6a]", priority.textColor)}>
            {priority.icon} {priority.label}
          </button>
        )}

        {/* Labels */}
        <div className="flex items-center gap-1">
          {issue.labels.slice(0, 3).map(({ label }: any) => (
            <span key={label.id} className="gl-label" style={{ backgroundColor: label.color + "33", borderColor: label.color + "88", color: label.color }}>
              {label.name}
            </span>
          ))}
        </div>

        <div className="flex-1" />

        {/* Context-aware CTA buttons */}
        {isDiscord ? (
          <div className="flex items-center gap-1.5">
            <button onClick={() => toast.info("Merge — coming soon")} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#303036] hover:bg-[#404048] text-[#dcdcde] text-[12px] rounded transition-colors border border-[#404048]">
              <GitMerge size={13} /> Merge into…
            </button>
            <button onClick={() => toast.info("Flag — coming soon")} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#303036] hover:bg-[#404048] text-[#dcdcde] text-[12px] rounded transition-colors border border-[#404048]">
              <Flag size={13} /> Flag Duplicate
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7759c2] hover:bg-[#8b6fd4] text-white text-[12px] font-medium rounded transition-colors">
              <ArrowUpRight size={13} /> Promote to GitHub
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5 text-[11px] text-[#3fb950]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950] animate-pulse" />
              Synced with GitHub
            </div>
            {issue.githubIssueUrl && (
              <a href={issue.githubIssueUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-[#303036] hover:bg-[#404048] text-[#dcdcde] text-[12px] rounded transition-colors border border-[#404048]">
                <ExternalLink size={13} /> View on GitHub
              </a>
            )}
            <button onClick={() => toast.info("Create branch — coming soon")} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7759c2] hover:bg-[#8b6fd4] text-white text-[12px] font-medium rounded transition-colors">
              <GitPullRequest size={13} /> Create Branch
            </button>
          </div>
        )}
      </div>

      {/* Body — two column layout */}
      <div className="flex flex-1 min-h-0">
        {/* Left: main content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

          {/* Discord context block */}
          {isDiscord && (
            <section>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 rounded bg-[#5865f2] flex items-center justify-center">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="white"><path d="M8.474.682A8.24 8.24 0 006.32.068a5.7 5.7 0 00-.262.538 7.618 7.618 0 00-2.115 0A5.68 5.68 0 003.68.068 8.254 8.254 0 001.524.684C.22 2.576-.135 4.421.043 6.241c.896.659 1.763 1.06 2.617 1.324.21-.286.397-.591.558-.912a5.39 5.39 0 01-.878-.421c.074-.054.146-.11.215-.167a5.888 5.888 0 005.09 0c.07.057.142.113.215.167-.28.164-.574.304-.879.421.161.321.348.627.558.913.855-.265 1.723-.666 2.618-1.324.214-2.124-.364-3.951-1.483-5.56z"/></svg>
                </div>
                <span className="text-[11px] font-semibold text-[#9191a0] uppercase tracking-wider">Discord Thread</span>
              </div>

              <div className="bg-[#26262c] border border-[#404048] rounded p-3 space-y-3">
                {/* Original message */}
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#303036] overflow-hidden flex-shrink-0">
                    {issue.discordAvatarUrl && <img src={issue.discordAvatarUrl} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[13px] font-semibold text-[#dcdcde]">{issue.discordAuthorName}</span>
                      <span className="text-[11px] text-[#9191a0]">{formatRelativeDate(issue.createdAt)}</span>
                    </div>
                    <p className="text-[13px] text-[#b0b0b8] leading-relaxed whitespace-pre-wrap">{issue.body}</p>
                  </div>
                </div>

                {/* Replies */}
                {replies.length > 0 && (
                  <>
                    <Separator className="bg-[#404048]" />
                    {replies.map((reply: any, i: number) => (
                      <div key={i} className="flex items-start gap-2.5 pl-2 border-l border-[#5865f2]/40">
                        <div className="w-6 h-6 rounded-full bg-[#303036] flex-shrink-0" />
                        <div>
                          <span className="text-[11px] font-semibold text-[#dcdcde]">{reply.author} </span>
                          <span className="text-[11px] text-[#b0b0b8]">{reply.body}</span>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </section>
          )}

          {/* Issue body (GitHub issues) */}
          {!isDiscord && issue.body && (
            <section>
              <h3 className="text-[12px] font-semibold text-[#9191a0] uppercase tracking-wider mb-2">Description</h3>
              <div className="bg-[#26262c] border border-[#404048] rounded p-3 text-[13px] text-[#b0b0b8] leading-relaxed whitespace-pre-wrap">
                {issue.body}
              </div>
            </section>
          )}

          {/* AI Deduplication Hub */}
          {issue.similarityScore != null && issue.similarityScore > 0.1 && (
            <section>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-semibold text-[#9191a0] uppercase tracking-wider">AI Similarity</span>
                <span className={cn("text-[12px] font-semibold", similarityColor(simScore))}>
                  {Math.round(simScore * 100)}%
                </span>
              </div>
              <div className={cn("border rounded p-3 space-y-2", similarityBg(simScore))}>
                <div className="similarity-bar-track">
                  <div className="similarity-bar-fill" style={{
                    width: `${simScore * 100}%`,
                    backgroundColor: simScore < 0.3 ? "#3fb950" : simScore < 0.65 ? "#c8a000" : "#c84040"
                  }} />
                </div>
                {issue.duplicateOf && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[12px]">
                      <Link2 size={11} className="text-[#9191a0]" />
                      <span className="text-[#9191a0]">Possible duplicate of</span>
                      <span className="issue-number">#{issue.duplicateOf.number}</span>
                      <span className="text-[#dcdcde] truncate max-w-[200px]">{issue.duplicateOf.title}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => toast.info("Merge — coming soon")} className="px-2.5 py-1 bg-[#7759c2] hover:bg-[#8b6fd4] text-white text-[11px] font-medium rounded transition-colors">
                        Merge into #{issue.duplicateOf.number}
                      </button>
                      <button onClick={() => toast.success("Dismissed")} className="px-2.5 py-1 bg-transparent hover:bg-[#303036] text-[#9191a0] text-[11px] rounded transition-colors border border-[#404048]">
                        Not a duplicate
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Dual Chat Interface */}
          <section>
            <Tabs defaultValue="internal">
              <TabsList className="bg-[#303036] border border-[#404048] mb-3">
                <TabsTrigger value="internal" className="flex items-center gap-1.5 text-[12px] data-[state=active]:bg-[#26262c]">
                  <Lock size={11} /> Internal Notes
                </TabsTrigger>
                <TabsTrigger value="public" className="flex items-center gap-1.5 text-[12px] data-[state=active]:bg-[#26262c]">
                  <Globe size={11} /> Public Reply
                </TabsTrigger>
              </TabsList>

              <TabsContent value="internal">
                <div className="bg-[#1a1a26] border border-[#7759c2]/30 rounded p-3 mb-2">
                  <p className="text-[10px] text-[#7759c2] font-medium mb-2 flex items-center gap-1">
                    <Lock size={9} /> Visible to maintainers only
                  </p>
                  {issue.notes.filter((n: any) => !n.isPublic).map((note: any) => (
                    <div key={note.id} className="flex items-start gap-2 mb-2 last:mb-0">
                      <Avatar className="w-5 h-5 flex-shrink-0">
                        <AvatarImage src={note.author.avatarUrl ?? ""} />
                        <AvatarFallback className="bg-[#7759c2] text-white text-[8px]">{note.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="text-[11px] font-medium text-[#dcdcde]">{note.author.name} </span>
                        <span className="text-[10px] text-[#9191a0]">{formatRelativeDate(note.createdAt)}</span>
                        <p className="text-[12px] text-[#b0b0b8] mt-0.5">{note.body}</p>
                      </div>
                    </div>
                  ))}
                  {issue.notes.filter((n: any) => !n.isPublic).length === 0 && (
                    <p className="text-[12px] text-[#9191a0]">No internal notes yet.</p>
                  )}
                </div>
                <textarea
                  className="w-full bg-[#26262c] border border-[#404048] rounded px-3 py-2 text-[13px] text-[#dcdcde] placeholder:text-[#9191a0] resize-none focus:outline-none focus:border-[#7759c2] transition-colors"
                  rows={3}
                  placeholder="Write an internal note…"
                  onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { toast.success("Note saved (Phase 2)"); (e.target as HTMLTextAreaElement).value = ""; } }}
                />
                <p className="text-[10px] text-[#9191a0] mt-1"><kbd className="kbd">⌘↵</kbd> to send</p>
              </TabsContent>

              <TabsContent value="public">
                <div className="bg-[#1a2a1a] border border-[#3fb950]/30 rounded p-3 mb-2">
                  <p className="text-[10px] text-[#3fb950] font-medium mb-2 flex items-center gap-1">
                    <Globe size={9} /> Will be posted to Discord thread
                  </p>
                  {issue.notes.filter((n: any) => n.isPublic).map((note: any) => (
                    <div key={note.id} className="flex items-start gap-2 mb-2 last:mb-0">
                      <Avatar className="w-5 h-5 flex-shrink-0">
                        <AvatarImage src={note.author.avatarUrl ?? ""} />
                        <AvatarFallback className="bg-[#3fb950] text-white text-[8px]">{note.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="text-[11px] font-medium text-[#dcdcde]">{note.author.name} </span>
                        <span className="text-[10px] text-[#9191a0]">{formatRelativeDate(note.createdAt)}</span>
                        <p className="text-[12px] text-[#b0b0b8] mt-0.5">{note.body}</p>
                      </div>
                    </div>
                  ))}
                  {issue.notes.filter((n: any) => n.isPublic).length === 0 && (
                    <p className="text-[12px] text-[#9191a0]">No public replies yet.</p>
                  )}
                </div>
                <textarea
                  className="w-full bg-[#26262c] border border-[#404048] rounded px-3 py-2 text-[13px] text-[#dcdcde] placeholder:text-[#9191a0] resize-none focus:outline-none focus:border-[#3fb950] transition-colors"
                  rows={3}
                  placeholder="Write a public reply (sent to Discord)…"
                  onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { toast.success("Reply sent (Phase 2)"); (e.target as HTMLTextAreaElement).value = ""; } }}
                />
                <p className="text-[10px] text-[#9191a0] mt-1"><kbd className="kbd">⌘↵</kbd> to send</p>
              </TabsContent>
            </Tabs>
          </section>
        </div>

        {/* Right sidebar: Metadata */}
        <div className="w-[220px] flex-shrink-0 border-l border-[#404048] overflow-y-auto px-3 py-4 space-y-4 bg-[#26262c]">
          {/* Assignees */}
          <div>
            <p className="text-[10px] font-semibold text-[#9191a0] uppercase tracking-wider mb-1.5">Assignees</p>
            {issue.assignees.length > 0 ? (
              <div className="space-y-1.5">
                {issue.assignees.map(({ member }: any) => (
                  <div key={member.id} className="flex items-center gap-1.5">
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={member.avatarUrl ?? ""} />
                      <AvatarFallback className="bg-[#7759c2] text-white text-[8px]">{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-[12px] text-[#dcdcde]">{member.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <button className="text-[12px] text-[#7759c2] hover:underline">+ Assign</button>
            )}
          </div>

          <Separator className="bg-[#404048]" />

          {/* Labels */}
          <div>
            <p className="text-[10px] font-semibold text-[#9191a0] uppercase tracking-wider mb-1.5">Labels</p>
            <div className="flex flex-wrap gap-1">
              {issue.labels.map(({ label }: any) => (
                <span key={label.id} className="gl-label" style={{ backgroundColor: label.color + "33", borderColor: label.color + "88", color: label.color }}>
                  {label.name}
                </span>
              ))}
              {issue.labels.length === 0 && <button className="text-[12px] text-[#7759c2] hover:underline">+ Add label</button>}
            </div>
          </div>

          <Separator className="bg-[#404048]" />

          {/* Milestone */}
          <div>
            <p className="text-[10px] font-semibold text-[#9191a0] uppercase tracking-wider mb-1.5">Milestone</p>
            <p className="text-[12px] text-[#dcdcde]">
              {issue.milestone?.title ?? <span className="text-[#9191a0]">No milestone</span>}
            </p>
          </div>

          {/* GitHub Status Block */}
          {!isDiscord && (
            <>
              <Separator className="bg-[#404048]" />
              <div>
                <p className="text-[10px] font-semibold text-[#9191a0] uppercase tracking-wider mb-1.5">GitHub</p>
                {issue.githubIssueNumber && (
                  <a href={issue.githubIssueUrl ?? "#"} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[12px] text-[#6e9fff] hover:underline mb-2">
                    <ExternalLink size={10} /> Issue #{issue.githubIssueNumber}
                  </a>
                )}
                {issue.linkedPRs.length > 0 && (
                  <div className="space-y-1.5">
                    {issue.linkedPRs.map((pr: any) => {
                      const ci = CI_META[pr.ciStatus];
                      return (
                        <a key={pr.id} href={pr.prUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[11px] text-[#dcdcde] hover:text-[#6e9fff] transition-colors">
                          <GitPullRequest size={10} className={ci?.color} />
                          <span className="truncate">PR #{pr.prNumber}</span>
                          <span className={cn("ci-dot ml-auto", ci?.dot)} />
                        </a>
                      );
                    })}
                  </div>
                )}
                <p className="text-[10px] text-[#9191a0] mt-2">Last synced {formatRelativeDate(issue.lastActivityAt)}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Contextual Footer */}
      <div className="flex items-center justify-between px-5 py-2.5 border-t border-[#404048] bg-[#26262c] flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <Tooltip>
            <TooltipTrigger render={
              <button onClick={onClose} className="px-3 py-1.5 text-[12px] text-[#9191a0] hover:text-[#dcdcde] hover:bg-[#303036] rounded border border-transparent hover:border-[#404048] transition-all">
                Close
              </button>
            } />
            <TooltipContent className="bg-[#303036] border-[#404048] text-[11px]"><kbd className="kbd">Esc</kbd></TooltipContent>
          </Tooltip>
        </div>

        {isDiscord ? (
          <div className="flex items-center gap-2">
            <button onClick={onSpam} className="px-3 py-1.5 text-[12px] text-[#c84040] hover:bg-[#3d0808] rounded border border-[#404048] hover:border-[#c84040] transition-all">
              Mark Spam
            </button>
            <button onClick={() => toast.info("Merge — coming soon")} className="px-3 py-1.5 text-[12px] text-[#dcdcde] bg-[#303036] hover:bg-[#404048] rounded border border-[#404048] transition-all">
              <GitMerge size={12} className="inline mr-1" />Merge into…
            </button>
            <button onClick={onPromote} className="px-4 py-1.5 text-[12px] text-white bg-[#7759c2] hover:bg-[#8b6fd4] rounded font-medium transition-colors">
              <ArrowUpRight size={12} className="inline mr-1" />Promote to GitHub
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={() => toast.info("Creating branch…")} className="px-3 py-1.5 text-[12px] text-[#dcdcde] bg-[#303036] hover:bg-[#404048] rounded border border-[#404048] transition-all">
              <GitPullRequest size={12} className="inline mr-1" />Create Branch
            </button>
            {issue.githubIssueUrl && (
              <a href={issue.githubIssueUrl} target="_blank" rel="noopener noreferrer"
                className="px-4 py-1.5 text-[12px] text-white bg-[#7759c2] hover:bg-[#8b6fd4] rounded font-medium transition-colors flex items-center gap-1">
                <ExternalLink size={12} />View on GitHub
              </a>
            )}
          </div>
        )}
      </div>
    </>
  );
}

function DrawerSkeleton({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col h-full animate-pulse">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#404048]">
        <div className="space-y-2">
          <div className="h-3 w-16 bg-[#303036] rounded" />
          <div className="h-5 w-64 bg-[#303036] rounded" />
        </div>
        <button onClick={onClose}><X size={16} className="text-[#9191a0]" /></button>
      </div>
      <div className="flex-1 p-5 space-y-4">
        {[80, 120, 60, 160].map((w, i) => (
          <div key={i} className="h-3 bg-[#303036] rounded" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}
