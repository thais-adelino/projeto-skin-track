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
  const { name, age, skinType, characteristics } = req.body;
  
  if (!name || !skinType || !characteristics) {
    return res.status(400).json({ error: 'Name, skin type, and characteristics are required' });
  }

  try {
    // Check if age column exists
    const [columns] = await pool.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME = 'age'
    `);

    let query, values;
    
    if (columns.length > 0 && age) {
      // Age column exists and age is provided
      if (typeof age !== 'number' || age < 13 || age > 80) {
        return res.status(400).json({ error: 'Age must be a number between 13 and 80' });
      }
      query = 'INSERT INTO users (name, age, skin_type, characteristics) VALUES (?, ?, ?, ?)';
      values = [name, age, skinType, JSON.stringify(characteristics)];
    } else {
      // Age column doesn't exist or age not provided, use old format
      query = 'INSERT INTO users (name, skin_type, characteristics) VALUES (?, ?, ?)';
      values = [name, skinType, JSON.stringify(characteristics)];
    }

    const [result] = await pool.execute(query, values);
    
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
    // Skin type statistics
    const skinTypeQuery = `
      SELECT 
        skin_type,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM users), 2) as percentage
      FROM users 
      GROUP BY skin_type
      ORDER BY count DESC
    `;

    const [skinTypeRows] = await pool.execute(skinTypeQuery);

    // Get total count
    const [totalResult] = await pool.execute('SELECT COUNT(*) as total FROM users');
    const total = totalResult[0].total;

    let ageGroupRows = [];
    let averageAge = null;

    // Check if age column exists before querying it
    try {
      const [columns] = await pool.execute(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'users' 
        AND COLUMN_NAME = 'age'
      `);

      if (columns.length > 0) {
        // Age group statistics (only if age column exists)
        const ageGroupQuery = `
          SELECT 
            CASE 
              WHEN age BETWEEN 13 AND 19 THEN '13-19'
              WHEN age BETWEEN 20 AND 29 THEN '20-29'
              WHEN age BETWEEN 30 AND 39 THEN '30-39'
              WHEN age BETWEEN 40 AND 49 THEN '40-49'
              WHEN age BETWEEN 50 AND 59 THEN '50-59'
              WHEN age >= 60 THEN '60+'
              ELSE 'Other'
            END as age_group,
            COUNT(*) as count,
            ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM users), 2) as percentage
          FROM users 
          GROUP BY age_group
          ORDER BY age_group
        `;

        [ageGroupRows] = await pool.execute(ageGroupQuery);

        // Get average age
        const [avgResult] = await pool.execute('SELECT ROUND(AVG(age), 1) as average_age FROM users');
        averageAge = avgResult[0].average_age;
      }
    } catch (ageError) {
      console.log('Age column not available, skipping age statistics');
    }

    res.json({
      skinTypeStatistics: skinTypeRows,
      ageGroupStatistics: ageGroupRows,
      total: total,
      averageAge: averageAge
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get all users (optional, for debugging)
app.get('/api/users', async (req, res) => {
  try {
    // Check if age column exists
    const [columns] = await pool.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME = 'age'
    `);

    let query;
    if (columns.length > 0) {
      query = 'SELECT id, name, age, skin_type, created_at FROM users ORDER BY created_at DESC';
    } else {
      query = 'SELECT id, name, skin_type, created_at FROM users ORDER BY created_at DESC';
    }

    const [rows] = await pool.execute(query);
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
