import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "tickets.json");

// Middleware
app.use(express.json());

// Initialize db with sample tickets if empty or not exist
const initialTickets = [
  {
    id: "TCK-101",
    title: "Implement Authentication Flow",
    description: "Design and implement the JWT token-based auth flow on both the frontend and backend, ensuring secure token storage in cookies.",
    status: "Open",
    priority: "High",
    assignedTo: "Sarah Jenkins",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "TCK-102",
    title: "SQL Query Performance Optimization",
    description: "Optimize the analytical queries in reporting dashboards. Add missing compound indexes on user_activity and analytics tables.",
    status: "In Progress",
    priority: "Critical",
    assignedTo: "David Chen",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "TCK-103",
    title: "Fix Mobile Sidebar Layout Shift",
    description: "The mobile drawer causes a 15px layout shift when opened in Safari. Adjust CSS and check scrollbar-gutter settings.",
    status: "Closed",
    priority: "Medium",
    assignedTo: "Emma Watson",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "TCK-104",
    title: "Integrate Real-time Status Synced via WebSockets",
    description: "Connect the dashboard grid with our socket emitter to allow other developers to see updates instantly when ticket state changes.",
    status: "Reopen",
    priority: "Low",
    assignedTo: "Sarah Jenkins",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "TCK-105",
    title: "Internet Explorer CSS Polyfills",
    description: "Support grid gaps and backdrop-filters in obsolete browsers. Marked as Can't Fix due to company support policy shift.",
    status: "Can't Fix",
    priority: "Low",
    assignedTo: "Unassigned",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

function readTickets() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialTickets, null, 2));
      return initialTickets;
    }
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database file:", error);
    return initialTickets;
  }
}

function writeTickets(tickets: any[]) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(tickets, null, 2));
  } catch (error) {
    console.error("Error writing to database file:", error);
  }
}

// REST API Endpoints
// 1. View all tickets
app.get("/api/tickets", (req, res) => {
  const tickets = readTickets();
  res.json(tickets);
});

// 2. Create a new ticket
app.post("/api/tickets", (req, res) => {
  const { title, description, priority, assignedTo } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const tickets = readTickets();
  
  // Generate ticket ID like TCK-106
  let nextNum = 101;
  if (tickets.length > 0) {
    const ids = tickets
      .map((t: any) => {
        const match = t.id.match(/TCK-(\d+)/);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter((n): n is number => n !== null);
    if (ids.length > 0) {
      nextNum = Math.max(...ids) + 1;
    }
  }
  const id = `TCK-${nextNum}`;

  const newTicket = {
    id,
    title,
    description: description || "",
    status: "Open", // Strict starting status
    priority: priority || "Medium",
    assignedTo: assignedTo || "Unassigned",
    createdAt: new Date().toISOString(),
  };

  tickets.unshift(newTicket); // Prepend so new ones show first
  writeTickets(tickets);

  res.status(201).json(newTicket);
});

// 3. Update a ticket's status or details
app.put("/api/tickets/:id", (req, res) => {
  const { id } = req.params;
  const { status, title, description, priority, assignedTo } = req.body;

  const validStatuses = ["Open", "In Progress", "Closed", "Reopen", "Can't Fix"];
  
  const tickets = readTickets();
  const ticketIndex = tickets.findIndex((t: any) => t.id === id);

  if (ticketIndex === -1) {
    return res.status(404).json({ error: "Ticket not found" });
  }

  // Update status if provided
  if (status !== undefined) {
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
    }
    tickets[ticketIndex].status = status;
  }

  // Allow updating other fields as well for completeness
  if (title !== undefined) tickets[ticketIndex].title = title;
  if (description !== undefined) tickets[ticketIndex].description = description;
  if (priority !== undefined) tickets[ticketIndex].priority = priority;
  if (assignedTo !== undefined) tickets[ticketIndex].assignedTo = assignedTo;

  writeTickets(tickets);
  res.json(tickets[ticketIndex]);
});

// 4. Delete a ticket
app.delete("/api/tickets/:id", (req, res) => {
  const { id } = req.params;
  const tickets = readTickets();
  const filteredTickets = tickets.filter((t: any) => t.id !== id);

  if (tickets.length === filteredTickets.length) {
    return res.status(404).json({ error: "Ticket not found" });
  }

  writeTickets(filteredTickets);
  res.json({ success: true, message: `Ticket ${id} successfully deleted` });
});

// Vite Setup or Static Asset Hosting
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SDLC Ticketing Server running on http://localhost:${PORT}`);
  });
}

startServer();
