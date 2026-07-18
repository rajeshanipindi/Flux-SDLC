import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Layers, AlertCircle, RefreshCw } from "lucide-react";
import { Ticket, TicketStatus, TicketPriority } from "./types";
import Header from "./components/Header";
import StatPanel from "./components/StatPanel";
import TicketForm from "./components/TicketForm";
import TicketCard from "./components/TicketCard";
import KanbanBoard from "./components/KanbanBoard";

export default function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filtering & View State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [currentView, setCurrentView] = useState<"grid" | "kanban">("grid");
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Fetch all tickets on mount
  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/tickets");
      if (!res.ok) {
        throw new Error("Failed to fetch tickets from servers.");
      }
      const data = await res.json();
      setTickets(data);
    } catch (err: any) {
      setError(err.message || "An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Handle ticket creation
  const handleCreateTicket = async (newTicketData: {
    title: string;
    description: string;
    priority: TicketPriority;
    assignedTo: string;
  }) => {
    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTicketData),
    });

    if (!res.ok) {
      throw new Error("Failed to save ticket on server.");
    }

    const created = await res.json();
    setTickets((prev) => [created, ...prev]);
  };

  // Handle status/detail updates
  const handleUpdateStatus = async (id: string, status: TicketStatus) => {
    const res = await fetch(`/api/tickets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      throw new Error("Failed to update status on server.");
    }

    const updated = await res.json();
    setTickets((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  // Handle ticket deletion
  const handleDeleteTicket = async (id: string) => {
    const res = await fetch(`/api/tickets/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete ticket from server.");
    }

    setTickets((prev) => prev.filter((t) => t.id !== id));
  };

  // Filtered tickets computation
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "All" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="relative min-h-screen pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
      {/* Visual background layers & glowing blur mesh vectors (Glassmorphism canvas background matching theme) */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 -z-20" />
      
      {/* Decorative Orbs with enhanced theme contrast */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-white/5 blur-[120px] -top-40 -left-40 animate-pulse pointer-events-none -z-10" />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-white/5 blur-[140px] top-1/3 -right-60 animate-pulse delay-1000 pointer-events-none -z-10" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-[100px] -bottom-20 left-1/3 animate-pulse delay-500 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto pt-8">
        {/* Navigation & Toolbar */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          currentView={currentView}
          setCurrentView={setCurrentView}
          isFormOpen={isFormOpen}
          setIsFormOpen={setIsFormOpen}
          activeTicketsCount={tickets.length}
        />

        {/* Dynamic Glass Stats Panel */}
        <StatPanel tickets={tickets} />

        {/* Collapsible Ticket Creation Panel */}
        <AnimatePresence>
          {isFormOpen && (
            <TicketForm
              onSubmit={handleCreateTicket}
              onClose={() => setIsFormOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Main Workspace Display */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mb-4" />
            <p className="text-xs font-semibold text-slate-400 font-mono tracking-widest uppercase animate-pulse">
              Syncing Ledger Registries...
            </p>
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl backdrop-blur-md bg-rose-500/10 border border-rose-500/20 text-center max-w-xl mx-auto my-12">
            <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white mb-1.5">Database Registry Sync Failure</h3>
            <p className="text-xs text-rose-300 mb-4 leading-relaxed">{error}</p>
            <button
              onClick={fetchTickets}
              className="px-4 py-2 text-xs font-bold bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 hover:text-white rounded-xl transition-all duration-300 cursor-pointer"
            >
              Retry Sync
            </button>
          </div>
        ) : (
          <div className="relative z-10 w-full">
            {filteredTickets.length === 0 ? (
              <div className="py-24 text-center rounded-2xl border border-dashed border-white/10 backdrop-blur-md bg-white/2 max-w-lg mx-auto">
                <Layers className="w-12 h-12 text-slate-500 mx-auto mb-3.5 opacity-60" />
                <h3 className="text-sm font-bold text-white mb-1">No Tickets Located</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto mb-4 leading-relaxed">
                  There are no active Software SDLC tickets matching your search query or filter selectors.
                </p>
                {(searchQuery || statusFilter !== "All" || priorityFilter !== "All") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("All");
                      setPriorityFilter("All");
                    }}
                    className="text-xs font-bold text-indigo-300 hover:text-white underline underline-offset-4 cursor-pointer"
                  >
                    Clear Filters & Search
                  </button>
                )}
              </div>
            ) : currentView === "grid" ? (
              /* Grid Layout */
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filteredTickets.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      onStatusChange={handleUpdateStatus}
                      onDelete={handleDeleteTicket}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              /* Kanban Layout */
              <KanbanBoard
                tickets={filteredTickets}
                onStatusChange={handleUpdateStatus}
                onDelete={handleDeleteTicket}
              />
            )}
          </div>
        )}

        {/* Bottom Bar Info matching Professional Polish Theme */}
        <footer className="mt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] text-indigo-200 uppercase font-bold tracking-widest border-t border-white/10 pt-4 gap-2">
          <div className="flex gap-4">
            <span>Environment: Production</span>
            <span>DB: SQLite Local</span>
            <span>Uptime: 99.98%</span>
          </div>
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400"></span> API Online
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
