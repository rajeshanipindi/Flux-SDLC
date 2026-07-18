import React, { useState } from "react";
import { motion } from "motion/react";
import { PlusCircle, FileText, User, AlertCircle, Loader2 } from "lucide-react";
import { TicketPriority } from "../types";

interface TicketFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    priority: TicketPriority;
    assignedTo: string;
  }) => Promise<void>;
  onClose: () => void;
}

export default function TicketForm({ onSubmit, onClose }: TicketFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TicketPriority>("Medium");
  const [assignedTo, setAssignedTo] = useState("Unassigned");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Ticket title is required");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      await onSubmit({ title, description, priority, assignedTo });
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setAssignedTo("Unassigned");
      onClose();
    } catch (err) {
      setError("Failed to create ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="relative z-10 w-full mb-8"
    >
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        <div className="flex items-center gap-2.5 mb-6">
          <PlusCircle className="w-5 h-5 text-indigo-200" />
          <h2 className="text-lg font-bold text-white tracking-tight">Create Software Ticket</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2 font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" id="ticket-creation-form">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-indigo-100 mb-1.5 uppercase tracking-wider">
              Task Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Implement Oauth2 Google login flow"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/10 border border-white/20 placeholder-indigo-200/50 text-white focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
              maxLength={100}
              id="input-title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-indigo-100 mb-1.5 uppercase tracking-wider">
              Task Description
            </label>
            <textarea
              placeholder="Provide clean engineering notes, repro steps or requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/10 border border-white/20 placeholder-indigo-200/50 text-white focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300 resize-none"
              maxLength={1000}
              id="input-description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label className="block text-xs font-bold text-indigo-100 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-indigo-200" />
                <span>Priority Level</span>
              </label>
              <div className="relative">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TicketPriority)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40 focus:bg-indigo-950/80 transition-all duration-300 cursor-pointer appearance-none font-semibold"
                  id="select-priority"
                >
                  <option value="Low" className="bg-slate-900 text-slate-200">Low - Auxiliary feature</option>
                  <option value="Medium" className="bg-slate-900 text-slate-200">Medium - Normal release cycle</option>
                  <option value="High" className="bg-slate-900 text-slate-200">High - Blocking dev velocity</option>
                  <option value="Critical" className="bg-slate-900 text-slate-200">Critical - Hotfix / Outage</option>
                </select>
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-white pointer-events-none">▼</span>
              </div>
            </div>

            {/* Assigned To */}
            <div>
              <label className="block text-xs font-bold text-indigo-100 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-200" />
                <span>Assigned Architect</span>
              </label>
              <div className="relative">
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40 focus:bg-indigo-950/80 transition-all duration-300 cursor-pointer appearance-none font-semibold"
                  id="select-assigned"
                >
                  <option value="Unassigned" className="bg-slate-900 text-slate-200">Unassigned (Backlog)</option>
                  <option value="Sarah Jenkins" className="bg-slate-900 text-slate-200">Sarah Jenkins (Backend Lead)</option>
                  <option value="David Chen" className="bg-slate-900 text-slate-200">David Chen (Database Architect)</option>
                  <option value="Emma Watson" className="bg-slate-900 text-slate-200">Emma Watson (Frontend Engineer)</option>
                  <option value="Liam Carter" className="bg-slate-900 text-slate-200">Liam Carter (DevOps Lead)</option>
                </select>
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-white pointer-events-none">▼</span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/10 text-slate-200 hover:text-white hover:bg-white/20 transition-all duration-200 cursor-pointer"
              id="form-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-md shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              id="form-submit"
            >
              {isSubmitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <PlusCircle className="w-3.5 h-3.5" />
              )}
              <span>{isSubmitting ? "Creating..." : "Deploy to Board"}</span>
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
