// Script to enroll students in instructor's courses
// Usage: node enroll-students-to-courses.js <instructorId>

const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

const DB_CLUSTER_URL = process.env.DB_CLUSTER_URL || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.DB_NAME || 'codecampus';

// Course Schema
const courseSchema = new mongoose.Schema({
  title: String,
  instructorId: mongoose.Schema.Types.ObjectId,
  coursesEnrolled: [mongoose.Schema.Types.ObjectId],
  enrollmentCount: Number
}, { collection: 'course' });

// Student Schema
const studentSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String
}, { collection: 'students' });

const Course = mongoose.model('Course', courseSchema);
const Student = mongoose.model('Student', studentSchema);

async function enrollStudentsToCourses(instructorId) {
  try {
    await mongoose.connect(`${DB_CLUSTER_URL}/${DB_NAME}`);
    console.log('✅ Connected to MongoDB');

    // If no instructor ID provided, find first instructor with courses
    let actualInstructorId = instructorId;
    if (!instructorId || instructorId === 'auto') {
      // Try different collection names
      const Instructor1 = mongoose.model('Instructor1', new mongoose.Schema({}, { collection: 'instructors', strict: false }));
      const Instructor2 = mongoose.model('Instructor2', new mongoose.Schema({}, { collection: 'instructor', strict: false }));
      
      let instructor = await Instructor1.findOne().catch(() => null);
      if (!instructor) {
        instructor = await Instructor2.findOne().catch(() => null);
      }
      
      if (instructor) {
        actualInstructorId = instructor._id.toString();
        console.log(`📝 Using instructor: ${instructor.firstName || 'Unknown'} ${instructor.lastName || ''} (${instructor.email || 'No email'})`);
      } else {
        // Try to get instructor ID from courses
        const courseWithInstructor = await Course.findOne({ instructorId: { $exists: true } });
        if (courseWithInstructor && courseWithInstructor.instructorId) {
          actualInstructorId = courseWithInstructor.instructorId.toString();
          console.log(`📝 Using instructor ID from courses: ${actualInstructorId}`);
        } else {
          console.log('❌ No instructor found. Please provide instructor ID:');
          console.log('   node enroll-students-to-courses.js <instructorId>');
          console.log('   Or create an instructor account and add courses first.');
          return;
        }
      }
    }

    // Get all courses for this instructor
    const courses = await Course.find({ instructorId: new mongoose.Types.ObjectId(actualInstructorId) });
    console.log(`📚 Found ${courses.length} courses for instructor`);

    if (courses.length === 0) {
      console.log('❌ No courses found for this instructor. Please add courses first.');
      return;
    }

    // Get all students
    const students = await Student.find({});
    console.log(`👥 Found ${students.length} students`);

    if (students.length === 0) {
      console.log('❌ No students found. Please add students first.');
      return;
    }

    let totalEnrollments = 0;
    let skippedEnrollments = 0;

    // Enroll students in courses
    for (const course of courses) {
      // Randomly enroll 5-15 students per course
      const numEnrollments = Math.floor(Math.random() * 11) + 5; // 5 to 15 students
      const shuffledStudents = students.sort(() => 0.5 - Math.random());
      const studentsToEnroll = shuffledStudents.slice(0, Math.min(numEnrollments, students.length));

      for (const student of studentsToEnroll) {
        // Check if student is already enrolled
        const studentId = student._id.toString();
        const isAlreadyEnrolled = course.coursesEnrolled.some(
          enrolledId => enrolledId.toString() === studentId
        );

        if (!isAlreadyEnrolled) {
          await Course.updateOne(
            { _id: course._id },
            { 
              $addToSet: { coursesEnrolled: student._id },
              $inc: { enrollmentCount: 1 }
            }
          );
          totalEnrollments++;
          console.log(`  ✅ Enrolled ${student.firstName} ${student.lastName} in "${course.title}"`);
        } else {
          skippedEnrollments++;
        }
      }
    }

    console.log(`\n✨ Summary:`);
    console.log(`   Total enrollments: ${totalEnrollments}`);
    console.log(`   Skipped (already enrolled): ${skippedEnrollments}`);
    console.log(`   Courses processed: ${courses.length}`);
    console.log(`   Students available: ${students.length}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Get instructor ID from command line (optional - will auto-detect if not provided)
const instructorId = process.argv[2] || 'auto';

enrollStudentsToCourses(instructorId);

