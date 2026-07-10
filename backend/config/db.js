const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');

let sequelize;

const connectDB = async () => {
  // Support both standard env names (including DB_PASSWORD as requested) and Railway default names
  const host = process.env.DB_HOST || process.env.MYSQLHOST || 'reseau.proxy.rlwy.net';
  const port = process.env.DB_PORT || process.env.MYSQLPORT || 56423;
  const user = process.env.DB_USER || process.env.MYSQLUSER || 'root';
  const password = process.env.DB_PASSWORD || process.env.DB_PASS || process.env.MYSQLPASSWORD || 'seUgXyMzrUOcobgnnAPTBLzsKfipGcTa';
  const database = process.env.DB_NAME || process.env.MYSQLDATABASE || 'nammaservice';
  
  const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';

  console.log(`\n==================================================`);
  console.log(`🔌 Attempting MySQL Database Connection...`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 Host: ${host}:${port}`);
  console.log(`📂 Database: ${database}`);
  console.log(`👤 User: ${user}`);
  console.log('==================================================\n');

  // In production (Render or NODE_ENV=production), connect directly with Sequelize
  if (isProduction) {
    try {
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
        },
        dialectOptions: {
          connectTimeout: 10000
        }
      });

      await sequelize.authenticate();
      console.log(` MySQL Database Connected successfully to database: ${database}`);
      return;
    } catch (error) {
      console.error(` Production Database Connection Failed: ${error.message}`);
      process.exit(1);
    }
  }

  // Local development flow (attempts to auto-create local MySQL database if missing)
  try {
    const connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      connectTimeout: 5000
    });
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.end();

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
    console.log(`🎉 Local MySQL Connected successfully to database: ${database}`);
  } catch (error) {
    console.error(`❌ Local MySQL Database Connection Failed: ${error.message}`);
    process.exit(1); // Fail fast, SQLite is removed
  }
};

const getOfflineStatus = () => false;

module.exports = {
  connectDB,
  get sequelize() {
    return sequelize;
  },
  getOfflineStatus
};
