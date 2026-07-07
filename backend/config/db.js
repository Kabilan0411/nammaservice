const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');

let sequelize;
let isOfflineMode = false;

const connectDB = async () => {
  const host = process.env.DB_HOST || '127.0.0.1';
  const port = process.env.DB_PORT || 3306;
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASS || '';
  const database = process.env.DB_NAME || 'nammaservice';

  // 1. Try MySQL (phpMyAdmin setup)
  try {
    // Attempt connection without selecting database first to create it if it doesn't exist
    const connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      connectTimeout: 2000
    });
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.end();

    // Now connect with Sequelize
    sequelize = new Sequelize(database, user, password, {
      host,
      port,
      dialect: 'mysql',
      logging: false, // Turn off logging SQL queries in console
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });

    await sequelize.authenticate();
    console.log(`MySQL Connected successfully to database: ${database}`);
    return;
  } catch (error) {
    console.warn(`MySQL connection failed: ${error.message}. Falling back to SQLite...`);
  }

  // 2. Fallback to SQLite (zero-config local file database)
  try {
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const sqlitePath = path.join(dataDir, 'db.sqlite');

    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: sqlitePath,
      logging: false
    });

    await sequelize.authenticate();
    isOfflineMode = true;
    console.log(`SQLite Fallback Connected successfully. Data saved to: ${sqlitePath}`);
  } catch (error) {
    console.error(`Database connection failed completely: ${error.message}`);
    process.exit(1);
  }
};

const getOfflineStatus = () => isOfflineMode;

module.exports = {
  connectDB,
  get sequelize() {
    return sequelize;
  },
  getOfflineStatus
};
