const db = require('../config/db');

async function run() {
  await db.connectDB();
  const { User, Professional } = require('../models');
  
  const professionals = await Professional.findAll({
    include: [{ model: User, as: 'user' }]
  });

  console.log(`Found ${professionals.length} professionals in database:`);
  professionals.forEach(p => {
    console.log(`- ID: ${p.id}, Title: ${p.title}, User associated: ${p.user ? p.user.name : 'NONE'}, email: ${p.user ? p.user.email : 'NONE'}`);
  });

  process.exit(0);
}

run().catch(err => {
  console.error('Failed to query professionals:', err);
  process.exit(1);
});
