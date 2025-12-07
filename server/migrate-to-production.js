// Script to migrate local data to production MongoDB Atlas
// Usage: node migrate-to-production.js

const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

// Local MongoDB
const LOCAL_DB_URL = process.env.DB_CLUSTER_URL || 'mongodb://127.0.0.1:27017';

// Production MongoDB (update this with your actual connection string)
const PROD_DB_URL = process.env.PROD_DB_CLUSTER_URL || 'mongodb+srv://roushanydv2003_db_user:Qtyj79zS0eKsnnGK@cluster0.wocqkj8.mongodb.net/codecampus';
const PROD_DB_NAME = 'codecampus';

// Schemas
const studentSchema = new mongoose.Schema({}, { collection: 'students', strict: false });
const courseSchema = new mongoose.Schema({}, { collection: 'course', strict: false });
const instructorSchema = new mongoose.Schema({}, { collection: 'instructor', strict: false });

async function detectLocalDatabase() {
  // Try tutortrek first (old name - likely has data)
  try {
    const testConn = await mongoose.createConnection(`${LOCAL_DB_URL}/tutortrek`);
    const students = await testConn.db.collection('students').countDocuments();
    const courses = await testConn.db.collection('course').countDocuments();
    const instructors = await testConn.db.collection('instructor').countDocuments();
    await testConn.close();
    const total = students + courses + instructors;
    if (total > 0) {
      console.log(`📦 Detected local database: tutortrek (${students} students, ${courses} courses, ${instructors} instructors)\n`);
      return 'tutortrek';
    }
  } catch (e) {
    console.log('⚠️  Could not check tutortrek:', e.message);
  }
  
  // Try codecampus
  try {
    const testConn = await mongoose.createConnection(`${LOCAL_DB_URL}/codecampus`);
    const students = await testConn.db.collection('students').countDocuments();
    const courses = await testConn.db.collection('course').countDocuments();
    const instructors = await testConn.db.collection('instructor').countDocuments();
    await testConn.close();
    const total = students + courses + instructors;
    if (total > 0) {
      console.log(`📦 Detected local database: codecampus (${students} students, ${courses} courses, ${instructors} instructors)\n`);
      return 'codecampus';
    }
  } catch (e) {
    console.log('⚠️  Could not check codecampus:', e.message);
  }
  
  // Default to tutortrek (most likely to have data)
  console.log('📦 Using default database: tutortrek\n');
  return 'tutortrek';
}

async function migrateData() {
  let localConn, prodConn;
  
  try {
    console.log('🔄 Starting data migration...\n');
    
    // Detect local database name
    const actualLocalDbName = await detectLocalDatabase();
    
    // Connect to local MongoDB
    console.log('📡 Connecting to local MongoDB...');
    localConn = await mongoose.createConnection(`${LOCAL_DB_URL}/${actualLocalDbName}`);
    console.log('✅ Connected to local MongoDB\n');
    
    // Connect to production MongoDB
    console.log('📡 Connecting to production MongoDB Atlas...');
    prodConn = await mongoose.createConnection(PROD_DB_URL);
    console.log('✅ Connected to production MongoDB\n');
    
    const LocalStudent = localConn.model('Student', studentSchema);
    const LocalCourse = localConn.model('Course', courseSchema);
    const LocalInstructor = localConn.model('Instructor', instructorSchema);
    
    const ProdStudent = prodConn.model('Student', studentSchema);
    const ProdCourse = prodConn.model('Course', courseSchema);
    const ProdInstructor = prodConn.model('Instructor', instructorSchema);
    
    // Migrate Students
    console.log('👥 Migrating students...');
    const students = await LocalStudent.find({});
    console.log(`   Found ${students.length} students in local database`);
    
    let studentsAdded = 0;
    let studentsSkipped = 0;
    
    for (const student of students) {
      try {
        const studentData = student.toObject();
        delete studentData._id; // Remove _id to allow MongoDB to generate new one
        
        // Check if student already exists (by email)
        const existing = await ProdStudent.findOne({ email: studentData.email });
        if (existing) {
          studentsSkipped++;
          continue;
        }
        
        await ProdStudent.create(studentData);
        studentsAdded++;
        console.log(`   ✅ Added: ${studentData.firstName} ${studentData.lastName} (${studentData.email})`);
      } catch (error) {
        if (error.code === 11000) {
          studentsSkipped++;
        } else {
          console.error(`   ❌ Error adding student ${student.email}:`, error.message);
        }
      }
    }
    
    console.log(`   ✨ Students: ${studentsAdded} added, ${studentsSkipped} skipped\n`);
    
    // Migrate Instructors
    console.log('👨‍🏫 Migrating instructors...');
    const instructors = await LocalInstructor.find({});
    console.log(`   Found ${instructors.length} instructors in local database`);
    
    let instructorsAdded = 0;
    let instructorsSkipped = 0;
    const instructorIdMap = new Map(); // Map old IDs to new IDs
    
    for (const instructor of instructors) {
      try {
        const instructorData = instructor.toObject();
        const oldId = instructorData._id.toString();
        delete instructorData._id;
        
        // Check if instructor already exists (by email)
        const existing = await ProdInstructor.findOne({ email: instructorData.email });
        if (existing) {
          instructorIdMap.set(oldId, existing._id.toString());
          instructorsSkipped++;
          continue;
        }
        
        const newInstructor = await ProdInstructor.create(instructorData);
        instructorIdMap.set(oldId, newInstructor._id.toString());
        instructorsAdded++;
        console.log(`   ✅ Added: ${instructorData.firstName} ${instructorData.lastName} (${instructorData.email})`);
      } catch (error) {
        if (error.code === 11000) {
          instructorsSkipped++;
        } else {
          console.error(`   ❌ Error adding instructor ${instructor.email}:`, error.message);
        }
      }
    }
    
    console.log(`   ✨ Instructors: ${instructorsAdded} added, ${instructorsSkipped} skipped\n`);
    
    // Migrate Courses
    console.log('📚 Migrating courses...');
    const courses = await LocalCourse.find({});
    console.log(`   Found ${courses.length} courses in local database`);
    
    let coursesAdded = 0;
    let coursesSkipped = 0;
    const courseIdMap = new Map(); // Map old course IDs to new IDs
    
    for (const course of courses) {
      try {
        const courseData = course.toObject();
        const oldId = courseData._id.toString();
        const oldInstructorId = courseData.instructorId?.toString();
        
        // Map instructor ID
        if (oldInstructorId && instructorIdMap.has(oldInstructorId)) {
          courseData.instructorId = new mongoose.Types.ObjectId(instructorIdMap.get(oldInstructorId));
        } else if (oldInstructorId) {
          // Instructor not migrated, skip this course
          console.log(`   ⏩ Skipped course "${courseData.title}" (instructor not found)`);
          coursesSkipped++;
          continue;
        }
        
        // Check if course already exists
        const existing = await ProdCourse.findOne({ 
          title: courseData.title,
          instructorId: courseData.instructorId 
        });
        if (existing) {
          courseIdMap.set(oldId, existing._id.toString());
          coursesSkipped++;
          continue;
        }
        
        // Map enrolled students
        if (courseData.coursesEnrolled && Array.isArray(courseData.coursesEnrolled)) {
          // We'll update enrollments separately
          courseData.coursesEnrolled = [];
        }
        
        delete courseData._id;
        const newCourse = await ProdCourse.create(courseData);
        courseIdMap.set(oldId, newCourse._id.toString());
        coursesAdded++;
        console.log(`   ✅ Added: "${courseData.title}"`);
      } catch (error) {
        if (error.code === 11000) {
          coursesSkipped++;
        } else {
          console.error(`   ❌ Error adding course "${course.title}":`, error.message);
        }
      }
    }
    
    console.log(`   ✨ Courses: ${coursesAdded} added, ${coursesSkipped} skipped\n`);
    
    // Migrate Enrollments
    console.log('🎓 Migrating enrollments...');
    let enrollmentsAdded = 0;
    
    for (const course of courses) {
      try {
        const oldCourseId = course._id.toString();
        const newCourseId = courseIdMap.get(oldCourseId);
        
        if (!newCourseId) continue;
        
        const oldEnrollments = course.coursesEnrolled || [];
        if (oldEnrollments.length === 0) continue;
        
        // Get all students from production to map IDs
        const prodStudents = await ProdStudent.find({}, '_id email');
        const studentEmailMap = new Map();
        prodStudents.forEach(s => studentEmailMap.set(s.email, s._id.toString()));
        
        // Get local students to map enrollments
        const localEnrolledStudents = await LocalStudent.find({
          _id: { $in: oldEnrollments }
        });
        
        const newEnrollmentIds = [];
        for (const localStudent of localEnrolledStudents) {
          const prodStudentId = studentEmailMap.get(localStudent.email);
          if (prodStudentId) {
            newEnrollmentIds.push(new mongoose.Types.ObjectId(prodStudentId));
          }
        }
        
        if (newEnrollmentIds.length > 0) {
          await ProdCourse.updateOne(
            { _id: new mongoose.Types.ObjectId(newCourseId) },
            { 
              $set: { coursesEnrolled: newEnrollmentIds },
              $inc: { enrollmentCount: newEnrollmentIds.length }
            }
          );
          enrollmentsAdded += newEnrollmentIds.length;
          console.log(`   ✅ Enrolled ${newEnrollmentIds.length} students in "${course.title}"`);
        }
      } catch (error) {
        console.error(`   ❌ Error migrating enrollments for course "${course.title}":`, error.message);
      }
    }
    
    console.log(`   ✨ Total enrollments migrated: ${enrollmentsAdded}\n`);
    
    // Summary
    console.log('🎉 Migration Complete!\n');
    console.log('📊 Summary:');
    console.log(`   Students: ${studentsAdded} added, ${studentsSkipped} skipped`);
    console.log(`   Instructors: ${instructorsAdded} added, ${instructorsSkipped} skipped`);
    console.log(`   Courses: ${coursesAdded} added, ${coursesSkipped} skipped`);
    console.log(`   Enrollments: ${enrollmentsAdded} migrated\n`);
    
  } catch (error) {
    console.error('❌ Migration error:', error);
  } finally {
    if (localConn) await localConn.close();
    if (prodConn) await prodConn.close();
    console.log('🔌 Disconnected from databases');
    process.exit(0);
  }
}

// Run migration
migrateData();

