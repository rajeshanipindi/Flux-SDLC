from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
import uvicorn
import os

app = FastAPI(title="SDLC Ticketing System API")

# Configure CORS for local development running on different ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Setup
DB_FILE = "tickets.db"

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tickets (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL,
        priority TEXT NOT NULL,
        assignedTo TEXT NOT NULL,
        createdAt TEXT NOT NULL
    )
    """)
    
    # Insert sample data if empty
    cursor.execute("SELECT COUNT(*) FROM tickets")
    if cursor.fetchone()[0] == 0:
        samples = [
            ("TCK-101", "Implement Authentication Flow", "Design and implement the JWT token-based auth flow on both the frontend and backend, ensuring secure token storage in cookies.", "Open", "High", "Sarah Jenkins", "2026-07-14T12:00:00Z"),
            ("TCK-102", "SQL Query Performance Optimization", "Optimize analytical queries inside the dashboard. Add database indexes on user activity tables.", "In Progress", "Critical", "David Chen", "2026-07-15T14:30:00Z"),
            ("TCK-103", "Fix Mobile Sidebar Layout Shift", "Mobile drawer causes layout shifts in Safari. Fix CSS and check scrollbar gutter settings.", "Closed", "Medium", "Emma Watson", "2026-07-12T09:15:00Z"),
            ("TCK-104", "Integrate Real-time Status Synced via WebSockets", "Connect client dashboard to server WebSockets.", "Reopen", "Low", "Sarah Jenkins", "2026-07-16T18:45:00Z"),
            ("TCK-105", "Internet Explorer CSS Polyfills", "Support backdrop filters on old IE browsers. Marked as Can't Fix due to deprecation.", "Can't Fix", "Low", "Unassigned", "2026-07-07T11:00:00Z")
        ]
        cursor.executemany("INSERT INTO tickets VALUES (?, ?, ?, ?, ?, ?, ?)", samples)
        conn.commit()
    conn.close()

# Initialize on startup
init_db()

# Pydantic Schemas
class TicketCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    priority: Optional[str] = "Medium"
    assignedTo: Optional[str] = "Unassigned"

class TicketUpdate(BaseModel):
    status: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    assignedTo: Optional[str] = None

class TicketResponse(BaseModel):
    id: str
    title: str
    description: str
    status: str
    priority: str
    assignedTo: str
    createdAt: str

# Helper functions for DB access
def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

# API Endpoints
@app.get("/api/tickets", response_model=List[TicketResponse])
def get_tickets():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tickets ORDER BY createdAt DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

@app.post("/api/tickets", response_model=TicketResponse, status_code=201)
def create_ticket(ticket: TicketCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Generate unique TCK ID
    cursor.execute("SELECT id FROM tickets")
    ids = cursor.fetchall()
    next_num = 101
    num_list = []
    for row in ids:
        val = row['id']
        if val.startswith("TCK-"):
            try:
                num_list.append(int(val.split("-")[1]))
            except ValueError:
                pass
    if num_list:
        next_num = max(num_list) + 1
    
    new_id = f"TCK-{next_num}"
    import datetime
    created_at = datetime.datetime.utcnow().isoformat() + "Z"
    
    cursor.execute(
        "INSERT INTO tickets VALUES (?, ?, ?, 'Open', ?, ?, ?)",
        (new_id, ticket.title, ticket.description, ticket.priority, ticket.assignedTo, created_at)
    )
    conn.commit()
    
    cursor.execute("SELECT * FROM tickets WHERE id = ?", (new_id,))
    new_row = cursor.fetchone()
    conn.close()
    return dict(new_row)

@app.put("/api/tickets/{ticket_id}", response_model=TicketResponse)
def update_ticket(ticket_id: str, ticket_data: TicketUpdate):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tickets WHERE id = ?", (ticket_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    updated_fields = {}
    if ticket_data.status is not None:
        valid_statuses = ["Open", "In Progress", "Closed", "Reopen", "Can't Fix"]
        if ticket_data.status not in valid_statuses:
            conn.close()
            raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
        updated_fields["status"] = ticket_data.status
    if ticket_data.title is not None:
        updated_fields["title"] = ticket_data.title
    if ticket_data.description is not None:
        updated_fields["description"] = ticket_data.description
    if ticket_data.priority is not None:
        updated_fields["priority"] = ticket_data.priority
    if ticket_data.assignedTo is not None:
        updated_fields["assignedTo"] = ticket_data.assignedTo
        
    if updated_fields:
        set_query = ", ".join([f"{k} = ?" for k in updated_fields.keys()])
        values = list(updated_fields.values()) + [ticket_id]
        cursor.execute(f"UPDATE tickets SET {set_query} WHERE id = ?", values)
        conn.commit()
        
    cursor.execute("SELECT * FROM tickets WHERE id = ?", (ticket_id,))
    updated_row = cursor.fetchone()
    conn.close()
    return dict(updated_row)

@app.delete("/api/tickets/{ticket_id}")
def delete_ticket(ticket_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tickets WHERE id = ?", (ticket_id,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Ticket not found")
        
    cursor.execute("DELETE FROM tickets WHERE id = ?", (ticket_id,))
    conn.commit()
    conn.close()
    return {"success": True, "message": f"Ticket {ticket_id} deleted successfully"}

# Serve static files from 'static' folder if it exists
static_path = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_path):
    app.mount("/", StaticFiles(directory=static_path, html=True), name="static")

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
