const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');

let sequelize;
let isOfflineMode = false;

const connectDB = async () => {
  const host = process.env.DB_HOST || 'reseau.proxy.rlwy.net';
  const port = process.env.DB_PORT || 3306;
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASS || '';
  const database = process.env.DB_NAME || 'nammaservice';
  const isProduction = process.env.NODE_ENV === 'production';

  console.log(`\n==================================================`);
  console.log(`🔌 Attempting Database Connection...`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 Database Host: ${host}:${port}`);
  console.log(`📂 Database Name: ${database}`);
  console.log(`👤 Database User: ${user}`);
  console.log('==================================================\n');

  // In production, connect directly using Sequelize without attempting to CREATE DATABASE
  if (isProduction) {
    try {
      sequelize = new Sequelize(database, user, password, {
        host,
        port,
        dialect: 'mysql',
        logging: false, // Disable console query logs
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        },
        dialectOptions: {
          connectTimeout: 10000
        }
      });

      await sequelize.authenticate();
      console.log(`🎉 Production MySQL (Railway) Connected successfully to database: ${database}`);
      return;
    } catch (error) {
      console.error(`❌ Production Database Connection Failed: ${error.message}`);
      process.exit(1); // Do not fall back to SQLite in production, fail fast!
    }
  }

  // Local development fallback flow
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
      logging: false,
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
    console.warn(`MySQL local connection failed: ${error.message}. Falling back to SQLite...`);
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
