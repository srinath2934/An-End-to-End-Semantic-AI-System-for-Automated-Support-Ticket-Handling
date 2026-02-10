"""
Analytics Engine for ML Ticket Classification System
Calculates KPIs, category distribution, and prediction timeline
"""

import sqlite3
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, List, Any
from collections import Counter

DB_PATH = Path(__file__).parent.parent / 'data' / 'db' / 'tickets.db'

def get_db_connection():
    """Get database connection"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def calculate_kpis() -> Dict[str, Any]:
    """
    Calculate 4 key performance indicators for KPI cards
    Returns: dict with ai_accuracy, total_tickets, predictions_made, avg_confidence
    """
    conn = get_db_connection()
    
    # Total tickets in database
    total_tickets = conn.execute('SELECT COUNT(*) as count FROM tickets').fetchone()['count']
    
    # Tickets with resolution (predictions made)
    predictions_made = conn.execute(
        "SELECT COUNT(*) as count FROM tickets WHERE status = 'Solved'"
    ).fetchone()['count']
    
    conn.close()
    
    # Mock AI accuracy and confidence (in production, calculate from prediction logs)
    ai_accuracy = 94.2
    avg_confidence = 87.5
    
    return {
        "ai_accuracy": ai_accuracy,
        "total_tickets": total_tickets,
        "predictions_made": predictions_made,
        "avg_confidence": avg_confidence
    }


def get_category_distribution() -> List[Dict[str, Any]]:
    """
    Get ticket count by category for pie chart
    Returns: list of {category, count, percentage}
    """
    conn = get_db_connection()
    
    # Get all tickets with their priority (using priority as proxy for category)
    tickets = conn.execute('SELECT priority FROM tickets').fetchall()
    conn.close()
    
    if not tickets:
        return []
    
    # Count by priority
    priority_counts = Counter([t['priority'] for t in tickets if t['priority']])
    total = sum(priority_counts.values())
    
    # Format for pie chart
    result = []
    for category, count in priority_counts.most_common():
        result.append({
            "category": category,
            "count": count,
            "percentage": round((count / total) * 100, 1)
        })
    
    return result


def get_prediction_timeline() -> List[Dict[str, Any]]:
    """
    Get daily prediction counts for last 7 days for line chart
    Returns: list of {day, count}
    """
    conn = get_db_connection()
    
    # Get tickets from last 7 days
    seven_days_ago = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
    
    tickets = conn.execute(
        '''
        SELECT DATE(created_at) as date, COUNT(*) as count 
        FROM tickets 
        WHERE created_at >= ?
        GROUP BY DATE(created_at)
        ORDER BY date
        ''',
        (seven_days_ago,)
    ).fetchall()
    
    conn.close()
    
    # Format for line chart
    result = []
    for ticket in tickets:
        date_obj = datetime.strptime(ticket['date'], '%Y-%m-%d')
        day_name = date_obj.strftime('%a')  # Mon, Tue, Wed, etc.
        result.append({
            "day": day_name,
            "count": ticket['count']
        })
    
    # If no data, return mock data for last 7 days
    if not result:
        days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        result = [{"day": day, "count": 0} for day in days[-7:]]
    
    return result


def get_analytics_summary() -> Dict[str, Any]:
    """
    Get complete analytics summary (all data in one call)
    Useful for reducing API calls from frontend
    """
    return {
        "kpis": calculate_kpis(),
        "categories": get_category_distribution(),
        "timeline": get_prediction_timeline()
    }
