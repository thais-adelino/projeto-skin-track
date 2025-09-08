# AICA Cosméticos Backend

Node.js backend server for the AICA Cosméticos skin analysis app.

## Features

- **User Management**: Store user names and skin analysis results
- **Statistics API**: Get skin type distribution data
- **SQLite Database**: Lightweight, file-based database for data persistence

## Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

## API Endpoints

### POST /api/users
Save user data and skin analysis results.

**Request Body:**
```json
{
  "name": "Maria",
  "skinType": "oily",
  "characteristics": {
    "oily": 8,
    "combination": 2,
    "normal": 1,
    "dry": 0,
    "sensitive": 3
  }
}
```

**Response:**
```json
{
  "success": true,
  "userId": 1,
  "message": "User data saved successfully"
}
```

### GET /api/statistics
Get skin type distribution statistics.

**Response:**
```json
{
  "statistics": [
    {
      "skin_type": "oily",
      "count": 15,
      "percentage": 45.45
    },
    {
      "skin_type": "combination",
      "count": 10,
      "percentage": 30.30
    }
  ],
  "total": 33
}
```

### GET /api/users
Get all users (for debugging).

### GET /api/health
Health check endpoint.

## Database Schema

### users table
- `id`: INTEGER PRIMARY KEY AUTOINCREMENT
- `name`: TEXT NOT NULL
- `skin_type`: TEXT NOT NULL
- `characteristics`: TEXT NOT NULL (JSON string)
- `created_at`: DATETIME DEFAULT CURRENT_TIMESTAMP

## Development

- Use `npm run dev` for development with auto-restart
- Use `npm start` for production
- Database file is created automatically at `backend/database.sqlite`
