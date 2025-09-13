require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const config = require('./config');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true
}));
app.use(express.json());

// Initialize MySQL database connection pool
const pool = mysql.createPool(config);

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database');
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

// Test connection on startup
testConnection();

// Routes

// Save user data and skin analysis
app.post('/api/users', async (req, res) => {
  const { name, skinType, characteristics } = req.body;
  
  if (!name || !skinType || !characteristics) {
    return res.status(400).json({ error: 'Name, skin type, and characteristics are required' });
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO users (name, skin_type, characteristics) VALUES (?, ?, ?)',
      [name, skinType, JSON.stringify(characteristics)]
    );
    
    res.json({ 
      success: true, 
      userId: result.insertId,
      message: 'User data saved successfully' 
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to save user data' });
  }
});

// Get skin type statistics
app.get('/api/statistics', async (req, res) => {
  try {
    const query = `
      SELECT 
        skin_type,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM users), 2) as percentage
      FROM users 
      GROUP BY skin_type
      ORDER BY count DESC
    `;

    const [rows] = await pool.execute(query);

    // Get total count
    const [totalResult] = await pool.execute('SELECT COUNT(*) as total FROM users');
    const total = totalResult[0].total;

    res.json({
      statistics: rows,
      total: total
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get all users (optional, for debugging)
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, skin_type, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database: ${config.database} on ${config.host}:${config.port}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  try {
    await pool.end();
    console.log('Database connection pool closed.');
  } catch (err) {
    console.error('Error closing database pool:', err);
  }
  process.exit(0);
});
