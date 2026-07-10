require('dotenv').config();
const db = require('../config/db');

const cleanupIndexes = async () => {
  try {
    // 1. Establish database connection
    await db.connectDB();
    console.log("🔌 Connected to database for index cleanup...");

    // Get reference to the active sequelize instance
    const sequelizeInstance = db.sequelize;
    if (!sequelizeInstance) {
      throw new Error("Sequelize instance is not initialized.");
    }

    // 2. Execute SHOW INDEX FROM Users
    const [results] = await sequelizeInstance.query("SHOW INDEX FROM Users;");
    console.log("\n🔍 Current Indexes on Users Table:");
    console.table(results.map(r => ({
      Table: r.Table,
      Non_unique: r.Non_unique,
      Key_name: r.Key_name,
      Seq_in_index: r.Seq_in_index,
      Column_name: r.Column_name
    })));

    // 3. Find unique indexes on the 'email' column (Non_unique === 0 or Non_unique === '0' depending on dialect/driver)
    const emailIndexes = results.filter(r => r.Column_name === 'email' && r.Key_name !== 'PRIMARY');
    
    // Remove duplicate key names to avoid trying to drop the same index multiple times if it spans multiple columns (though email is single)
    const uniqueEmailKeyNames = [...new Set(emailIndexes.map(r => r.Key_name))];

    if (uniqueEmailKeyNames.length <= 1) {
      console.log("✅ No duplicate indexes found on email column. Table is healthy!");
      process.exit(0);
    }

    console.log(`\nFound ${uniqueEmailKeyNames.length} unique indexes on 'email'. Keeping the first one and dropping the remaining ${uniqueEmailKeyNames.length - 1}...`);
    
    const indexToKeep = uniqueEmailKeyNames[0];
    const indexesToDrop = uniqueEmailKeyNames.slice(1);

    console.log(`📌 Index to KEEP: ${indexToKeep}`);
    console.log(`🗑️ Indexes to DROP: ${indexesToDrop.join(', ')}`);

    // 4. Drop duplicate indexes
    for (const indexName of indexesToDrop) {
      console.log(`Executing: ALTER TABLE Users DROP INDEX \`${indexName}\`;`);
      await sequelizeInstance.query(`ALTER TABLE Users DROP INDEX \`${indexName}\`;`);
      console.log(`✅ Dropped index: ${indexName}`);
    }

    console.log("\n🎉 Index cleanup completed successfully!");
    
    // 5. Show final remaining indexes
    const [finalResults] = await sequelizeInstance.query("SHOW INDEX FROM Users;");
    console.log("\n🔍 Final Indexes on Users Table:");
    console.table(finalResults.map(r => ({
      Table: r.Table,
      Non_unique: r.Non_unique,
      Key_name: r.Key_name,
      Column_name: r.Column_name
    })));

    process.exit(0);
  } catch (error) {
    console.error("❌ Index cleanup failed:", error.message || error);
    process.exit(1);
  }
};

cleanupIndexes();
