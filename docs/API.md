# API Documentation

Base URL: `http://localhost:8000` (development) or your deployed backend URL.

All endpoints return JSON. Authentication uses JWT Bearer tokens.

---

## Health Check

### `GET /health`

Returns API health status.

**Response:**
```json
{ "status": "ok", "message": "Dashboard API is running" }
```

---

## Habits API

### `GET /api/habits`

Get all habits for a user, including calculated streak data.

**Query Parameters:**
| Parameter | Type   | Default        | Description        |
|-----------|--------|----------------|--------------------|
| user_id   | string | `default_user` | User identifier    |
| skip      | int    | `0`            | Pagination offset  |
| limit     | int    | `100`          | Max results        |

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "user123",
    "name": "Morning Run",
    "description": "30 min run every morning",
    "category": "health",
    "color": "#3B82F6",
    "icon": null,
    "frequency": "daily",
    "target_per_week": 7,
    "is_active": true,
    "current_streak": 5,
    "longest_streak": 12,
    "completion_rate": 0.85,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-10T00:00:00Z"
  }
]
```

### `POST /api/habits`

Create a new habit.

**Request Body:**
```json
{
  "user_id": "user123",
  "name": "Morning Run",
  "description": "30 min run every morning",
  "category": "health",
  "color": "#3B82F6",
  "frequency": "daily",
  "target_per_week": 7
}
```

### `GET /api/habits/{habit_id}`

Get a specific habit with its recent logs.

### `PUT /api/habits/{habit_id}`

Update a habit.

### `DELETE /api/habits/{habit_id}`

Delete a habit and all its logs.

**Response:** `204 No Content`

### `POST /api/habits/{habit_id}/check-in`

Mark a habit as completed for today.

**Request Body (optional):**
```json
{ "notes": "Felt great today!" }
```

**Response:**
```json
{
  "id": "uuid",
  "habit_id": "uuid",
  "date": "2024-01-15",
  "completed_at": "2024-01-15T08:30:00Z",
  "notes": "Felt great today!"
}
```

### `GET /api/habits/{habit_id}/stats`

Get detailed statistics for a habit.

**Response:**
```json
{
  "habit_id": "uuid",
  "total_completions": 45,
  "current_streak": 5,
  "longest_streak": 12,
  "completion_rate_30d": 0.85,
  "completion_rate_7d": 1.0,
  "last_completed": "2024-01-15"
}
```

---

## Tasks API

### `GET /api/tasks`

Get all tasks with optional filters.

**Query Parameters:**
| Parameter | Type   | Description               |
|-----------|--------|---------------------------|
| user_id   | string | User identifier           |
| status    | string | Filter: todo/in-progress/completed |
| priority  | string | Filter: high/medium/low   |
| category  | string | Filter by category        |

### `POST /api/tasks`

Create a new task.

**Request Body:**
```json
{
  "user_id": "user123",
  "title": "Build dashboard UI",
  "description": "Create the main dashboard layout",
  "priority": "high",
  "category": "development",
  "project": "Dashboard App",
  "deadline": "2024-01-20T17:00:00Z",
  "estimated_hours": 4.0
}
```

### `PUT /api/tasks/{task_id}`

Update a task.

### `DELETE /api/tasks/{task_id}`

Delete a task.

### `PUT /api/tasks/{task_id}/status`

Update only the task status.

**Request Body:**
```json
{ "status": "completed" }
```

### `GET /api/tasks/stats/summary`

Get task statistics summary.

**Response:**
```json
{
  "total": 25,
  "todo": 8,
  "in_progress": 5,
  "completed": 12,
  "high_priority": 6,
  "medium_priority": 12,
  "low_priority": 7,
  "overdue": 2
}
```

---

## Routines API

### `GET /api/routines`

Get all routines for a user.

### `POST /api/routines`

Create a new routine.

**Request Body:**
```json
{
  "user_id": "user123",
  "name": "Morning Workout",
  "description": "Daily exercise routine",
  "time_of_day": "morning",
  "duration_minutes": 45,
  "days_of_week": "1,2,3,4,5"
}
```

### `PUT /api/routines/{routine_id}`

Update a routine.

### `DELETE /api/routines/{routine_id}`

Delete a routine.

### `POST /api/routines/{routine_id}/check-in`

Mark a routine as completed for today.

---

## Analytics API

### `GET /api/analytics/dashboard`

Get overview dashboard statistics.

**Response:**
```json
{
  "habits_completed_today": 3,
  "habits_completed_week": 18,
  "total_active_habits": 5,
  "tasks_completed_today": 2,
  "tasks_in_progress": 3,
  "tasks_todo": 8,
  "routines_completed_today": 2,
  "total_active_routines": 4,
  "longest_current_streak": 7,
  "habit_completion_rate_today": 0.6,
  "habit_completion_rate_week": 0.51
}
```

### `GET /api/analytics/habits`

Get habit-specific analytics.

**Response:**
```json
{
  "total_habits": 5,
  "active_habits": 5,
  "avg_streak": 4.2,
  "avg_completion_rate": 0.78,
  "best_habit": { "name": "Morning Run", "streak": 12 },
  "category_breakdown": {
    "health": 2,
    "productivity": 2,
    "learning": 1
  }
}
```

### `GET /api/analytics/tasks`

Get task analytics.

### `GET /api/analytics/heatmap`

Get activity heatmap data (last 365 days).

**Response:**
```json
[
  { "date": "2024-01-01", "count": 3, "level": 2 },
  { "date": "2024-01-02", "count": 0, "level": 0 },
  ...
]
```

Levels: 0=none, 1=low (1-2), 2=medium (3-4), 3=high (5-6), 4=very high (7+)

### `GET /api/analytics/trends`

Get weekly trends for the last 12 weeks.

**Response:**
```json
[
  {
    "week": "2024-W01",
    "habits_completed": 28,
    "tasks_completed": 5,
    "routines_completed": 18
  },
  ...
]
```

---

## WebSocket

### `WS /ws/{client_id}`

Connect for real-time updates.

**Message format (server → client):**
```json
{
  "type": "habit_updated",
  "data": { "habit_id": "uuid", "streak": 6 }
}
```

**Event types:**
- `habit_check_in` — a habit was checked in
- `task_status_changed` — a task status was updated
- `routine_completed` — a routine was completed
- `analytics_updated` — analytics data was refreshed

---

## Error Responses

All errors return:

```json
{
  "detail": "Error message describing what went wrong"
}
```

| Status Code | Description               |
|-------------|---------------------------|
| 400         | Bad Request               |
| 404         | Resource Not Found        |
| 409         | Conflict (e.g., already checked in today) |
| 422         | Validation Error          |
| 500         | Internal Server Error     |
