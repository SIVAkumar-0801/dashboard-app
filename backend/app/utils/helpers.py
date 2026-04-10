import uuid
from datetime import datetime, date, timedelta
from typing import Any, Dict, List, Optional


def generate_uuid() -> str:
    return str(uuid.uuid4())


def now_utc() -> datetime:
    return datetime.utcnow()


def today_date() -> date:
    return date.today()


def date_range(start: date, end: date) -> List[date]:
    """Return a list of dates from start to end (inclusive)."""
    delta = (end - start).days
    return [start + timedelta(days=i) for i in range(delta + 1)]


def paginate(query, page: int = 1, page_size: int = 20):
    """Apply offset/limit pagination to a SQLAlchemy query."""
    offset = (page - 1) * page_size
    return query.offset(offset).limit(page_size)


def safe_divide(numerator: float, denominator: float, default: float = 0.0) -> float:
    if denominator == 0:
        return default
    return numerator / denominator


def serialize_model(obj: Any) -> Dict:
    """Serialize a SQLAlchemy model instance to a dict."""
    if hasattr(obj, "__table__"):
        return {c.name: getattr(obj, c.name) for c in obj.__table__.columns}
    return {}
