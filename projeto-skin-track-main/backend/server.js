const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true
}));
app.use(express.json());

// Initialize SQLite database
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Create tables if they don't exist
db.serialize(() => {
  // Users table to store names and skin analysis results
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    skin_type TEXT NOT NULL,
    characteristics TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Routes

// Save user data and skin analysis
app.post('/api/users', (req, res) => {
  const { name, skinType, characteristics } = req.body;
  
  if (!name || !skinType || !characteristics) {
    return res.status(400).json({ error: 'Name, skin type, and characteristics are required' });
  }

  const stmt = db.prepare('INSERT INTO users (name, skin_type, characteristics) VALUES (?, ?, ?)');
  stmt.run(name, skinType, JSON.stringify(characteristics), function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to save user data' });
    }
    
    res.json({ 
      success: true, 
      userId: this.lastID,
      message: 'User data saved successfully' 
    });
  });
  stmt.finalize();
});

// Get skin type statistics
app.get('/api/statistics', (req, res) => {
  const query = `
    SELECT 
      skin_type,
      COUNT(*) as count,
      ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM users), 2) as percentage
    FROM users 
    GROUP BY skin_type
    ORDER BY count DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch statistics' });
    }

    // Get total count
    db.get('SELECT COUNT(*) as total FROM users', [], (err, totalRow) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch total count' });
      }

      res.json({
        statistics: rows,
        total: totalRow.total
      });
    });
  });
});

// Get all users (optional, for debugging)
app.get('/api/users', (req, res) => {
  db.all('SELECT id, name, skin_type, created_at FROM users ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
    res.json(rows);
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database path: ${dbPath}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});
