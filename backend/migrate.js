const mysql = require('mysql2/promise');
const config = require('./config');

async function createDatabase() {
  try {
    // Connect without specifying database to create it
    const connection = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password
    });

    console.log('Connected to MySQL server');

    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${config.database}\``);
    console.log(`Database '${config.database}' created or already exists`);

    // Use the database
    await connection.query(`USE \`${config.database}\``);

    // Create users table
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        age INT NOT NULL DEFAULT 25,
        skin_type VARCHAR(50) NOT NULL,
        characteristics TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await connection.execute(createUsersTable);
    console.log('Users table created successfully');

    // Add age column if it doesn't exist (for existing tables)
    try {
      await connection.execute(`
        ALTER TABLE users 
        ADD COLUMN age INT NOT NULL DEFAULT 25 
        AFTER name
      `);
      console.log('Age column added to users table');
    } catch (error) {
      // Column might already exist, which is fine
      if (!error.message.includes('Duplicate column name')) {
        console.log('Age column already exists or other error:', error.message);
      }
    }

    await connection.end();
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  createDatabase();
}

module.exports = createDatabase;
