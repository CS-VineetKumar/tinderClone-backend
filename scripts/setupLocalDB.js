#!/usr/bin/env node

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupLocalDatabase() {
  console.log('🏗️  Setting up local MySQL database...');
  
  let connection;
  
  try {
    // Connect to MySQL server (without specifying database)
    connection = await mysql.createConnection({
      host: process.env.LOCAL_MYSQL_HOST || 'localhost',
      user: process.env.LOCAL_MYSQL_USER || 'root',
      password: process.env.LOCAL_MYSQL_PASSWORD || '',
    });
    
    console.log('✅ Connected to MySQL server');
    
    // Read and execute the SQL setup script
    const sqlScriptPath = path.join(__dirname, 'setupLocalDatabase.sql');
    const sqlScript = fs.readFileSync(sqlScriptPath, 'utf8');
    
    // Split the script into individual statements
    const statements = sqlScript
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log('📝 Executing database setup script...');
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await connection.execute(statement);
        } catch (error) {
          // Ignore errors for statements that might already exist
          if (!error.message.includes('already exists') && !error.message.includes('Duplicate entry')) {
            console.warn(`⚠️  Warning: ${error.message}`);
          }
        }
      }
    }
    
    console.log('✅ Local database setup completed successfully!');
    console.log('📊 Database: tinderClone_local');
    console.log('🏠 Host: localhost');
    console.log('👤 User: ' + (process.env.LOCAL_MYSQL_USER || 'root'));
    
  } catch (error) {
    console.error('❌ Error setting up local database:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure MySQL is installed and running');
    console.log('2. Check your LOCAL_MYSQL_* environment variables');
    console.log('3. Ensure MySQL user has CREATE DATABASE privileges');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the setup if this script is executed directly
if (require.main === module) {
  setupLocalDatabase();
}

module.exports = { setupLocalDatabase }; 