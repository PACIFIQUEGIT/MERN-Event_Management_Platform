require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User'); // adjust path if needed

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/eventmanager';

async function seedAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const adminEmail = 'admin@example.com';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('⚠️ Admin already exists.');
      return process.exit(0);
    }

    const adminUser = new User({
      name: 'Admin User',
      email: adminEmail,
      password: 'admin123', // will be hashed by pre-save hook
      isAdmin: true,
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully');
  } catch (err) {
    console.error('❌ Failed to seed admin user:', err);
  } finally {
    mongoose.connection.close();
  }
}

seedAdmin();
