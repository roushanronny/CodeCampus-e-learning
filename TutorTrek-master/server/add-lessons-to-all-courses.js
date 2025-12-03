// Script to add sample lessons to all courses in MongoDB
// Usage: node add-lessons-to-all-courses.js

const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

const DB_CLUSTER_URL = process.env.DB_CLUSTER_URL || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.DB_NAME || 'tutortrek';

// Define schemas directly
const MediaSchema = new mongoose.Schema({
  key: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true }
});

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  contents: { type: [String], required: true },
  duration: { type: Number, required: true, min: 0 },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'instructor', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'course', required: true },
  about: { type: String, required: true },
  media: { type: [MediaSchema] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { collection: 'lessons' });

const CourseSchema = new mongoose.Schema({
  title: String,
  instructorId: mongoose.Schema.Types.ObjectId,
  category: String,
  level: String,
  duration: Number,
  tags: [String],
  price: Number,
  isPaid: Boolean,
  about: String,
  description: String,
  syllabus: [String],
  requirements: [String],
  thumbnail: { name: String, key: String, url: String },
  thumbnailUrl: String,
  guidelines: { name: String, key: String, url: String },
  guidelinesUrl: String,
  introduction: { name: String, key: String, url: String },
  coursesEnrolled: [mongoose.Schema.Types.ObjectId],
  rating: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  completionStatus: { type: Number, default: 0 }
}, { collection: 'course' });

const Lesson = mongoose.model('Lesson', LessonSchema);
const Course = mongoose.model('Course', CourseSchema);

mongoose.connect(`${DB_CLUSTER_URL}/${DB_NAME}`)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Lesson templates based on course category
const getLessonTemplates = (courseTitle, category, level) => {
  const templates = {
    'Web Development': [
      { title: 'Introduction to Web Development', description: 'Learn the fundamentals of web development and how the web works.', contents: ['What is Web Development?', 'Client-Server Architecture', 'HTTP Protocol Basics', 'Web Technologies Overview'], duration: 25, about: 'This lesson introduces you to the world of web development and sets the foundation for your learning journey.' },
      { title: 'HTML Fundamentals', description: 'Master HTML structure, tags, and semantic elements.', contents: ['HTML Document Structure', 'Common HTML Tags', 'Forms and Inputs', 'Semantic HTML5'], duration: 45, about: 'Learn how to structure web pages using HTML, the backbone of every website.' },
      { title: 'CSS Styling Basics', description: 'Style your web pages with CSS and create beautiful layouts.', contents: ['CSS Selectors', 'Box Model', 'Flexbox Layout', 'CSS Grid'], duration: 50, about: 'Transform plain HTML into visually appealing web pages using CSS.' },
      { title: 'JavaScript Basics', description: 'Add interactivity to your websites with JavaScript.', contents: ['Variables and Data Types', 'Functions and Scope', 'DOM Manipulation', 'Event Handling'], duration: 60, about: 'Start your journey into JavaScript programming and make your pages dynamic.' },
      { title: 'Advanced JavaScript Concepts', description: 'Deep dive into advanced JavaScript features.', contents: ['ES6+ Features', 'Async/Await', 'Promises', 'Closures and Hoisting'], duration: 55, about: 'Master advanced JavaScript concepts to write modern, efficient code.' },
      { title: 'Responsive Design', description: 'Create websites that work on all devices.', contents: ['Media Queries', 'Mobile-First Approach', 'Flexible Layouts', 'Testing on Devices'], duration: 40, about: 'Learn to build responsive websites that adapt to different screen sizes.' },
      { title: 'Project: Build a Portfolio Website', description: 'Apply all concepts by building a complete portfolio website.', contents: ['Project Setup', 'HTML Structure', 'CSS Styling', 'JavaScript Interactivity', 'Deployment'], duration: 90, about: 'Put your skills to the test by building a real-world portfolio website project.' }
    ],
    'Data Science': [
      { title: 'Introduction to Data Science', description: 'Understand what data science is and its applications.', contents: ['What is Data Science?', 'Data Science Workflow', 'Tools and Technologies', 'Career Opportunities'], duration: 30, about: 'Get introduced to the exciting field of data science and its real-world applications.' },
      { title: 'Python for Data Science', description: 'Learn Python programming essentials for data analysis.', contents: ['Python Basics', 'NumPy Arrays', 'Pandas DataFrames', 'Data Manipulation'], duration: 50, about: 'Master Python libraries essential for data science work.' },
      { title: 'Data Cleaning and Preprocessing', description: 'Clean and prepare your data for analysis.', contents: ['Handling Missing Data', 'Data Transformation', 'Outlier Detection', 'Feature Engineering'], duration: 45, about: 'Learn essential techniques to prepare your data for analysis.' },
      { title: 'Data Visualization', description: 'Create compelling visualizations to understand your data.', contents: ['Matplotlib Basics', 'Seaborn for Statistical Plots', 'Plotly Interactive Charts', 'Best Practices'], duration: 40, about: 'Visualize data effectively to uncover insights and tell stories.' },
      { title: 'Statistical Analysis', description: 'Apply statistical methods to analyze data.', contents: ['Descriptive Statistics', 'Hypothesis Testing', 'Correlation Analysis', 'Regression Basics'], duration: 55, about: 'Use statistical methods to draw meaningful conclusions from data.' },
      { title: 'Machine Learning Basics', description: 'Introduction to machine learning algorithms.', contents: ['Supervised vs Unsupervised Learning', 'Linear Regression', 'Classification', 'Model Evaluation'], duration: 60, about: 'Get started with machine learning and build your first predictive models.' }
    ],
    'Mobile Development': [
      { title: 'Introduction to Mobile Development', description: 'Overview of mobile app development platforms and approaches.', contents: ['Native vs Cross-Platform', 'iOS vs Android', 'Development Tools', 'App Store Guidelines'], duration: 25, about: 'Understand the mobile development landscape and choose your path.' },
      { title: 'Mobile UI/UX Design', description: 'Design beautiful and intuitive mobile interfaces.', contents: ['Design Principles', 'Mobile Patterns', 'Navigation Patterns', 'Accessibility'], duration: 40, about: 'Learn to design mobile apps that users love to interact with.' },
      { title: 'React Native Basics', description: 'Build mobile apps using React Native framework.', contents: ['React Native Setup', 'Components and Props', 'State Management', 'Navigation'], duration: 50, about: 'Start building cross-platform mobile apps with React Native.' },
      { title: 'State Management in Mobile Apps', description: 'Manage app state effectively in mobile applications.', contents: ['Local State', 'Context API', 'Redux for Mobile', 'Async Storage'], duration: 45, about: 'Master state management techniques for mobile applications.' },
      { title: 'API Integration', description: 'Connect your mobile app to backend services.', contents: ['RESTful APIs', 'Fetching Data', 'Error Handling', 'Authentication'], duration: 50, about: 'Learn to integrate APIs and fetch data in your mobile apps.' },
      { title: 'Publishing Your App', description: 'Prepare and publish your app to app stores.', contents: ['App Store Preparation', 'Build Configuration', 'Submission Process', 'Marketing Tips'], duration: 35, about: 'Take your app from development to production and publish it.' }
    ],
    'Cloud Computing': [
      { title: 'Introduction to Cloud Computing', description: 'Understand cloud computing fundamentals and services.', contents: ['What is Cloud Computing?', 'Cloud Service Models', 'Major Cloud Providers', 'Benefits and Challenges'], duration: 30, about: 'Get introduced to cloud computing and its transformative impact on technology.' },
      { title: 'AWS Fundamentals', description: 'Learn the basics of Amazon Web Services.', contents: ['AWS Console Overview', 'EC2 Instances', 'S3 Storage', 'IAM Security'], duration: 50, about: 'Master the fundamentals of AWS, the leading cloud platform.' },
      { title: 'Containerization with Docker', description: 'Containerize your applications with Docker.', contents: ['Docker Basics', 'Dockerfile Creation', 'Docker Compose', 'Container Orchestration'], duration: 45, about: 'Learn to containerize applications for easy deployment and scaling.' },
      { title: 'Kubernetes Orchestration', description: 'Orchestrate containers at scale with Kubernetes.', contents: ['Kubernetes Architecture', 'Pods and Services', 'Deployments', 'Scaling Applications'], duration: 55, about: 'Master Kubernetes to manage containerized applications efficiently.' },
      { title: 'Serverless Computing', description: 'Build applications using serverless architecture.', contents: ['Serverless Concepts', 'AWS Lambda', 'API Gateway', 'Event-Driven Architecture'], duration: 50, about: 'Explore serverless computing and build scalable applications without managing servers.' }
    ],
    'Machine Learning': [
      { title: 'Introduction to Machine Learning', description: 'Understand what machine learning is and its types.', contents: ['What is ML?', 'Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning'], duration: 35, about: 'Get introduced to machine learning and its various approaches.' },
      { title: 'Linear Regression', description: 'Learn your first machine learning algorithm.', contents: ['Regression Basics', 'Cost Function', 'Gradient Descent', 'Model Evaluation'], duration: 50, about: 'Master linear regression, a fundamental ML algorithm.' },
      { title: 'Classification Algorithms', description: 'Classify data using various algorithms.', contents: ['Logistic Regression', 'Decision Trees', 'Random Forest', 'SVM'], duration: 60, about: 'Learn different classification algorithms and when to use them.' },
      { title: 'Neural Networks Basics', description: 'Introduction to artificial neural networks.', contents: ['Neuron Structure', 'Activation Functions', 'Backpropagation', 'Building Neural Networks'], duration: 65, about: 'Start your journey into deep learning with neural networks.' },
      { title: 'Deep Learning with TensorFlow', description: 'Build deep learning models using TensorFlow.', contents: ['TensorFlow Basics', 'Building Models', 'Training and Validation', 'Saving Models'], duration: 70, about: 'Use TensorFlow to build and train deep learning models.' }
    ],
    'Cybersecurity': [
      { title: 'Introduction to Cybersecurity', description: 'Understand the fundamentals of cybersecurity.', contents: ['Threat Landscape', 'Attack Vectors', 'Security Principles', 'Defense Strategies'], duration: 30, about: 'Get introduced to cybersecurity and learn to protect digital assets.' },
      { title: 'Network Security', description: 'Secure network infrastructure and communications.', contents: ['Firewalls', 'VPNs', 'Intrusion Detection', 'Network Monitoring'], duration: 45, about: 'Learn to secure network communications and infrastructure.' },
      { title: 'Web Application Security', description: 'Protect web applications from common vulnerabilities.', contents: ['OWASP Top 10', 'SQL Injection', 'XSS Attacks', 'Authentication Security'], duration: 50, about: 'Identify and fix common web application security vulnerabilities.' },
      { title: 'Cryptography Basics', description: 'Understand encryption and cryptographic principles.', contents: ['Encryption Types', 'Hashing', 'Digital Signatures', 'SSL/TLS'], duration: 40, about: 'Learn the fundamentals of cryptography and data protection.' },
      { title: 'Ethical Hacking', description: 'Learn ethical hacking and penetration testing.', contents: ['Penetration Testing', 'Vulnerability Assessment', 'Security Tools', 'Reporting'], duration: 55, about: 'Master ethical hacking techniques to identify and fix security issues.' }
    ]
  };

  // Return templates based on category, or default web development templates
  return templates[category] || templates['Web Development'];
};

const addLessonsToAllCourses = async () => {
  try {
    // Get all courses
    const courses = await Course.find({});
    
    if (courses.length === 0) {
      console.log('❌ No courses found. Please add courses first.');
      return;
    }

    console.log(`📚 Found ${courses.length} courses\n`);

    let totalLessonsAdded = 0;
    let totalLessonsSkipped = 0;

    for (const course of courses) {
      console.log(`\n📖 Processing: "${course.title}"`);
      
      // Get existing lessons for this course
      const existingLessons = await Lesson.find({ courseId: course._id });
      const existingLessonTitles = existingLessons.map(l => l.title.toLowerCase());
      
      // Get lesson templates based on course category
      const lessonTemplates = getLessonTemplates(course.title, course.category, course.level);
      
      // Add 5-7 lessons per course (or all templates if less)
      const numLessonsToAdd = Math.min(lessonTemplates.length, Math.floor(Math.random() * 3) + 5);
      const selectedTemplates = lessonTemplates.slice(0, numLessonsToAdd);

      let courseLessonsAdded = 0;
      let courseLessonsSkipped = 0;

      for (const template of selectedTemplates) {
        // Skip if lesson with same title already exists
        if (existingLessonTitles.includes(template.title.toLowerCase())) {
          console.log(`  ⏩ Skipped: "${template.title}" (already exists)`);
          courseLessonsSkipped++;
          totalLessonsSkipped++;
          continue;
        }

        // Create lesson data
        const lessonData = {
          title: template.title,
          description: template.description,
          contents: template.contents,
          duration: template.duration, // in minutes
          instructorId: course.instructorId,
          courseId: course._id,
          about: template.about,
          media: [
            {
              name: `${template.title.toLowerCase().replace(/\s+/g, '-')}-thumbnail.jpg`,
              key: `lesson-${course._id}-${Date.now()}-thumbnail`
            },
            {
              name: `${template.title.toLowerCase().replace(/\s+/g, '-')}-video.mp4`,
              key: `lesson-${course._id}-${Date.now()}-video`
            }
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const newLesson = new Lesson(lessonData);
        await newLesson.save();
        
        console.log(`  ✅ Added: "${template.title}" (${template.duration} min)`);
        courseLessonsAdded++;
        totalLessonsAdded++;
      }

      console.log(`  📊 Course Summary: ${courseLessonsAdded} added, ${courseLessonsSkipped} skipped`);
    }

    console.log('\n✨ Overall Summary:');
    console.log(`   Total courses processed: ${courses.length}`);
    console.log(`   Total lessons added: ${totalLessonsAdded}`);
    console.log(`   Total lessons skipped: ${totalLessonsSkipped}`);
    console.log(`   Average lessons per course: ${(totalLessonsAdded / courses.length).toFixed(1)}`);

  } catch (error) {
    console.error('❌ Error adding lessons:', error);
  } finally {
    mongoose.disconnect();
  }
};

addLessonsToAllCourses();

