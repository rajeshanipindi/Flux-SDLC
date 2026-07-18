import React, { useState } from "react";
import { motion } from "motion/react";
import { Trash2, User, Clock, AlertOctagon, Check, ShieldAlert, AlertCircle, Loader2 } from "lucide-react";
import { Ticket, TicketStatus } from "../types";

interface TicketCardProps {
  key?: string | number;
  ticket: Ticket;
  onStatusChange: (id: string, status: TicketStatus) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function TicketCard({ ticket, onStatusChange, onDelete }: TicketCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleStatusChange = async (newStatus: TicketStatus) => {
    if (newStatus === ticket.status) return;
    setIsUpdating(true);
    try {
      await onStatusChange(ticket.id, newStatus);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(ticket.id);
    } catch (err) {
      console.error(err);
      setIsDeleting(false);
    }
  };

  // Get status class
  const getStatusStyle = (status: TicketStatus) => {
    switch (status) {
      case "Open":
        return "bg-indigo-500/15 text-indigo-300 border-indigo-500/30";
      case "In Progress":
        return "bg-amber-500/15 text-amber-300 border-amber-500/30 ring-1 ring-amber-500/20";
      case "Closed":
        return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
      case "Reopen":
        return "bg-rose-500/15 text-rose-300 border-rose-500/30";
      case "Can't Fix":
        return "bg-slate-500/15 text-slate-300 border-slate-500/30";
      default:
        return "bg-white/5 text-slate-300 border-white/10";
    }
  };

  // Get priority style
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-rose-500/20 text-rose-300 border-rose-500/30";
      case "High":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "Medium":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "Low":
      default:
        return "bg-slate-500/15 text-slate-400 border-slate-500/20";
    }
  };

  // Format date helper
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25, type: "spring", stiffness: 300, damping: 25 }}
      className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl hover:bg-white/15 hover:shadow-black/30 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
    >
      {/* Decorative colored glow bar based on priority */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 transition-all duration-300 ${
          ticket.priority === "Critical"
            ? "bg-rose-500"
            : ticket.priority === "High"
            ? "bg-amber-500"
            : ticket.priority === "Medium"
            ? "bg-blue-500"
            : "bg-slate-500"
        }`}
      />

      {/* Delete and Status updating overlay */}
      {(isUpdating || isDeleting) && (
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            <span className="text-xs font-semibold text-slate-300 font-mono">
              {isDeleting ? "Declassifying Ticket..." : "Syncing Status..."}
            </span>
          </div>
        </div>
      )}

      {/* Main card content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        {/* Ticket ID & Priority Badge */}
        <div className="flex items-center justify-between mb-3.5">
          <span className="font-mono text-[10px] font-bold text-indigo-200 tracking-wider bg-white/15 border border-white/20 px-2.5 py-1 rounded-lg">
            {ticket.id}
          </span>
          <div className="flex items-center gap-2">
            <span
              className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getPriorityStyle(
                ticket.priority
              )}`}
            >
              {ticket.priority}
            </span>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1.5 rounded-lg text-indigo-200 hover:text-rose-400 hover:bg-white/10 transition-colors duration-200 cursor-pointer"
              title="Delete Ticket"
              id={`delete-btn-${ticket.id}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title & Description */}
        <div className="mb-4 flex-1">
          <h3 className="text-sm font-bold text-white tracking-tight leading-snug mb-1.5 line-clamp-2">
            {ticket.title}
          </h3>
          <p className="text-[11px] text-indigo-100/90 leading-relaxed font-normal line-clamp-3">
            {ticket.description || "No descriptive developer logs provided for this ticket."}
          </p>
        </div>

        {/* Metadata section */}
        <div className="border-t border-white/10 pt-3.5 mt-auto space-y-2">
          {/* Assigned To */}
          <div className="flex items-center justify-between text-[11px] text-indigo-200">
            <span className="flex items-center gap-1.5 font-semibold">
              <User className="w-3 h-3 text-indigo-200" />
              <span>Owner:</span>
            </span>
            <span className="text-white font-bold">{ticket.assignedTo}</span>
          </div>

          {/* Created Date */}
          <div className="flex items-center justify-between text-[11px] text-indigo-200">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-indigo-200" />
              <span>Created:</span>
            </span>
            <span className="font-mono text-[10px] text-indigo-100">
              {formatDate(ticket.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Card Action footer (Status dropdown in Theme Style) */}
      <div className="px-5 py-3 bg-white/5 border-t border-white/10 backdrop-blur-md flex items-center justify-between gap-2.5">
        <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider">
          State:
        </span>
        <div className="relative flex-1 max-w-[145px]">
          <select
            value={ticket.status}
            onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
            className="w-full bg-transparent text-[11px] text-white font-bold outline-none border-none cursor-pointer appearance-none"
            id={`status-select-${ticket.id}`}
          >
            <option value="Open" className="bg-slate-900 text-slate-200 font-bold">Open</option>
            <option value="In Progress" className="bg-slate-900 text-slate-200 font-bold">In Progress</option>
            <option value="Closed" className="bg-slate-900 text-slate-200 font-bold">Closed</option>
            <option value="Reopen" className="bg-slate-900 text-slate-200 font-bold">Reopen</option>
            <option value="Can't Fix" className="bg-slate-900 text-slate-200 font-bold">Can't Fix</option>
          </select>
          <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[8px] pointer-events-none text-white/80">
            ▼
          </span>
        </div>
      </div>

      {/* Glass confirmation modal for deleting */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md p-5 flex flex-col justify-center items-center text-center z-30 animate-fade-in">
          <ShieldAlert className="w-8 h-8 text-rose-500 mb-2 animate-bounce" />
          <h4 className="text-xs font-bold text-white mb-1 uppercase tracking-wide">
            Decommission Ticket?
          </h4>
          <p className="text-[11px] text-slate-300 max-w-[180px] mb-4">
            This will permanently purge <span className="font-mono font-bold text-indigo-400">{ticket.id}</span> from the database registers.
          </p>
          <div className="flex gap-2.5">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-3.5 py-1.5 text-[10px] font-bold rounded-lg bg-white/5 text-slate-200 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
              id={`cancel-delete-${ticket.id}`}
            >
              Abstain
            </button>
            <button
              onClick={() => {
                setShowDeleteConfirm(false);
                handleDelete();
              }}
              className="px-3.5 py-1.5 text-[10px] font-bold rounded-lg bg-rose-600 text-white shadow-lg shadow-rose-600/30 hover:bg-rose-700 transition-all duration-200 cursor-pointer"
              id={`confirm-delete-${ticket.id}`}
            >
              Decommission
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
