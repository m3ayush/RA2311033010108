# Campus Notifications Microservice

A full-stack notification management system with priority inbox functionality, built with TypeScript.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16 + TypeScript + Material UI |
| **Backend** | Express.js + TypeScript |
| **Logging** | Custom reusable logging middleware |
| **State** | localStorage (read/unread persistence) |

## Project Structure

```
├── logging_middleware/        # Reusable logging package
├── notification_app_be/       # Backend API server
├── notification_app_fe/       # Frontend Next.js application
└── Notification_System_Design.md  # Architecture documentation
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm

### 1. Setup Environment

Create a `.env` file in the root directory:

```env
EMAIL=your-email
NAME=your-name
ROLL_NO=your-roll-no
ACCESS_CODE=your-access-code
CLIENT_ID=your-client-id
CLIENT_SECRET=your-client-secret
BASE_URL=http://20.207.122.201
```

### 2. Build Logging Middleware

```bash
cd logging_middleware
npm install
npm run build
```

### 3. Start Backend

```bash
cd notification_app_be
npm install
npm run dev
```

Backend runs on `http://localhost:5001`

### 4. Start Frontend

```bash
cd notification_app_fe
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

## Features

### All Notifications Page
- View all campus notifications
- Filter by type (Placement, Result, Event)
- Read/unread status tracking
- Pagination support

### Priority Inbox
- Top-N most important unread notifications
- Configurable N (5, 10, 15, 20)
- Priority scoring: Placement (3x) > Result (2x) > Event (1x) × recency
- Min-heap based algorithm for O(M log N) efficiency
- Filter by notification type

### Logging Middleware
- Reusable TypeScript package
- Automatic token management with caching
- Input validation for all log fields
- Integrated throughout backend and frontend

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | All notifications |
| GET | `/api/notifications/priority` | Priority inbox |
| POST | `/api/notifications/:id/read` | Mark as read |
| POST | `/api/notifications/read-bulk` | Bulk mark as read |
| GET | `/api/health` | Health check |