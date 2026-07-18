export type TicketStatus = "Open" | "In Progress" | "Closed" | "Reopen" | "Can't Fix";
export type TicketPriority = "Low" | "Medium" | "High" | "Critical";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedTo: string;
  createdAt: string;
}
