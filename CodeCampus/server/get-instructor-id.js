// Quick script to get instructor ID by email
// Usage: node get-instructor-id.js <email>

const mongoose = require('mongoose');
require('dotenv').config();

const DB_CLUSTER_URL = process.env.DB_CLUSTER_URL || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.DB_NAME || 'tutortrek';

const instructorSchema = new mongoose.Schema({
  email: String,
  firstName: String,
  lastName: String
}, { collection: 'instructor' });

const Instructor = mongoose.model('Instructors', instructorSchema);

async function getInstructorId(email) {
  try {
    await mongoose.connect(`${DB_CLUSTER_URL}/${DB_NAME}`);
    console.log('Connected to MongoDB');

    const instructor = await Instructor.findOne({ email: email.toLowerCase() });

    if (instructor) {
      console.log(`✅ Instructor found:`);
      console.log(`   ID: ${instructor._id}`);
      console.log(`   Name: ${instructor.firstName} ${instructor.lastName}`);
      console.log(`   Email: ${instructor.email}`);
      console.log(`\n💡 Use this ID to add courses:`);
      console.log(`   node add-sample-courses.js ${instructor._id}`);
    } else {
      console.log(`❌ Instructor with email "${email}" not found.`);
      console.log(`\nAvailable instructors:`);
      const allInstructors = await Instructor.find({}, 'email firstName lastName');
      allInstructors.forEach(inst => {
        console.log(`   - ${inst.email} (${inst.firstName} ${inst.lastName})`);
      });
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
  console.log('Usage: node get-instructor-id.js <email>');
  console.log('Example: node get-instructor-id.js yadav@gmail.com');
  process.exit(1);
}

getInstructorId(email);

