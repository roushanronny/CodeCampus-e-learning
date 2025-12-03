// Script to verify student enrollments
const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

const DB_CLUSTER_URL = process.env.DB_CLUSTER_URL || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.DB_NAME || 'tutortrek';

const courseSchema = new mongoose.Schema({
  title: String,
  instructorId: mongoose.Schema.Types.ObjectId,
  coursesEnrolled: [mongoose.Schema.Types.ObjectId],
  enrollmentCount: Number
}, { collection: 'course' });

const Course = mongoose.model('Course', courseSchema);

async function verifyEnrollments() {
  try {
    await mongoose.connect(`${DB_CLUSTER_URL}/${DB_NAME}`);
    console.log('✅ Connected to MongoDB');

    // Get first instructor's courses
    const course = await Course.findOne({ instructorId: { $exists: true } });
    if (!course) {
      console.log('❌ No courses found');
      return;
    }

    const instructorId = course.instructorId;
    console.log(`\n📚 Checking enrollments for instructor: ${instructorId}`);

    // Get all courses for this instructor
    const courses = await Course.find({ instructorId });
    console.log(`\n📊 Found ${courses.length} courses`);

    let totalEnrollments = 0;
    let uniqueStudents = new Set();

    for (const course of courses) {
      const enrolledCount = course.coursesEnrolled?.length || 0;
      const countField = course.enrollmentCount || 0;
      
      console.log(`\n📖 "${course.title}":`);
      console.log(`   coursesEnrolled array: ${enrolledCount} students`);
      console.log(`   enrollmentCount field: ${countField}`);
      
      if (enrolledCount !== countField) {
        console.log(`   ⚠️  Mismatch! Updating enrollmentCount...`);
        await Course.updateOne(
          { _id: course._id },
          { $set: { enrollmentCount: enrolledCount } }
        );
      }

      totalEnrollments += enrolledCount;
      course.coursesEnrolled?.forEach(id => uniqueStudents.add(id.toString()));
    }

    console.log(`\n✨ Summary:`);
    console.log(`   Total enrollments: ${totalEnrollments}`);
    console.log(`   Unique students: ${uniqueStudents.size}`);
    console.log(`   Courses: ${courses.length}`);

    // Test the aggregation query
    console.log(`\n🔍 Testing aggregation query...`);
    const students = await Course.aggregate([
      {
        $match: { instructorId: instructorId }
      },
      {
        $unwind: '$coursesEnrolled'
      },
      {
        $lookup: {
          from: 'students',
          localField: 'coursesEnrolled',
          foreignField: '_id',
          as: 'studentDetails'
        }
      },
      {
        $project: {
          student: { $arrayElemAt: ['$studentDetails', 0] },
          courseName: '$title'
        }
      },
      {
        $group: {
          _id: '$student._id',
          course: { $first: '$courseName' },
          firstName: { $first: '$student.firstName' },
          lastName: { $first: '$student.lastName' },
          email: { $first: '$student.email' }
        }
      }
    ]);

    console.log(`   Aggregation returned: ${students.length} unique students`);
    if (students.length > 0) {
      console.log(`   Sample students:`);
      students.slice(0, 5).forEach(s => {
        console.log(`     - ${s.firstName} ${s.lastName} (${s.email})`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

verifyEnrollments();

