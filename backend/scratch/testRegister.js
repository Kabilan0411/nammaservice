const db = require('../config/db');

async function run() {
  await db.connectDB();
  const User = require('../models/User');
  await db.sequelize.sync();

  console.log('Testing User model hooks...');
  const testEmail = `test_${Date.now()}@example.com`;
  
  // 1. Create a user
  const user = await User.create({
    name: 'Test User',
    email: testEmail,
    password: 'password123'
  });
  console.log('User created:', user.toJSON());
  console.log('Hashed Password:', user.password);

  // 2. Try matchPassword
  const isMatch = await user.matchPassword('password123');
  console.log('Does password123 match?', isMatch);
  
  const isMatchWrong = await user.matchPassword('wrongpassword');
  console.log('Does wrongpassword match? (should be false):', isMatchWrong);

  // Clean up
  await user.destroy();
  console.log('Test completed successfully!');
  process.exit(0);
}

run().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
