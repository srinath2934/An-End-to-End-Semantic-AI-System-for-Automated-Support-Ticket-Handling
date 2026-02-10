import sqlite3
from pathlib import Path
from typing import List, Dict, Any, Optional

DB_PATH = Path(__file__).parent.parent / 'data' / 'db' / 'tickets.db'

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    c = conn.cursor()
    # Create valid table schema matching our CSV structure
    c.execute('''
        CREATE TABLE IF NOT EXISTS tickets (
            id INTEGER PRIMARY KEY,
            subject TEXT,
            requester TEXT,
            support_team TEXT,
            priority TEXT,
            status TEXT,
            description TEXT,
            resolution TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def fetch_tickets(limit: int = 50) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    tickets = conn.execute(
        'SELECT * FROM tickets ORDER BY id DESC LIMIT ?', (limit,)
    ).fetchall()
    conn.close()
    return [dict(t) for t in tickets]

def update_ticket_status(ticket_id: int, status: str, resolution: Optional[str] = None):
    conn = get_db_connection()
    if resolution:
        conn.execute(
            'UPDATE tickets SET status = ?, resolution = ? WHERE id = ?',
            (status, resolution, ticket_id)
        )
    else:
        conn.execute(
            'UPDATE tickets SET status = ? WHERE id = ?',
            (status, ticket_id)
        )
    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
    print(f"Database initialized at {DB_PATH}")
