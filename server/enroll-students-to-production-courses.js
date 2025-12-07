// Script to enroll students in production instructor courses
// Usage: node enroll-students-to-production-courses.js <instructorEmail>

const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

// Production MongoDB
const PROD_DB_URL = process.env.PROD_DB_CLUSTER_URL || 'mongodb+srv://roushanydv2003_db_user:Qtyj79zS0eKsnnGK@cluster0.wocqkj8.mongodb.net/codecampus';

// Course Schema
const courseSchema = new mongoose.Schema({
  title: String,
  instructorId: mongoose.Schema.Types.ObjectId,
  coursesEnrolled: [mongoose.Schema.Types.ObjectId],
  enrollmentCount: Number
}, { collection: 'course', strict: false });

// Student Schema
const studentSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String
}, { collection: 'students', strict: false });

// Instructor Schema
const instructorSchema = new mongoose.Schema({
  email: String,
  firstName: String,
  lastName: String
}, { collection: 'instructor', strict: false });

const Course = mongoose.model('Course', courseSchema);
const Student = mongoose.model('Student', studentSchema);
const Instructor = mongoose.model('Instructor', instructorSchema);

async function enrollStudentsToCourses(instructorEmail) {
  try {
    await mongoose.connect(PROD_DB_URL);
    console.log('✅ Connected to production MongoDB\n');

    // Find instructor
    let instructor;
    if (instructorEmail) {
      instructor = await Instructor.findOne({ email: instructorEmail.toLowerCase() });
      if (!instructor) {
        console.log(`❌ Instructor with email "${instructorEmail}" not found`);
        console.log('\nAvailable instructors:');
        const allInstructors = await Instructor.find({}, 'email firstName lastName');
        allInstructors.forEach(inst => {
          console.log(`   - ${inst.email} (${inst.firstName || ''} ${inst.lastName || ''})`);
        });
        process.exit(1);
      }
    } else {
      // Get first instructor
      instructor = await Instructor.findOne();
      if (!instructor) {
        console.log('❌ No instructors found in database');
        process.exit(1);
      }
    }

    console.log(`✅ Found instructor: ${instructor.firstName || ''} ${instructor.lastName || ''} (${instructor.email})`);
    console.log(`   ID: ${instructor._id}\n`);

    // Get all courses for this instructor
    const courses = await Course.find({ instructorId: instructor._id });
    console.log(`📚 Found ${courses.length} courses for instructor\n`);

    if (courses.length === 0) {
      console.log('❌ No courses found for this instructor. Please add courses first.');
      process.exit(1);
    }

    // Get all students
    const students = await Student.find({});
    console.log(`👥 Found ${students.length} students\n`);

    if (students.length === 0) {
      console.log('❌ No students found. Please add students first.');
      process.exit(1);
    }

    let totalEnrollments = 0;
    let skippedEnrollments = 0;
    let coursesProcessed = 0;

    // Enroll students in courses
    for (const course of courses) {
      // Randomly enroll 5-25 students per course (or all if less than 25)
      const numEnrollments = Math.floor(Math.random() * 21) + 5; // 5 to 25 students
      const shuffledStudents = [...students].sort(() => 0.5 - Math.random());
      const studentsToEnroll = shuffledStudents.slice(0, Math.min(numEnrollments, students.length));

      let courseEnrollments = 0;

      for (const student of studentsToEnroll) {
        // Check if student is already enrolled
        const studentId = student._id.toString();
        const isAlreadyEnrolled = course.coursesEnrolled && course.coursesEnrolled.some(
          enrolledId => enrolledId && enrolledId.toString() === studentId
        );

        if (!isAlreadyEnrolled) {
          await Course.updateOne(
            { _id: course._id },
            { 
              $addToSet: { coursesEnrolled: student._id },
              $set: { 
                enrollmentCount: (course.enrollmentCount || 0) + 1 
              }
            }
          );
          totalEnrollments++;
          courseEnrollments++;
        } else {
          skippedEnrollments++;
        }
      }

      if (courseEnrollments > 0) {
        // Update enrollment count properly
        const updatedCourse = await Course.findById(course._id);
        await Course.updateOne(
          { _id: course._id },
          { $set: { enrollmentCount: updatedCourse.coursesEnrolled?.length || 0 } }
        );
        console.log(`   ✅ Enrolled ${courseEnrollments} students in "${course.title}"`);
      } else {
        console.log(`   ⏭️  Skipped "${course.title}" (all students already enrolled)`);
      }
      coursesProcessed++;
    }

    console.log(`\n✨ Summary:`);
    console.log(`   Total enrollments: ${totalEnrollments}`);
    console.log(`   Skipped (already enrolled): ${skippedEnrollments}`);
    console.log(`   Courses processed: ${coursesProcessed}`);
    console.log(`   Students available: ${students.length}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Get instructor email from command line (optional - will use first instructor if not provided)
const instructorEmail = process.argv[2];

enrollStudentsToCourses(instructorEmail);

