# Features Guide

Complete documentation of all features in the Dashboard App.

---

## 1. Routine Management

### Overview
Routines are time-based activities that you do regularly throughout the day. The app supports scheduling routines by time of day (morning, afternoon, evening, night) and tracks completion history.

### Features
- **Create routines** with name, description, time of day, and duration
- **Schedule by days** — set which days of the week the routine applies
- **Mark complete** — one-tap completion for today
- **View by time of day** — routines are grouped into Morning, Afternoon, Evening, Night
- **Completion tracking** — see how consistently you complete each routine
- **History** — routine completion logs stored with timestamps

### Time of Day Options
- 🌅 **Morning** — Start your day right
- ☀️ **Afternoon** — Midday activities
- 🌆 **Evening** — Wind down
- 🌙 **Night** — Bedtime routines

---

## 2. Habit Tracking

### Overview
Habits are behaviors you want to build consistently over time. The app tracks streaks, completion rates, and provides visual feedback to keep you motivated.

### Features
- **Habit creation** with category, color, and frequency
- **Daily check-in** — mark a habit done for today
- **Streak calculation** — real-time current and longest streak
- **Completion rates** — 7-day and 30-day completion percentages
- **Categories** — organize by: Health, Productivity, Learning, Personal, Other
- **History** — all check-ins stored with optional notes

### Categories & Colors
| Category     | Color          |
|--------------|----------------|
| Health       | 🟢 Green        |
| Productivity | 🔵 Blue         |
| Learning     | 🟣 Purple       |
| Personal     | 🟡 Yellow       |
| Other        | ⚫ Gray         |

### Streak Rules
- Streak increments when you complete a habit on consecutive days
- Missing a day resets the current streak (longest streak is preserved)
- Streak updates in real-time after check-in

---

## 3. Work / Task Management

### Overview
A full task management system with priorities, statuses, categories, and deadline tracking. Tasks move through a kanban-style workflow.

### Features
- **Create tasks** with title, description, priority, deadline
- **Priority levels** — High 🔴, Medium 🟡, Low 🟢
- **Status workflow** — Todo → In Progress → Completed
- **Categories & Projects** — group related tasks
- **Deadline tracking** — overdue tasks are highlighted
- **Time estimation** — set estimated hours, log actual hours
- **Quick status update** — move tasks between statuses with one click
- **Task statistics** — completion rates, by priority, by category

### Task Statuses
- 📋 **Todo** — Not started yet
- 🔄 **In Progress** — Currently working on it
- ✅ **Completed** — Done!

### Priority Guide
- 🔴 **High** — Urgent, do today
- 🟡 **Medium** — Important, do this week
- 🟢 **Low** — Nice to have, do when possible

---

## 4. Analytics & Statistics

### Overview
A comprehensive analytics dashboard that turns your activity data into actionable insights.

### Dashboard Overview
- **Today's summary** — habits, tasks, and routines completed today
- **Weekly overview** — performance this week vs last week
- **Active streaks** — all current habit streaks at a glance
- **Quick metrics** — key KPIs in stat cards

### Charts & Visualizations

#### Habit Completion Trend (Line Chart)
- Shows daily habit completion count over the last 30 days
- Identify patterns, dips, and improvements

#### Activity Heatmap (GitHub-style)
- Visual grid showing activity intensity over the last year
- Each cell = one day, color intensity = activity level
- 4 levels: None → Low → Medium → High → Very High

#### Task Distribution (Pie Chart)
- Breakdown of tasks by status (Todo / In Progress / Completed)
- Also shows distribution by priority level

#### Weekly Activity (Bar Chart)
- Side-by-side bars for habits, tasks, and routines per week
- Last 12 weeks visible

### Metrics Explained
- **Completion Rate** — (completed / total scheduled) × 100
- **Current Streak** — consecutive days with at least one habit completed
- **Productivity Score** — weighted combination of task completion and habit consistency

---

## 5. Real-time Features

### Overview
The dashboard syncs live across all your devices and browser tabs using WebSockets and Supabase real-time subscriptions.

### Real-time Events
- **Habit checked in** — streak updates instantly across all tabs
- **Task status changed** — kanban board updates live
- **Routine completed** — progress indicators update
- **Analytics refresh** — charts update when new data arrives

### How It Works
1. Frontend connects to WebSocket at `ws://your-backend/ws/{session-id}`
2. Supabase real-time listens for database changes
3. Backend broadcasts events to connected clients
4. Frontend updates the relevant UI state without a page refresh

---

## 6. UI/UX Features

### Dark / Light Mode
- Toggle between dark and light themes with a single click
- Preference saved to localStorage
- Default: Dark mode

### Responsive Design
- Works on desktop, tablet, and mobile
- Sidebar collapses to icon-only on small screens
- Charts resize to fit the available width

### Quick Actions
From the dashboard, you can quickly:
- ✅ Check in a habit
- ➕ Add a new task
- 📋 View today's routines

### Color Coding
- Consistent color coding for priorities and categories throughout the app
- Custom habit colors let you personalize your tracking

---

## Customization

### Adding New Habit Categories
Edit `frontend/lib/utils/constants.ts`:
```ts
export const HABIT_CATEGORIES = [
  { value: 'health', label: 'Health', color: '#10B981' },
  // Add your custom category here
  { value: 'finance', label: 'Finance', color: '#F59E0B' },
];
```

### Adding New Task Categories
Edit the same constants file to add custom task categories and projects.

### Changing the Color Theme
The primary accent color is Indigo (`#6366F1`). To change it, update `tailwind.config.js` and the chart color configurations in the chart components.
