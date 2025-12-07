// Script to add courses to production instructor
// Usage: node add-courses-to-production-instructor.js <instructorEmail>

const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

// Production MongoDB
const PROD_DB_URL = process.env.PROD_DB_CLUSTER_URL || 'mongodb+srv://roushanydv2003_db_user:Qtyj79zS0eKsnnGK@cluster0.wocqkj8.mongodb.net/codecampus';

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
  isVerified: { type: Boolean, default: true }, // Auto-verify for production
  createdAt: { type: Date, default: Date.now },
  completionStatus: { type: Number, default: 0 }
}, { collection: 'course', strict: false });

const instructorSchema = new mongoose.Schema({}, { collection: 'instructor', strict: false });

const Course = mongoose.model('Course', courseSchema);
const Instructor = mongoose.model('Instructor', instructorSchema);

const sampleCourses = [
  {
    title: "Complete React Development Bootcamp",
    duration: 40,
    category: "Web Development",
    level: "Beginner",
    tags: ["React", "JavaScript", "Frontend"],
    price: 2999,
    isPaid: true,
    about: "Master React from scratch to advanced level",
    description: "Learn React.js comprehensively with hands-on projects and real-world applications.",
    syllabus: [
      "Introduction to React",
      "Components and Props",
      "State Management",
      "Hooks and Context API",
      "Routing with React Router",
      "Advanced Patterns"
    ],
    requirements: [
      "Basic JavaScript knowledge",
      "HTML/CSS fundamentals",
      "Node.js installed"
    ]
  },
  {
    title: "Advanced JavaScript Mastery",
    duration: 35,
    category: "Programming",
    level: "Intermediate",
    tags: ["JavaScript", "ES6+", "Async"],
    price: 2499,
    isPaid: true,
    about: "Deep dive into advanced JavaScript concepts",
    description: "Master modern JavaScript features, async programming, and advanced patterns.",
    syllabus: [
      "ES6+ Features",
      "Async/Await",
      "Promises",
      "Closures and Scope",
      "Prototypes",
      "Design Patterns"
    ],
    requirements: [
      "Basic JavaScript knowledge",
      "Understanding of functions"
    ]
  },
  {
    title: "Node.js Backend Development",
    duration: 45,
    category: "Backend Development",
    level: "Intermediate",
    tags: ["Node.js", "Express", "API"],
    price: 3499,
    isPaid: true,
    about: "Build scalable backend applications with Node.js",
    description: "Learn to build RESTful APIs, handle authentication, and deploy Node.js applications.",
    syllabus: [
      "Node.js Fundamentals",
      "Express.js Framework",
      "RESTful APIs",
      "Database Integration",
      "Authentication & Security",
      "Deployment"
    ],
    requirements: [
      "JavaScript knowledge",
      "Basic understanding of HTTP"
    ]
  },
  {
    title: "Python for Data Science",
    duration: 50,
    category: "Data Science",
    level: "Beginner",
    tags: ["Python", "Data Science", "Pandas"],
    price: 3999,
    isPaid: true,
    about: "Learn Python for data analysis and visualization",
    description: "Master Python libraries like Pandas, NumPy, and Matplotlib for data science.",
    syllabus: [
      "Python Basics",
      "NumPy Arrays",
      "Pandas DataFrames",
      "Data Visualization",
      "Statistical Analysis",
      "Machine Learning Intro"
    ],
    requirements: [
      "No prior experience needed",
      "Basic math knowledge helpful"
    ]
  },
  {
    title: "Full Stack Web Development",
    duration: 60,
    category: "Web Development",
    level: "Advanced",
    tags: ["MERN", "Full Stack", "MongoDB"],
    price: 4999,
    isPaid: true,
    about: "Complete full-stack development course",
    description: "Build complete web applications using MERN stack (MongoDB, Express, React, Node.js).",
    syllabus: [
      "Frontend with React",
      "Backend with Node.js",
      "Database with MongoDB",
      "Authentication",
      "Deployment",
      "Best Practices"
    ],
    requirements: [
      "JavaScript knowledge",
      "Basic HTML/CSS"
    ]
  },
  {
    title: "Java Programming Fundamentals",
    duration: 40,
    category: "Programming",
    level: "Beginner",
    tags: ["Java", "OOP", "Programming"],
    price: 2999,
    isPaid: true,
    about: "Learn Java from scratch",
    description: "Master Java programming fundamentals and object-oriented programming concepts.",
    syllabus: [
      "Java Basics",
      "Object-Oriented Programming",
      "Collections Framework",
      "Exception Handling",
      "File I/O",
      "Multithreading"
    ],
    requirements: [
      "No prior experience needed"
    ]
  },
  {
    title: "Advanced Java & Spring Boot",
    duration: 50,
    category: "Backend Development",
    level: "Advanced",
    tags: ["Java", "Spring Boot", "REST API"],
    price: 4499,
    isPaid: true,
    about: "Build enterprise applications with Spring Boot",
    description: "Learn Spring Boot, Spring Security, and build production-ready applications.",
    syllabus: [
      "Spring Framework Basics",
      "Spring Boot Setup",
      "RESTful APIs",
      "Spring Security",
      "Database Integration",
      "Microservices"
    ],
    requirements: [
      "Java knowledge",
      "OOP concepts"
    ]
  },
  {
    title: "Vue.js Complete Guide",
    duration: 35,
    category: "Web Development",
    level: "Intermediate",
    tags: ["Vue.js", "Frontend", "JavaScript"],
    price: 2799,
    isPaid: true,
    about: "Master Vue.js framework",
    description: "Learn Vue.js 3 with Composition API, Vuex, and Vue Router.",
    syllabus: [
      "Vue.js Basics",
      "Components",
      "Vuex State Management",
      "Vue Router",
      "Composition API",
      "Advanced Patterns"
    ],
    requirements: [
      "JavaScript knowledge",
      "HTML/CSS basics"
    ]
  },
  {
    title: "Angular Framework Mastery",
    duration: 45,
    category: "Web Development",
    level: "Intermediate",
    tags: ["Angular", "TypeScript", "Frontend"],
    price: 3499,
    isPaid: true,
    about: "Complete Angular development course",
    description: "Master Angular framework with TypeScript, RxJS, and Angular Material.",
    syllabus: [
      "Angular Basics",
      "Components & Services",
      "RxJS Observables",
      "Routing",
      "Forms & Validation",
      "Angular Material"
    ],
    requirements: [
      "TypeScript knowledge",
      "JavaScript fundamentals"
    ]
  },
  {
    title: "Machine Learning with Python",
    duration: 55,
    category: "Data Science",
    level: "Advanced",
    tags: ["ML", "Python", "Scikit-learn"],
    price: 5499,
    isPaid: true,
    about: "Learn machine learning algorithms",
    description: "Master machine learning algorithms using Python and popular libraries.",
    syllabus: [
      "ML Fundamentals",
      "Supervised Learning",
      "Unsupervised Learning",
      "Neural Networks",
      "Model Evaluation",
      "Real-world Projects"
    ],
    requirements: [
      "Python knowledge",
      "Basic statistics"
    ]
  },
  {
    title: "Docker & Kubernetes Essentials",
    duration: 30,
    category: "DevOps",
    level: "Intermediate",
    tags: ["Docker", "Kubernetes", "DevOps"],
    price: 3999,
    isPaid: true,
    about: "Master containerization and orchestration",
    description: "Learn Docker and Kubernetes for containerized application deployment.",
    syllabus: [
      "Docker Basics",
      "Docker Compose",
      "Kubernetes Fundamentals",
      "Pods & Services",
      "Deployments",
      "CI/CD Integration"
    ],
    requirements: [
      "Linux basics",
      "Command line knowledge"
    ]
  },
  {
    title: "AWS Cloud Architecture",
    duration: 40,
    category: "Cloud Computing",
    level: "Advanced",
    tags: ["AWS", "Cloud", "DevOps"],
    price: 4999,
    isPaid: true,
    about: "Build scalable cloud solutions",
    description: "Master AWS services and architecture patterns for cloud applications.",
    syllabus: [
      "AWS Fundamentals",
      "EC2 & S3",
      "Lambda Functions",
      "RDS Databases",
      "CloudFormation",
      "Best Practices"
    ],
    requirements: [
      "Basic cloud knowledge",
      "Linux basics"
    ]
  },
  {
    title: "MongoDB Database Mastery",
    duration: 25,
    category: "Database",
    level: "Intermediate",
    tags: ["MongoDB", "NoSQL", "Database"],
    price: 2499,
    isPaid: true,
    about: "Master MongoDB database",
    description: "Learn MongoDB from basics to advanced queries and aggregation.",
    syllabus: [
      "MongoDB Basics",
      "CRUD Operations",
      "Indexing",
      "Aggregation Pipeline",
      "Replication",
      "Sharding"
    ],
    requirements: [
      "Basic database knowledge"
    ]
  },
  {
    title: "PostgreSQL Advanced Queries",
    duration: 30,
    category: "Database",
    level: "Advanced",
    tags: ["PostgreSQL", "SQL", "Database"],
    price: 2999,
    isPaid: true,
    about: "Advanced PostgreSQL techniques",
    description: "Master advanced SQL queries, stored procedures, and database optimization.",
    syllabus: [
      "Advanced SQL",
      "Stored Procedures",
      "Triggers",
      "Performance Tuning",
      "Partitioning",
      "Backup & Recovery"
    ],
    requirements: [
      "SQL basics",
      "Database fundamentals"
    ]
  },
  {
    title: "GraphQL API Development",
    duration: 35,
    category: "Backend Development",
    level: "Intermediate",
    tags: ["GraphQL", "API", "Backend"],
    price: 3299,
    isPaid: true,
    about: "Build GraphQL APIs",
    description: "Learn GraphQL schema design, resolvers, and build efficient APIs.",
    syllabus: [
      "GraphQL Basics",
      "Schema Design",
      "Resolvers",
      "Mutations",
      "Subscriptions",
      "Best Practices"
    ],
    requirements: [
      "JavaScript knowledge",
      "API concepts"
    ]
  },
  {
    title: "TypeScript Complete Course",
    duration: 30,
    category: "Programming",
    level: "Intermediate",
    tags: ["TypeScript", "JavaScript", "Programming"],
    price: 2499,
    isPaid: true,
    about: "Master TypeScript programming",
    description: "Learn TypeScript from basics to advanced features and best practices.",
    syllabus: [
      "TypeScript Basics",
      "Types & Interfaces",
      "Generics",
      "Decorators",
      "Advanced Types",
      "Project Setup"
    ],
    requirements: [
      "JavaScript knowledge"
    ]
  },
  {
    title: "Git & GitHub Mastery",
    duration: 20,
    category: "Tools",
    level: "Beginner",
    tags: ["Git", "GitHub", "Version Control"],
    price: 1499,
    isPaid: true,
    about: "Master version control with Git",
    description: "Learn Git commands, branching strategies, and GitHub workflows.",
    syllabus: [
      "Git Basics",
      "Branching & Merging",
      "GitHub Workflows",
      "Pull Requests",
      "Collaboration",
      "Best Practices"
    ],
    requirements: [
      "No prior experience needed"
    ]
  },
  {
    title: "UI/UX Design Fundamentals",
    duration: 40,
    category: "Design",
    level: "Beginner",
    tags: ["UI/UX", "Design", "Figma"],
    price: 3499,
    isPaid: true,
    about: "Learn UI/UX design principles",
    description: "Master user interface and user experience design with modern tools.",
    syllabus: [
      "Design Principles",
      "Color Theory",
      "Typography",
      "Figma Basics",
      "Prototyping",
      "User Research"
    ],
    requirements: [
      "No prior experience needed"
    ]
  },
  {
    title: "Flutter Mobile Development",
    duration: 50,
    category: "Mobile Development",
    level: "Intermediate",
    tags: ["Flutter", "Dart", "Mobile"],
    price: 4499,
    isPaid: true,
    about: "Build cross-platform mobile apps",
    description: "Learn Flutter and Dart to build beautiful mobile applications for iOS and Android.",
    syllabus: [
      "Flutter Basics",
      "Widgets",
      "State Management",
      "Navigation",
      "API Integration",
      "App Publishing"
    ],
    requirements: [
      "Programming basics",
      "Dart knowledge helpful"
    ]
  },
  {
    title: "Swift iOS Development",
    duration: 45,
    category: "Mobile Development",
    level: "Intermediate",
    tags: ["Swift", "iOS", "Mobile"],
    price: 4499,
    isPaid: true,
    about: "Build iOS applications",
    description: "Master Swift programming and iOS app development with Xcode.",
    syllabus: [
      "Swift Basics",
      "UIKit",
      "SwiftUI",
      "Core Data",
      "Networking",
      "App Store Submission"
    ],
    requirements: [
      "Mac computer",
      "Xcode installed"
    ]
  },
  {
    title: "Kotlin Android Development",
    duration: 45,
    category: "Mobile Development",
    level: "Intermediate",
    tags: ["Kotlin", "Android", "Mobile"],
    price: 4499,
    isPaid: true,
    about: "Build Android applications",
    description: "Learn Kotlin and Android development to build native Android apps.",
    syllabus: [
      "Kotlin Basics",
      "Android Studio",
      "Activities & Fragments",
      "RecyclerView",
      "Room Database",
      "Play Store Publishing"
    ],
    requirements: [
      "Java basics helpful",
      "Android Studio installed"
    ]
  }
];

async function addCoursesToInstructor(instructorEmail) {
  try {
    await mongoose.connect(PROD_DB_URL);
    console.log('✅ Connected to production MongoDB\n');

    if (!instructorEmail) {
      console.log('❌ Please provide instructor email');
      console.log('Usage: node add-courses-to-production-instructor.js <instructorEmail>');
      process.exit(1);
    }

    // Find instructor by email
    const instructor = await Instructor.findOne({ email: instructorEmail.toLowerCase() });
    
    if (!instructor) {
      console.log(`❌ Instructor with email "${instructorEmail}" not found`);
      console.log('\nAvailable instructors:');
      const allInstructors = await Instructor.find({}, 'email firstName lastName');
      allInstructors.forEach(inst => {
        console.log(`   - ${inst.email} (${inst.firstName || ''} ${inst.lastName || ''})`);
      });
      process.exit(1);
    }

    console.log(`✅ Found instructor: ${instructor.firstName || ''} ${instructor.lastName || ''} (${instructor.email})`);
    console.log(`   ID: ${instructor._id}\n`);

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
        instructorId: instructor._id 
      });

      if (existing) {
        console.log(`⏭️  Skipped: "${courseData.title}" (already exists)`);
        skippedCount++;
        continue;
      }

      const course = new Course({
        ...courseData,
        instructorId: instructor._id,
        thumbnail: defaultFile,
        thumbnailUrl: defaultFile.url,
        guidelines: defaultFile,
        guidelinesUrl: defaultFile.url,
        introduction: defaultFile,
        coursesEnrolled: [],
        isVerified: true, // Auto-verify for production
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
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

const instructorEmail = process.argv[2];
addCoursesToInstructor(instructorEmail);

