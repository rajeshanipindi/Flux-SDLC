import React from "react";
import { Layers, Search, Plus, Grid, Kanban, SlidersHorizontal, X } from "lucide-react";
import { TicketStatus, TicketPriority } from "../types";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  priorityFilter: string;
  setPriorityFilter: (val: string) => void;
  currentView: "grid" | "kanban";
  setCurrentView: (val: "grid" | "kanban") => void;
  isFormOpen: boolean;
  setIsFormOpen: (val: boolean) => void;
  activeTicketsCount: number;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  currentView,
  setCurrentView,
  isFormOpen,
  setIsFormOpen,
  activeTicketsCount,
}: HeaderProps) {
  return (
    <header className="relative z-10 w-full mb-8">
      {/* Brand Section Card matching Professional Polish Theme */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center border border-white/30 shadow-inner text-white shrink-0">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight leading-none">Flux SDLC</h1>
            <p className="text-indigo-200 text-xs font-medium uppercase tracking-widest mt-1.5">Ticketing & Sprint Management</p>
          </div>
        </div>

        {/* View selection, stats and add button group */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-6">
          {/* Active stats counter */}
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-white font-bold text-xl leading-none">{activeTicketsCount}</div>
              <div className="text-indigo-200 text-[10px] uppercase font-bold tracking-widest mt-1">Active Tickets</div>
            </div>
            <div className="h-10 w-px bg-white/20"></div>
          </div>

          {/* New Ticket Trigger */}
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className={`transition-all px-6 py-3 rounded-xl font-bold border backdrop-blur-md shadow-lg flex items-center gap-2 text-xs cursor-pointer active:scale-95 duration-200 ${
              isFormOpen
                ? "bg-rose-500/20 text-rose-300 border-rose-500/30 hover:bg-rose-500/30"
                : "bg-white/20 hover:bg-white/30 text-white border-white/30"
            }`}
            id="btn-toggle-form"
          >
            {isFormOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{isFormOpen ? "Cancel Creation" : "New Ticket"}</span>
          </button>
        </div>
      </div>

      {/* Control / Filter Bar with View Selectors integrated */}
      <div className="p-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full lg:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-200" />
          <input
            type="text"
            placeholder="Search tickets by title, description or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl bg-white/10 border border-white/20 placeholder-indigo-200/70 text-white focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
            id="search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-indigo-200 hover:text-white text-xs font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 text-indigo-200 text-xs font-bold shrink-0 uppercase tracking-wider">
            <SlidersHorizontal className="w-3.5 h-3.5 text-white/80" />
            <span>Filters:</span>
          </div>

          {/* Status Select */}
          <div className="relative flex-1 sm:flex-initial min-w-[130px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40 focus:bg-indigo-950/80 transition-all duration-300 cursor-pointer appearance-none font-semibold"
              id="filter-status"
            >
              <option value="All" className="bg-slate-900 text-slate-200">All Statuses</option>
              <option value="Open" className="bg-slate-900 text-slate-200">Open</option>
              <option value="In Progress" className="bg-slate-900 text-slate-200">In Progress</option>
              <option value="Closed" className="bg-slate-900 text-slate-200">Closed</option>
              <option value="Reopen" className="bg-slate-900 text-slate-200">Reopen</option>
              <option value="Can't Fix" className="bg-slate-900 text-slate-200">Can't Fix</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-white pointer-events-none">▼</span>
          </div>

          {/* Priority Select */}
          <div className="relative flex-1 sm:flex-initial min-w-[130px]">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40 focus:bg-indigo-950/80 transition-all duration-300 cursor-pointer appearance-none font-semibold"
              id="filter-priority"
            >
              <option value="All" className="bg-slate-900 text-slate-200">All Priorities</option>
              <option value="Low" className="bg-slate-900 text-slate-200">Low</option>
              <option value="Medium" className="bg-slate-900 text-slate-200">Medium</option>
              <option value="High" className="bg-slate-900 text-slate-200">High</option>
              <option value="Critical" className="bg-slate-900 text-slate-200">Critical</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-white pointer-events-none">▼</span>
          </div>

          {/* Reset Filters button */}
          {(statusFilter !== "All" || priorityFilter !== "All" || searchQuery !== "") && (
            <button
              onClick={() => {
                setStatusFilter("All");
                setPriorityFilter("All");
                setSearchQuery("");
              }}
              className="text-xs text-white bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl transition-all font-semibold cursor-pointer"
            >
              Reset
            </button>
          )}

          {/* Spacer on large screens */}
          <div className="hidden lg:block h-6 w-px bg-white/20 mx-1"></div>

          {/* View Toggles */}
          <div className="p-1 rounded-xl bg-white/15 border border-white/20 flex items-center gap-1">
            <button
              onClick={() => setCurrentView("grid")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold transition-all duration-300 ${
                currentView === "grid"
                  ? "bg-white/20 text-white border border-white/25 shadow-md"
                  : "text-indigo-200 hover:text-white hover:bg-white/5"
              }`}
              id="btn-view-grid"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setCurrentView("kanban")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold transition-all duration-300 ${
                currentView === "kanban"
                  ? "bg-white/20 text-white border border-white/25 shadow-md"
                  : "text-indigo-200 hover:text-white hover:bg-white/5"
              }`}
              id="btn-view-kanban"
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
