# Notification System Design

## Table of Contents

1. [Overview](#overview)
2. [Stage 1 — Priority Inbox (Backend)](#stage-1--priority-inbox-backend)
3. [Stage 2 — Frontend Application](#stage-2--frontend-application)
4. [API Architecture](#api-architecture)

---

## Overview

This project implements a **Campus Notifications Microservice** that fetches, prioritizes, and displays campus notifications. The system consists of three core components:

1. **Logging Middleware** — A reusable TypeScript package that sends structured log entries to the evaluation service API
2. **Backend Service** — An Express.js API server that fetches notifications, computes priority rankings, and manages read/unread state
3. **Frontend Application** — A Next.js app with Material UI that displays all notifications and a priority inbox view

### Architecture Diagram

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│   Frontend (Next.js)│────▶│  Backend (Express)   │────▶│  Evaluation Service │
│   localhost:3000    │     │  localhost:5000       │     │  20.207.122.201     │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
        │                          │                            │
        ├── All Notifications      ├── Token Management         ├── /auth
        ├── Priority Inbox         ├── Priority Algorithm       ├── /notifications
        └── Read/Unread State      ├── Read/Unread Tracking     └── /logs
            (localStorage)         └── Logging Middleware
```

---

## Stage 1 — Priority Inbox (Backend)

### Problem

Users receive a high volume of notifications and lose track of important ones. We need to efficiently surface the top N most important **unread** notifications.

### Priority Scoring Algorithm

Each notification receives a **composite priority score** based on two factors:

#### 1. Type Weight

Notifications are weighted by importance:

| Type | Weight | Rationale |
|------|--------|-----------|
| Placement | 3 | Career-critical — time-sensitive hiring opportunities |
| Result | 2 | Academic results — important but not urgent |
| Event | 1 | General events — good to know but lowest urgency |

#### 2. Recency Score

Newer notifications score higher. The timestamp is converted to Unix seconds, giving a natural recency bias — more recent notifications have larger timestamp values.

#### Composite Formula

```
priorityScore = typeWeight × WEIGHT_FACTOR + unixTimestamp × RECENCY_FACTOR
```

Where:
- `WEIGHT_FACTOR = 1000` — Amplifies type weight to ensure it dominates over recency
- `RECENCY_FACTOR = 1` — Uses raw timestamp seconds for tie-breaking within same type

This means a Placement notification will **always** rank above a Result notification from the same time period, but a very recent Result may rank above an older Placement.

### Data Structure — Min-Heap

We use a **Min-Heap of size N** to efficiently find the top N notifications:

```
Algorithm: Top-N Priority Selection using Min-Heap

1. Initialize empty min-heap with capacity N
2. For each notification in the dataset:
   a. If notification is read → skip (priority inbox only shows unread)
   b. If type filter is active and notification doesn't match → skip
   c. Calculate priority score
   d. If heap size < N → insert into heap
   e. Else if score > heap.peek().score → replace root and heapify
   f. Else → skip (lower priority than current top-N)
3. Extract sorted: heap elements sorted by priority (descending)
```

#### Complexity Analysis

| Operation | Time Complexity | Space Complexity |
|-----------|----------------|-----------------|
| Insert into heap | O(log N) | O(1) |
| Process all M notifications | O(M log N) | O(N) |
| Extract sorted result | O(N log N) | O(N) |
| **Total** | **O(M log N)** | **O(N)** |

Where M = total notifications, N = desired inbox size.

#### Why Min-Heap?

- **O(M log N)** is optimal for streaming/online top-N selection
- Only stores N elements in memory at any time
- New incoming notifications can be compared with `heap.peek()` in O(1) and inserted in O(log N) if they qualify
- No need to sort the entire dataset

#### Handling New Notifications

When a new notification arrives:

1. Calculate its priority score
2. If the heap has room (`size < N`), insert directly — O(log N)
3. If the heap is full, compare with the root (minimum):
   - If new score > root score → replace root and heapify down — O(log N)
   - Otherwise → discard (it wouldn't make the top N)

This allows **efficient incremental updates** without re-processing the entire dataset.

### Read/Unread Tracking

- Backend maintains an in-memory `Set<string>` of read notification IDs
- Frontend also persists read state in `localStorage` for cross-session persistence
- Read notifications are excluded from priority inbox computation

---

## Stage 2 — Frontend Application

### Architecture

The frontend is built with **Next.js (App Router)** and **Material UI**, following a component-based architecture:

```
notification_app_fe/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with theme + navbar
│   │   ├── page.tsx            # All Notifications page
│   │   └── priority/
│   │       └── page.tsx        # Priority Inbox page
│   ├── components/
│   │   ├── ThemeRegistry.tsx   # MUI dark theme configuration
│   │   ├── Navbar.tsx          # Navigation with responsive mobile menu
│   │   ├── NotificationCard.tsx # Individual notification display
│   │   ├── FilterBar.tsx       # Type filter chips
│   │   └── PrioritySelector.tsx # Top-N slider selector
│   ├── hooks/
│   │   └── useReadStatus.ts    # Read/unread state (localStorage)
│   └── api/
│       └── notifications.ts    # Backend API client
```

### Pages

#### 1. All Notifications (`/`)

- Displays paginated list of all notifications
- Filter by type (Placement / Result / Event)
- Visual distinction between read (dimmed) and unread (highlighted) notifications
- Staggered fade-in animations for smooth UX
- Skeleton loading states during data fetch

#### 2. Priority Inbox (`/priority`)

- Configurable N-value via interactive slider (5, 10, 15, 20)
- Type filtering support
- Ranked display with numbered badges (top 3 highlighted)
- Priority score displayed on each card
- Scoring explanation banner
- Read marking removes notification from priority list in real-time

### State Management

- **Read/Unread State**: Managed via `useReadStatus` custom hook using `localStorage`
  - Persists across browser sessions
  - Graceful fallback if localStorage is unavailable
- **UI State**: React `useState` for filters, pagination, loading, and errors
- **No external state library needed** — the app is simple enough for local state

### Responsive Design

- **Desktop**: Full-width cards with side-by-side layout elements
- **Mobile**: Condensed navbar with hamburger menu, stacked layout, smaller chips
- Built using MUI's `useMediaQuery` and responsive breakpoints

### Design System

- **Dark mode** with deep purple (#7C4DFF) and cyan (#00E5FF) accents
- **Glassmorphism** on navbar (backdrop blur + semi-transparent background)
- **Inter font** from Google Fonts
- **Micro-animations**: Card hover lift, unread pulse dot, staggered fade-in, chip transitions

---

## API Architecture

### Backend Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | All notifications (paginated, filterable) |
| GET | `/api/notifications/priority?n=10&type=Placement` | Top N priority unread notifications |
| POST | `/api/notifications/:id/read` | Mark single notification as read |
| POST | `/api/notifications/read-bulk` | Mark multiple notifications as read |
| GET | `/api/health` | Health check endpoint |

### Logging Strategy

The logging middleware is integrated throughout both backend and frontend:

- **Backend**: Logs on every request (middleware), auth token refresh, notification fetch, priority computation, errors
- **Frontend**: Uses the logging middleware via API calls

All logs follow the format: `Log(stack, level, package, message)` with strict validation of allowed values.
