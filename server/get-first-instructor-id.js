// Script to get the first instructor ID from database
const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

const DB_CLUSTER_URL = process.env.DB_CLUSTER_URL || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.DB_NAME || 'tutortrek';

const instructorSchema = new mongoose.Schema({}, { collection: 'instructors', strict: false });
const Instructor = mongoose.model('Instructor', instructorSchema);

async function getFirstInstructor() {
  try {
    await mongoose.connect(`${DB_CLUSTER_URL}/${DB_NAME}`);
    const instructor = await Instructor.findOne({ isVerified: true });
    
    if (instructor) {
      console.log(`✅ Found instructor: ${instructor.firstName} ${instructor.lastName}`);
      console.log(`   ID: ${instructor._id}`);
      console.log(`   Email: ${instructor.email}`);
      console.log(`\n💡 Use this ID to enroll students:\n   node enroll-students-to-courses.js ${instructor._id}`);
      return instructor._id.toString();
    } else {
      console.log('❌ No verified instructor found');
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
    return null;
  } finally {
    await mongoose.disconnect();
  }
}

getFirstInstructor();

