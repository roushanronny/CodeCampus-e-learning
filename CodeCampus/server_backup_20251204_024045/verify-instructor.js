// Quick script to verify an instructor account for testing
// Usage: node verify-instructor.js <email>

const mongoose = require('mongoose');
require('dotenv').config();

const DB_CLUSTER_URL = process.env.DB_CLUSTER_URL || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.DB_NAME || 'tutortrek';

const instructorSchema = new mongoose.Schema({
  email: String,
  isVerified: Boolean
}, { collection: 'instructor' });

const Instructor = mongoose.model('Instructors', instructorSchema);

async function verifyInstructor(email) {
  try {
    await mongoose.connect(`${DB_CLUSTER_URL}/${DB_NAME}`);
    console.log('Connected to MongoDB');

    const result = await Instructor.findOneAndUpdate(
      { email: email.toLowerCase() },
      { isVerified: true },
      { new: true }
    );

    if (result) {
      console.log(`✅ Instructor "${email}" has been verified successfully!`);
      console.log(`   Name: ${result.firstName} ${result.lastName}`);
    } else {
      console.log(`❌ Instructor with email "${email}" not found.`);
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

const email = process.argv[2];
if (!email) {
  console.log('Usage: node verify-instructor.js <email>');
  console.log('Example: node verify-instructor.js yadav@gmail.com');
  process.exit(1);
}

verifyInstructor(email);

