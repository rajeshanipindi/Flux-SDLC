import React from "react";
import { Ticket, TicketStatus } from "../types";
import TicketCard from "./TicketCard";
import { AlertCircle, RefreshCw, CheckCircle, HelpCircle, Ban, HelpCircle as HelpIcon } from "lucide-react";

interface KanbanBoardProps {
  tickets: Ticket[];
  onStatusChange: (id: string, status: TicketStatus) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function KanbanBoard({ tickets, onStatusChange, onDelete }: KanbanBoardProps) {
  // Define columns
  const columns: { status: TicketStatus; label: string; icon: any; color: string; bg: string; dot: string }[] = [
    {
      status: "Open",
      label: "Open backlog",
      icon: AlertCircle,
      color: "text-indigo-300",
      bg: "bg-indigo-500/10 border-indigo-500/20",
      dot: "bg-indigo-400",
    },
    {
      status: "In Progress",
      label: "In progress",
      icon: RefreshCw,
      color: "text-amber-300",
      bg: "bg-amber-500/10 border-amber-500/20",
      dot: "bg-amber-400 animate-ping",
    },
    {
      status: "Closed",
      label: "Resolved",
      icon: CheckCircle,
      color: "text-emerald-300",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      dot: "bg-emerald-400",
    },
    {
      status: "Reopen",
      label: "Reopened",
      icon: HelpIcon,
      color: "text-rose-300",
      bg: "bg-rose-500/10 border-rose-500/20",
      dot: "bg-rose-400",
    },
    {
      status: "Can't Fix",
      label: "Can't fix",
      icon: Ban,
      color: "text-slate-300",
      bg: "bg-slate-500/10 border-slate-500/20",
      dot: "bg-slate-400",
    },
  ];

  return (
    <div className="relative z-10 w-full overflow-x-auto pb-4">
      {/* 5-column responsive row */}
      <div className="flex gap-4 min-w-[1200px] xl:min-w-0 xl:grid xl:grid-cols-5 items-start">
        {columns.map((column) => {
          const colTickets = tickets.filter((t) => t.status === column.status);
          const Icon = column.icon;

          return (
            <div
              key={column.status}
              className="flex-1 w-[260px] md:w-auto p-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl flex flex-col min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${column.dot}`} />
                  <span className="text-xs font-extrabold text-white tracking-widest uppercase">
                    {column.status}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-md border border-white/10">
                  {colTickets.length}
                </span>
              </div>

              {/* Tickets list */}
              <div className="space-y-4 flex-1 overflow-y-auto max-h-[600px] pr-1">
                {colTickets.length > 0 ? (
                  colTickets.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      onStatusChange={onStatusChange}
                      onDelete={onDelete}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-white/10 rounded-xl bg-white/5">
                    <span className="text-[10px] font-extrabold text-indigo-200/80 tracking-wider uppercase">
                      No tickets in {column.status}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
