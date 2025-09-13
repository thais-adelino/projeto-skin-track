#!/usr/bin/env node

const mysql = require('mysql2/promise');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupMySQL() {
  console.log('🚀 MySQL Database Setup for Skin Track App\n');
  
  try {
    // Get database configuration from user
    const host = await question('MySQL host (default: localhost): ') || 'localhost';
    const port = await question('MySQL port (default: 3306): ') || '3306';
    const user = await question('MySQL username (default: root): ') || 'root';
    const password = await question('MySQL password: ');
    const database = await question('Database name (default: skin_track_db): ') || 'skin_track_db';
    
    console.log('\n📡 Testing connection...');
    
    // Test connection
    const connection = await mysql.createConnection({
      host,
      port: parseInt(port),
      user,
      password
    });
    
    console.log('✅ Connected to MySQL server');
    
    // Create database
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
    console.log(`✅ Database '${database}' created or already exists`);
    
    await connection.end();
    
    // Create new connection to the specific database
    const dbConnection = await mysql.createConnection({
      host,
      port: parseInt(port),
      user,
      password,
      database
    });
    
    // Create users table
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        skin_type VARCHAR(50) NOT NULL,
        characteristics TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;
    
    await dbConnection.execute(createUsersTable);
    console.log('✅ Users table created successfully');
    
    await dbConnection.end();
    
    // Create .env file
    const envContent = `# MySQL Database Configuration
DB_HOST=${host}
DB_PORT=${port}
DB_USER=${user}
DB_PASSWORD=${password}
DB_NAME=${database}

# Server Configuration
PORT=3001
NODE_ENV=development
`;
    
    const fs = require('fs');
    fs.writeFileSync('.env', envContent);
    console.log('✅ Environment file (.env) created');
    
    console.log('\n🎉 Setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Install dependencies: npm install');
    console.log('2. Start the server: npm run dev');
    console.log('3. Test the API: curl http://localhost:3001/api/health');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupMySQL();
}

module.exports = setupMySQL;
