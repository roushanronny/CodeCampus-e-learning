// Script to add 20 sample courses to MongoDB
// Usage: node add-sample-courses.js <instructorId>

const mongoose = require('mongoose');
require('dotenv').config();

const DB_CLUSTER_URL = process.env.DB_CLUSTER_URL || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.DB_NAME || 'tutortrek';

const courseSchema = new mongoose.Schema({
  title: String,
  instructorId: mongoose.Schema.Types.ObjectId,
  duration: Number,
  category: String,
  level: String,
  tags: [String],
  price: Number,
  isPaid: Boolean,
  about: String,
  description: String,
  syllabus: [String],
  requirements: [String],
  thumbnail: {
    name: String,
    key: String,
    url: String
  },
  thumbnailUrl: String,
  guidelines: {
    name: String,
    key: String,
    url: String
  },
  guidelinesUrl: String,
  introduction: {
    name: String,
    key: String,
    url: String
  },
  coursesEnrolled: [mongoose.Schema.Types.ObjectId],
  rating: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  completionStatus: { type: Number, default: 0 }
}, { collection: 'course' });

const Course = mongoose.model('Course', courseSchema);

const sampleCourses = [
  {
    title: "Complete React Development Bootcamp",
    category: "Web Development",
    level: "Beginner",
    tags: ["React", "JavaScript", "Frontend", "Hooks", "Redux"],
    price: 49.99,
    isPaid: true,
    duration: 720, // 12 hours in minutes
    about: "Master React from scratch and build real-world applications",
    description: "Learn React.js from the ground up. Build modern, interactive web applications with React hooks, context API, and Redux. Includes hands-on projects and best practices.",
    syllabus: [
      "Introduction to React",
      "Components and Props",
      "State Management",
      "Hooks and Context API",
      "Routing with React Router",
      "Redux for State Management",
      "Testing React Applications",
      "Deployment Strategies"
    ],
    requirements: [
      "Basic JavaScript knowledge",
      "HTML/CSS fundamentals",
      "Node.js installed"
    ],
    rating: 4.7,
    enrollmentCount: 1250
  },
  {
    title: "Advanced JavaScript Mastery",
    category: "Programming",
    level: "Advanced",
    tags: ["JavaScript", "ES6+", "Async", "Performance"],
    price: 59.99,
    isPaid: true,
    duration: 900, // 15 hours
    about: "Deep dive into advanced JavaScript concepts and patterns",
    description: "Master advanced JavaScript concepts including closures, promises, async/await, design patterns, and performance optimization techniques.",
    syllabus: [
      "Advanced ES6+ Features",
      "Closures and Scope",
      "Promises and Async/Await",
      "Design Patterns",
      "Performance Optimization",
      "Memory Management",
      "Advanced Array Methods",
      "Functional Programming"
    ],
    requirements: [
      "Intermediate JavaScript knowledge",
      "Understanding of basic programming concepts"
    ],
    rating: 4.8,
    enrollmentCount: 890
  },
  {
    title: "Node.js Backend Development",
    category: "Backend Development",
    level: "Intermediate",
    tags: ["Node.js", "Express", "API", "MongoDB", "REST"],
    price: 54.99,
    isPaid: true,
    duration: 840, // 14 hours
    about: "Build scalable backend applications with Node.js and Express",
    description: "Learn to build robust RESTful APIs and backend services using Node.js, Express.js, and MongoDB. Includes authentication, file uploads, and deployment.",
    syllabus: [
      "Node.js Fundamentals",
      "Express.js Framework",
      "RESTful API Design",
      "MongoDB Integration",
      "Authentication & Authorization",
      "File Uploads",
      "Error Handling",
      "API Testing",
      "Deployment"
    ],
    requirements: [
      "JavaScript basics",
      "Understanding of HTTP",
      "Basic database concepts"
    ],
    rating: 4.6,
    enrollmentCount: 1100
  },
  {
    title: "Python for Data Science",
    category: "Data Science",
    level: "Beginner",
    tags: ["Python", "Data Science", "Pandas", "NumPy", "Matplotlib"],
    price: 44.99,
    isPaid: true,
    duration: 600, // 10 hours
    about: "Learn Python programming for data analysis and visualization",
    description: "Comprehensive course on Python for data science. Learn Pandas, NumPy, Matplotlib, and data analysis techniques with real-world datasets.",
    syllabus: [
      "Python Basics",
      "NumPy Arrays",
      "Pandas DataFrames",
      "Data Cleaning",
      "Data Visualization",
      "Statistical Analysis",
      "Machine Learning Basics",
      "Project: Data Analysis"
    ],
    requirements: [
      "No prior experience needed",
      "Basic math knowledge helpful"
    ],
    rating: 4.5,
    enrollmentCount: 2100
  },
  {
    title: "Full Stack Web Development",
    category: "Web Development",
    level: "Intermediate",
    tags: ["MERN", "Full Stack", "React", "Node.js", "MongoDB"],
    price: 79.99,
    isPaid: true,
    duration: 1200, // 20 hours
    about: "Complete full-stack development with MERN stack",
    description: "Build complete web applications from frontend to backend. Learn React, Node.js, Express, and MongoDB to create production-ready applications.",
    syllabus: [
      "Frontend with React",
      "Backend with Node.js",
      "Database with MongoDB",
      "Authentication",
      "API Integration",
      "State Management",
      "Deployment",
      "Full Stack Project"
    ],
    requirements: [
      "JavaScript knowledge",
      "HTML/CSS basics",
      "Basic programming concepts"
    ],
    rating: 4.9,
    enrollmentCount: 1850
  },
  {
    title: "Java Programming Fundamentals",
    category: "Programming",
    level: "Beginner",
    tags: ["Java", "OOP", "Programming", "Basics"],
    price: 39.99,
    isPaid: true,
    duration: 660, // 11 hours
    about: "Learn Java programming from scratch",
    description: "Master Java programming fundamentals including object-oriented programming, data structures, and algorithms. Perfect for beginners.",
    syllabus: [
      "Java Basics",
      "Object-Oriented Programming",
      "Data Structures",
      "Exception Handling",
      "File I/O",
      "Collections Framework",
      "Multithreading",
      "Java Projects"
    ],
    requirements: [
      "No prior experience needed",
      "Basic computer skills"
    ],
    rating: 4.4,
    enrollmentCount: 1500
  },
  {
    title: "Advanced Java & Spring Boot",
    category: "Backend Development",
    level: "Advanced",
    tags: ["Java", "Spring Boot", "REST API", "Microservices"],
    price: 69.99,
    isPaid: true,
    duration: 960, // 16 hours
    about: "Master enterprise Java development with Spring Boot",
    description: "Learn advanced Java concepts and Spring Boot framework to build enterprise-level applications, REST APIs, and microservices.",
    syllabus: [
      "Spring Framework Basics",
      "Spring Boot Fundamentals",
      "RESTful Web Services",
      "Spring Data JPA",
      "Security with Spring Security",
      "Microservices Architecture",
      "Testing",
      "Deployment"
    ],
    requirements: [
      "Java programming knowledge",
      "Understanding of OOP",
      "Basic web concepts"
    ],
    rating: 4.7,
    enrollmentCount: 950
  },
  {
    title: "Vue.js Complete Guide",
    category: "Web Development",
    level: "Intermediate",
    tags: ["Vue.js", "JavaScript", "Frontend", "Vuex"],
    price: 49.99,
    isPaid: true,
    duration: 780, // 13 hours
    about: "Master Vue.js framework for modern web development",
    description: "Comprehensive Vue.js course covering components, routing, state management with Vuex, and building single-page applications.",
    syllabus: [
      "Vue.js Basics",
      "Components & Props",
      "Vue Router",
      "State Management with Vuex",
      "API Integration",
      "Advanced Patterns",
      "Testing Vue Apps",
      "Deployment"
    ],
    requirements: [
      "JavaScript knowledge",
      "HTML/CSS basics",
      "Basic programming concepts"
    ],
    rating: 4.6,
    enrollmentCount: 780
  },
  {
    title: "Angular Framework Mastery",
    category: "Web Development",
    level: "Intermediate",
    tags: ["Angular", "TypeScript", "Frontend", "RxJS"],
    price: 59.99,
    isPaid: true,
    duration: 900, // 15 hours
    about: "Build enterprise applications with Angular",
    description: "Learn Angular framework with TypeScript. Build scalable, maintainable applications with components, services, routing, and RxJS.",
    syllabus: [
      "Angular Basics",
      "TypeScript Fundamentals",
      "Components & Services",
      "Routing & Navigation",
      "Forms & Validation",
      "HTTP & RxJS",
      "State Management",
      "Testing & Deployment"
    ],
    requirements: [
      "JavaScript knowledge",
      "TypeScript basics helpful",
      "HTML/CSS understanding"
    ],
    rating: 4.5,
    enrollmentCount: 650
  },
  {
    title: "Machine Learning with Python",
    category: "Data Science",
    level: "Intermediate",
    tags: ["Machine Learning", "Python", "Scikit-learn", "TensorFlow"],
    price: 74.99,
    isPaid: true,
    duration: 1080, // 18 hours
    about: "Learn machine learning algorithms and implementation",
    description: "Comprehensive machine learning course covering algorithms, model training, evaluation, and deployment using Python and popular ML libraries.",
    syllabus: [
      "ML Fundamentals",
      "Supervised Learning",
      "Unsupervised Learning",
      "Neural Networks",
      "Deep Learning Basics",
      "Model Evaluation",
      "Feature Engineering",
      "ML Projects"
    ],
    requirements: [
      "Python programming",
      "Basic math/statistics",
      "NumPy/Pandas knowledge"
    ],
    rating: 4.8,
    enrollmentCount: 1200
  },
  {
    title: "Docker & Kubernetes Essentials",
    category: "DevOps",
    level: "Intermediate",
    tags: ["Docker", "Kubernetes", "DevOps", "Containers"],
    price: 54.99,
    isPaid: true,
    duration: 720, // 12 hours
    about: "Master containerization and orchestration",
    description: "Learn Docker and Kubernetes to containerize applications and manage containerized deployments at scale.",
    syllabus: [
      "Docker Basics",
      "Docker Images & Containers",
      "Docker Compose",
      "Kubernetes Fundamentals",
      "Pods & Services",
      "Deployments",
      "Scaling & Updates",
      "Production Best Practices"
    ],
    requirements: [
      "Linux basics",
      "Command line knowledge",
      "Basic networking concepts"
    ],
    rating: 4.7,
    enrollmentCount: 850
  },
  {
    title: "AWS Cloud Architecture",
    category: "Cloud Computing",
    level: "Advanced",
    tags: ["AWS", "Cloud", "DevOps", "Architecture"],
    price: 89.99,
    isPaid: true,
    duration: 1200, // 20 hours
    about: "Design and deploy scalable cloud solutions on AWS",
    description: "Comprehensive AWS course covering EC2, S3, Lambda, RDS, and more. Learn to design and deploy scalable, secure cloud architectures.",
    syllabus: [
      "AWS Fundamentals",
      "EC2 & Compute Services",
      "S3 & Storage",
      "RDS & Databases",
      "Lambda & Serverless",
      "VPC & Networking",
      "Security & IAM",
      "Architecture Patterns"
    ],
    requirements: [
      "Basic cloud concepts",
      "Networking basics",
      "Linux knowledge helpful"
    ],
    rating: 4.9,
    enrollmentCount: 1100
  },
  {
    title: "MongoDB Database Mastery",
    category: "Database",
    level: "Intermediate",
    tags: ["MongoDB", "NoSQL", "Database", "Mongoose"],
    price: 44.99,
    isPaid: true,
    duration: 600, // 10 hours
    about: "Master MongoDB NoSQL database",
    description: "Learn MongoDB from basics to advanced. Understand document databases, queries, aggregation, indexing, and best practices.",
    syllabus: [
      "MongoDB Basics",
      "CRUD Operations",
      "Querying & Filtering",
      "Aggregation Pipeline",
      "Indexing",
      "Data Modeling",
      "Mongoose ODM",
      "Performance Optimization"
    ],
    requirements: [
      "Basic database concepts",
      "JavaScript knowledge helpful",
      "No prior MongoDB experience needed"
    ],
    rating: 4.6,
    enrollmentCount: 950
  },
  {
    title: "PostgreSQL Advanced Queries",
    category: "Database",
    level: "Advanced",
    tags: ["PostgreSQL", "SQL", "Database", "Advanced"],
    price: 49.99,
    isPaid: true,
    duration: 720, // 12 hours
    about: "Advanced PostgreSQL database techniques",
    description: "Master advanced PostgreSQL features including complex queries, stored procedures, triggers, and performance optimization.",
    syllabus: [
      "Advanced SQL Queries",
      "Joins & Subqueries",
      "Stored Procedures",
      "Triggers & Functions",
      "Indexing Strategies",
      "Query Optimization",
      "Partitioning",
      "Backup & Recovery"
    ],
    requirements: [
      "SQL basics",
      "Database fundamentals",
      "PostgreSQL basics"
    ],
    rating: 4.7,
    enrollmentCount: 720
  },
  {
    title: "GraphQL API Development",
    category: "Backend Development",
    level: "Intermediate",
    tags: ["GraphQL", "API", "Node.js", "Apollo"],
    price: 54.99,
    isPaid: true,
    duration: 660, // 11 hours
    about: "Build modern APIs with GraphQL",
    description: "Learn GraphQL to build flexible, efficient APIs. Master queries, mutations, subscriptions, and integrate with React and Node.js.",
    syllabus: [
      "GraphQL Fundamentals",
      "Schema Design",
      "Queries & Mutations",
      "Subscriptions",
      "Apollo Server",
      "Apollo Client",
      "Authentication",
      "Best Practices"
    ],
    requirements: [
      "JavaScript/Node.js knowledge",
      "REST API understanding",
      "Basic React helpful"
    ],
    rating: 4.6,
    enrollmentCount: 680
  },
  {
    title: "TypeScript Complete Course",
    category: "Programming",
    level: "Intermediate",
    tags: ["TypeScript", "JavaScript", "Programming", "Types"],
    price: 44.99,
    isPaid: true,
    duration: 600, // 10 hours
    about: "Master TypeScript for modern JavaScript development",
    description: "Learn TypeScript from basics to advanced. Understand types, interfaces, generics, and build type-safe applications.",
    syllabus: [
      "TypeScript Basics",
      "Types & Interfaces",
      "Classes & Inheritance",
      "Generics",
      "Decorators",
      "Advanced Types",
      "TypeScript with React",
      "Project Setup"
    ],
    requirements: [
      "JavaScript knowledge",
      "Basic programming concepts",
      "OOP understanding helpful"
    ],
    rating: 4.8,
    enrollmentCount: 1400
  },
  {
    title: "Git & GitHub Mastery",
    category: "Development Tools",
    level: "Beginner",
    tags: ["Git", "GitHub", "Version Control", "DevOps"],
    price: 29.99,
    isPaid: true,
    duration: 360, // 6 hours
    about: "Master version control with Git and GitHub",
    description: "Learn Git version control system and GitHub. Master branching, merging, pull requests, and collaborative workflows.",
    syllabus: [
      "Git Basics",
      "Commits & History",
      "Branching & Merging",
      "GitHub Workflows",
      "Pull Requests",
      "Conflict Resolution",
      "Advanced Git",
      "Best Practices"
    ],
    requirements: [
      "No prior experience needed",
      "Basic command line helpful"
    ],
    rating: 4.5,
    enrollmentCount: 2500
  },
  {
    title: "UI/UX Design Fundamentals",
    category: "Design",
    level: "Beginner",
    tags: ["UI/UX", "Design", "Figma", "User Experience"],
    price: 39.99,
    isPaid: true,
    duration: 540, // 9 hours
    about: "Learn UI/UX design principles and tools",
    description: "Master user interface and user experience design. Learn design principles, wireframing, prototyping with Figma, and user research.",
    syllabus: [
      "Design Principles",
      "Color Theory",
      "Typography",
      "Wireframing",
      "Prototyping with Figma",
      "User Research",
      "Design Systems",
      "Portfolio Building"
    ],
    requirements: [
      "No prior experience needed",
      "Creative mindset",
      "Figma account (free)"
    ],
    rating: 4.6,
    enrollmentCount: 1800
  },
  {
    title: "Flutter Mobile Development",
    category: "Mobile Development",
    level: "Intermediate",
    tags: ["Flutter", "Dart", "Mobile", "iOS", "Android"],
    price: 64.99,
    isPaid: true,
    duration: 960, // 16 hours
    about: "Build cross-platform mobile apps with Flutter",
    description: "Learn Flutter and Dart to build beautiful, native mobile applications for both iOS and Android from a single codebase.",
    syllabus: [
      "Flutter Basics",
      "Dart Programming",
      "Widgets & Layouts",
      "State Management",
      "Navigation",
      "API Integration",
      "Firebase Integration",
      "Publishing Apps"
    ],
    requirements: [
      "Programming basics",
      "OOP concepts",
      "Mobile development interest"
    ],
    rating: 4.7,
    enrollmentCount: 1050
  },
  {
    title: "Swift iOS Development",
    category: "Mobile Development",
    level: "Intermediate",
    tags: ["Swift", "iOS", "Mobile", "Xcode"],
    price: 69.99,
    isPaid: true,
    duration: 1080, // 18 hours
    about: "Build native iOS applications with Swift",
    description: "Master Swift programming language and iOS development. Build native iOS apps using Xcode, UIKit, and SwiftUI.",
    syllabus: [
      "Swift Basics",
      "iOS App Structure",
      "UIKit & SwiftUI",
      "Navigation",
      "Data Persistence",
      "Networking",
      "Core Data",
      "App Store Submission"
    ],
    requirements: [
      "Programming basics",
      "Mac computer",
      "Xcode installed"
    ],
    rating: 4.8,
    enrollmentCount: 920
  },
  {
    title: "Kotlin Android Development",
    category: "Mobile Development",
    level: "Intermediate",
    tags: ["Kotlin", "Android", "Mobile", "Jetpack"],
    price: 64.99,
    isPaid: true,
    duration: 1020, // 17 hours
    about: "Build Android apps with Kotlin",
    description: "Learn Kotlin programming and Android development. Build modern Android applications using Jetpack components and Material Design.",
    syllabus: [
      "Kotlin Fundamentals",
      "Android Basics",
      "Activities & Fragments",
      "Jetpack Components",
      "Room Database",
      "Networking",
      "Material Design",
      "Play Store Publishing"
    ],
    requirements: [
      "Java basics helpful",
      "Android Studio",
      "Programming fundamentals"
    ],
    rating: 4.7,
    enrollmentCount: 1100
  }
];

async function addSampleCourses(instructorId) {
  try {
    await mongoose.connect(`${DB_CLUSTER_URL}/${DB_NAME}`);
    console.log('Connected to MongoDB');

    if (!instructorId) {
      console.log('❌ Please provide instructor ID');
      console.log('Usage: node add-sample-courses.js <instructorId>');
      console.log('\nTo get instructor ID, run: node get-instructor-id.js <email>');
      process.exit(1);
    }

    // Check if instructor exists
    const Instructor = mongoose.model('Instructors', new mongoose.Schema({}, { collection: 'instructor' }));
    const instructor = await Instructor.findById(instructorId);
    
    if (!instructor) {
      console.log(`❌ Instructor with ID ${instructorId} not found`);
      process.exit(1);
    }

    console.log(`✅ Found instructor: ${instructor.firstName} ${instructor.lastName}`);

    // Add default file objects for each course
    const defaultFile = {
      name: "default.jpg",
      key: "default_key_" + Date.now(),
      url: "/uploads/default.jpg"
    };

    let addedCount = 0;
    let skippedCount = 0;

    for (const courseData of sampleCourses) {
      // Check if course already exists
      const existing = await Course.findOne({ 
        title: courseData.title,
        instructorId: instructorId 
      });

      if (existing) {
        console.log(`⏭️  Skipped: "${courseData.title}" (already exists)`);
        skippedCount++;
        continue;
      }

      const course = new Course({
        ...courseData,
        instructorId: instructorId,
        thumbnail: defaultFile,
        thumbnailUrl: defaultFile.url,
        guidelines: defaultFile,
        guidelinesUrl: defaultFile.url,
        introduction: defaultFile,
        coursesEnrolled: [],
        isVerified: Math.random() > 0.3, // 70% verified
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date in last 30 days
      });

      await course.save();
      console.log(`✅ Added: "${courseData.title}"`);
      addedCount++;
    }

    console.log(`\n✨ Summary:`);
    console.log(`   Added: ${addedCount} courses`);
    console.log(`   Skipped: ${skippedCount} courses (already exist)`);
    console.log(`   Total: ${addedCount + skippedCount} courses processed`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

const instructorId = process.argv[2];
addSampleCourses(instructorId);

