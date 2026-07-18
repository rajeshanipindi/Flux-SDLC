import React from "react";
import { Ticket } from "../types";
import { ClipboardList, AlertCircle, RefreshCw, CheckCircle, Info } from "lucide-react";

interface StatPanelProps {
  tickets: Ticket[];
}

export default function StatPanel({ tickets }: StatPanelProps) {
  const total = tickets.length;
  const openCount = tickets.filter((t) => t.status === "Open").length;
  const inProgressCount = tickets.filter((t) => t.status === "In Progress").length;
  const closedCount = tickets.filter((t) => t.status === "Closed").length;
  const reopenCount = tickets.filter((t) => t.status === "Reopen").length;
  const cantFixCount = tickets.filter((t) => t.status === "Can't Fix").length;

  const completionPercent = total > 0 ? Math.round((closedCount / total) * 100) : 0;

  const stats = [
    {
      label: "Total Tickets",
      value: total,
      icon: ClipboardList,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
    },
    {
      label: "Open Tasks",
      value: openCount,
      icon: AlertCircle,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      label: "In Progress",
      value: inProgressCount,
      icon: RefreshCw,
      color: "text-amber-400 font-bold",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      className: "animate-spin-slow",
    },
    {
      label: "Closed / Resolved",
      value: closedCount,
      icon: CheckCircle,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      label: "Blocked / Can't Fix",
      value: reopenCount + cantFixCount,
      icon: Info,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      subText: `${reopenCount} Reopen | ${cantFixCount} Can't Fix`,
    },
  ];

  return (
    <div className="relative z-10 w-full mb-8 grid grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className={`p-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl flex flex-col justify-between group transition-all duration-300 hover:bg-white/15 hover:-translate-y-0.5 ${
              i === 0 ? "col-span-2 lg:col-span-1" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-indigo-100 tracking-wide">
                {stat.label}
              </span>
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.border} border`}>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-white">
                  {stat.value}
                </span>
                {i === 3 && total > 0 && (
                  <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                    {completionPercent}%
                  </span>
                )}
              </div>
              {stat.subText ? (
                <p className="text-[10px] text-indigo-200 mt-1 font-mono tracking-wider">
                  {stat.subText}
                </p>
              ) : (
                <p className="text-[10px] text-indigo-200/80 mt-1">
                  Active in development
                </p>
              )}
            </div>
          </div>
        );
      })}

      {/* Dynamic completion progress bar for total visual feedback */}
      <div className="col-span-2 lg:col-span-5 p-3.5 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-indigo-100 uppercase tracking-wider">Sprint Health Velocity</span>
          <span className="text-xs font-mono text-indigo-100 bg-white/10 px-2 py-0.5 rounded border border-white/15">
            {closedCount} of {total} resolved
          </span>
        </div>
        <div className="w-full md:flex-1 md:max-w-md bg-white/5 rounded-full h-2.5 overflow-hidden border border-white/10">
          <div
            className="bg-gradient-to-r from-yellow-400 to-green-400 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
