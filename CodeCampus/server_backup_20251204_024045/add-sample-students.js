// Script to add 50+ sample students to MongoDB
// Usage: node add-sample-students.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: './.env' });

const DB_CLUSTER_URL = process.env.DB_CLUSTER_URL || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.DB_NAME || 'tutortrek';

// Student Schema
const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  mobile: { type: String, trim: true },
  password: { type: String, minlength: 8 },
  interests: { type: [String], default: [] },
  profilePic: {
    name: String,
    key: String,
    url: String
  },
  dateJoined: { type: Date, default: Date.now },
  isGoogleUser: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  blockedReason: { type: String, default: '' }
});

const Student = mongoose.model('Students', studentSchema, 'students');

// Sample student data
const firstNames = [
  'Aarav', 'Aditi', 'Akshay', 'Ananya', 'Arjun', 'Avni', 'Dev', 'Diya', 'Ishaan', 'Kavya',
  'Krishna', 'Meera', 'Neha', 'Pranav', 'Priya', 'Rahul', 'Riya', 'Rohan', 'Saanvi', 'Samaira',
  'Siddharth', 'Sneha', 'Tanvi', 'Ved', 'Vihaan', 'Yash', 'Zara', 'Aanya', 'Advik', 'Anika',
  'Arnav', 'Arya', 'Dhruv', 'Ishita', 'Kabir', 'Mahi', 'Myra', 'Navya', 'Parth', 'Radha',
  'Reyansh', 'Rudra', 'Sara', 'Shivansh', 'Sia', 'Tara', 'Vansh', 'Vivaan', 'Yuvaan', 'Zain'
];

const lastNames = [
  'Sharma', 'Patel', 'Kumar', 'Singh', 'Gupta', 'Verma', 'Reddy', 'Mehta', 'Jain', 'Shah',
  'Agarwal', 'Malhotra', 'Kapoor', 'Chopra', 'Bansal', 'Garg', 'Arora', 'Saxena', 'Tiwari', 'Mishra',
  'Joshi', 'Nair', 'Iyer', 'Menon', 'Pillai', 'Rao', 'Narayan', 'Krishnan', 'Raman', 'Subramanian',
  'Desai', 'Shah', 'Bhatt', 'Trivedi', 'Pandey', 'Dwivedi', 'Dubey', 'Yadav', 'Kumar', 'Das'
];

const interestsOptions = [
  ['Web Development', 'JavaScript', 'React'],
  ['Data Science', 'Python', 'Machine Learning'],
  ['Mobile Development', 'React Native', 'Flutter'],
  ['Backend Development', 'Node.js', 'MongoDB'],
  ['Frontend Development', 'HTML', 'CSS', 'JavaScript'],
  ['Full Stack', 'MERN Stack', 'Web Development'],
  ['Cloud Computing', 'AWS', 'DevOps'],
  ['Cybersecurity', 'Ethical Hacking', 'Network Security'],
  ['UI/UX Design', 'Figma', 'Design Thinking'],
  ['Game Development', 'Unity', 'C#'],
  ['Blockchain', 'Solidity', 'Web3'],
  ['Artificial Intelligence', 'Deep Learning', 'Neural Networks'],
  ['Database Management', 'SQL', 'NoSQL'],
  ['Software Engineering', 'System Design', 'Algorithms'],
  ['Programming', 'Java', 'Python']
];

// Generate random phone number
const generatePhone = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

// Generate email from name
const generateEmail = (firstName, lastName, index) => {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'student.edu'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@${domain}`;
};

// Hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Create sample students
const createSampleStudents = async () => {
  const students = [];
  const defaultPassword = 'Student@123'; // Default password for all students
  const hashedPassword = await hashPassword(defaultPassword);

  for (let i = 0; i < 50; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const email = generateEmail(firstName, lastName, i);
    const interests = interestsOptions[Math.floor(Math.random() * interestsOptions.length)];
    
    // Some students will be Google users (no password required)
    const isGoogleUser = Math.random() < 0.2; // 20% Google users
    
    const student = {
      firstName,
      lastName,
      email,
      mobile: isGoogleUser ? undefined : generatePhone(),
      password: isGoogleUser ? undefined : hashedPassword,
      interests,
      isGoogleUser,
      dateJoined: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Random date within last year
      profilePic: {
        name: 'default-profile.jpg',
        key: `profile_${i}`,
        url: 'https://via.placeholder.com/150'
      }
    };
    
    students.push(student);
  }

  return students;
};

// Main function
async function addSampleStudents() {
  try {
    await mongoose.connect(`${DB_CLUSTER_URL}/${DB_NAME}`);
    console.log('✅ Connected to MongoDB');

    const sampleStudents = await createSampleStudents();
    let addedCount = 0;
    let skippedCount = 0;

    for (const studentData of sampleStudents) {
      try {
        // Check if student already exists
        const existingStudent = await Student.findOne({ email: studentData.email });
        if (existingStudent) {
          console.log(`⏩ Skipped: "${studentData.email}" (already exists)`);
          skippedCount++;
          continue;
        }

        const newStudent = new Student(studentData);
        await newStudent.save();
        console.log(`✅ Added: ${studentData.firstName} ${studentData.lastName} (${studentData.email})`);
        addedCount++;
      } catch (error) {
        if (error.code === 11000) {
          // Duplicate key error
          console.log(`⏩ Skipped: "${studentData.email}" (duplicate)`);
          skippedCount++;
        } else {
          console.error(`❌ Error adding ${studentData.email}:`, error.message);
        }
      }
    }

    console.log(`\n✨ Summary:`);
    console.log(`   Added: ${addedCount} students`);
    console.log(`   Skipped: ${skippedCount} students (already exist)`);
    console.log(`   Total: ${addedCount + skippedCount} students processed`);
    console.log(`\n💡 Default password for all students: Student@123`);
    console.log(`   (Google users don't have passwords)`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the script
addSampleStudents();

