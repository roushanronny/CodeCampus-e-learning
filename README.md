# CodeCampus E-Learning Platform

A comprehensive online learning platform built with TypeScript, React.js, Node.js, Express.js, MongoDB, and Redis. The platform connects instructors and students, enabling course creation, management, and learning.

## 🚀 Tech Stack

### Backend
- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **MongoDB** with **Mongoose** for database
- **Redis** for caching
- **JWT** for authentication
- **Stripe** for payments
- **AWS S3** for file storage

### Frontend
- **React** with **TypeScript**
- **Redux** for state management
- **Tailwind CSS** for styling
- **Material Tailwind** for UI components
- **React Router** for navigation
- **Axios** for API calls

## 📋 Features

### For Students
- User registration and authentication
- Browse and search courses
- Enroll in courses (free and paid)
- Watch video lessons
- Take quizzes and exams
- Track learning progress
- Set and manage weekly learning goals
- Discussion forums for each lesson
- Student dashboard with statistics

### For Instructors
- Instructor registration and verification
- Create and manage courses
- Upload course content (videos, PDFs, quizzes)
- Track student enrollment
- View course analytics
- Manage lessons and course materials

### For Admins
- Manage instructors and students
- Approve/reject instructor requests
- Block/unblock users
- View platform analytics
- Manage categories

## 🛠️ Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Redis
- AWS S3 account (for file storage)
- Stripe account (for payments - optional for development)

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/roushanronny/CodeCampus-e-learning.git
   cd CodeCampus-e-learning
   ```

2. **Install dependencies:**
   
   For server:
   ```bash
   cd server
   npm install
   # or
   yarn install
   ```
   
   For client:
   ```bash
   cd client
   npm install
   # or
   yarn install
   ```

3. **Environment Variables:**
   
   Create `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   REDIS_URL=your_redis_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_refresh_token_secret
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   AWS_BUCKET_NAME=your_s3_bucket_name
   STRIPE_SECRET_KEY=your_stripe_secret_key (optional for development)
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key (optional for development)
   ```

4. **Run the application:**
   
   Start the server:
   ```bash
   cd server
   npm run dev
   # or
   yarn run dev
   ```
   
   Start the client:
   ```bash
   cd client
   npm start
   # or
   yarn start
   ```

## 📁 Project Structure

```
CodeCampus-e-learning/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── api/           # API services and endpoints
│   │   ├── components/    # React components
│   │   ├── redux/         # Redux store and slices
│   │   ├── routes.tsx     # Route configuration
│   │   └── types/         # TypeScript type definitions
│   └── package.json
│
├── server/                 # Backend Node.js application
│   ├── src/
│   │   ├── adapters/      # Controllers and external adapters
│   │   ├── app/           # Business logic (use cases, repositories)
│   │   ├── frameworks/     # External frameworks (database, services)
│   │   ├── types/         # TypeScript type definitions
│   │   └── app.ts         # Application entry point
│   └── package.json
│
└── conf.d/                 # Nginx configuration
```

## 🏗️ Architecture

The project follows **Clean Architecture** principles:

- **Adapters Layer**: Controllers, external services
- **Application Layer**: Use cases, business logic, repository interfaces
- **Frameworks Layer**: Database implementations, external services
- **Domain Layer**: Entity models and interfaces

## 🔐 Authentication

- JWT-based authentication
- Refresh token mechanism
- Role-based access control (Student, Instructor, Admin)
- Google OAuth integration

## 💳 Payment Integration

- Stripe integration for course payments
- Support for free and paid courses
- Development mode allows direct enrollment without payment

## 📚 API Documentation

API documentation will be available soon. *(To be updated with CodeCampus API docs)*


## 📝 Recent Updates

- ✅ User-specific weekly goals (stored in database)
- ✅ Improved payment and enrollment flow
- ✅ Enhanced error handling
- ✅ JWT authentication fixes
- ✅ Development mode support for testing without Stripe

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

**Roushan Kumar**
- Email: roushankumarydv2003@gmail.com
- LinkedIn: [roushan-kumar-7a4172257](https://www.linkedin.com/in/roushan-kumar-7a4172257/)
- GitHub: [roushanronny](https://github.com/roushanronny)
- Portfolio: [roushanronny.github.io/Portfolio-Website](https://roushanronny.github.io/Portfolio-Website/)

## 📄 License

This project is licensed under the MIT License.

---

⭐ If you find this project helpful, please consider giving it a star!
