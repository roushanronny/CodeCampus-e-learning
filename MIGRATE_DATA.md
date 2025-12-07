# 📦 Local Data Production Mein Migrate Karne Ka Guide

## Problem
Localhost par jo data hai (students, courses, enrollments), woh production (MongoDB Atlas) mein nahi hai.

## Solution: Data Migration

### Option 1: Local Data Export/Import (Recommended)

#### Step 1: Local Data Export

**Terminal mein:**
```bash
cd ~/Desktop/CodeCampus/server

# Students export
mongodump --uri="mongodb://127.0.0.1:27017/codecampus" --collection=students --out=./data-export

# Courses export
mongodump --uri="mongodb://127.0.0.1:27017/codecampus" --collection=course --out=./data-export

# Instructors export
mongodump --uri="mongodb://127.0.0.1:27017/codecampus" --collection=instructor --out=./data-export

# Enrollments (coursesEnrolled field) bhi export ho jayega
```

**Ya sab collections ek saath:**
```bash
mongodump --uri="mongodb://127.0.0.1:27017/codecampus" --out=./data-export
```

#### Step 2: Production Data Import

**Terminal mein:**
```bash
cd ~/Desktop/CodeCampus/server

# MongoDB Atlas connection string use karo
# Format: mongodb+srv://username:password@cluster.mongodb.net/codecampus

# Students import
mongorestore --uri="mongodb+srv://roushanydv2003_db_user:Qtyj79zS0eKsnnGK@cluster0.wocqkj8.mongodb.net/codecampus" --collection=students ./data-export/codecampus/students.bson

# Courses import
mongorestore --uri="mongodb+srv://roushanydv2003_db_user:Qtyj79zS0eKsnnGK@cluster0.wocqkj8.mongodb.net/codecampus" --collection=course ./data-export/codecampus/course.bson

# Instructors import
mongorestore --uri="mongodb+srv://roushanydv2003_db_user:Qtyj79zS0eKsnnGK@cluster0.wocqkj8.mongodb.net/codecampus" --collection=instructor ./data-export/codecampus/instructor.bson

# Ya sab collections ek saath
mongorestore --uri="mongodb+srv://roushanydv2003_db_user:Qtyj79zS0eKsnnGK@cluster0.wocqkj8.mongodb.net/codecampus" ./data-export/codecampus
```

---

### Option 2: Sample Data Seed (Quick Testing)

Agar local data migrate nahi karna, to sample data seed kar sakte ho:

#### Step 1: Instructor ID Get Karo

**Pehle instructor account banao (register karo), phir:**
```bash
cd ~/Desktop/CodeCampus/server
node get-instructor-id.js instructor@email.com
```

**Output:** Instructor ID mil jayega

#### Step 2: Sample Students Add Karo

```bash
cd ~/Desktop/CodeCampus/server

# .env file mein production MongoDB URL set karo
# DB_CLUSTER_URL=mongodb+srv://roushanydv2003_db_user:Qtyj79zS0eKsnnGK@cluster0.wocqkj8.mongodb.net/codecampus
# DB_NAME=codecampus

node add-sample-students.js
```

**Output:**
- 50 sample students add honge
- Default password: `Student@123`
- Email format: `firstname.lastname.number@example.com`

#### Step 3: Sample Courses Add Karo

```bash
cd ~/Desktop/CodeCampus/server

# Instructor ID use karo (Step 1 se)
node add-sample-courses.js <instructorId>
```

**Output:**
- 20+ sample courses add honge
- Instructor ke courses honge

#### Step 4: Students Ko Courses Mein Enroll Karo

```bash
cd ~/Desktop/CodeCampus/server

# Instructor ID use karo
node enroll-students-to-courses.js <instructorId>
```

**Output:**
- Students randomly courses mein enroll honge
- Enrollment data create hoga

---

### Option 3: MongoDB Compass Use Karke (GUI Method)

#### Step 1: MongoDB Compass Install Karo
- Download: https://www.mongodb.com/try/download/compass
- Install karo

#### Step 2: Local Connection
1. MongoDB Compass open karo
2. Connect: `mongodb://127.0.0.1:27017`
3. Database: `codecampus`
4. Collections: `students`, `course`, `instructor`

#### Step 3: Data Export
1. Collection select karo (e.g., `students`)
2. **"Export Collection"** click karo
3. Format: JSON or CSV
4. Save karo

#### Step 4: Production Import
1. MongoDB Compass mein new connection:
   - Connection string: `mongodb+srv://roushanydv2003_db_user:Qtyj79zS0eKsnnGK@cluster0.wocqkj8.mongodb.net/codecampus`
2. Database: `codecampus`
3. Collection select karo
4. **"Import Data"** click karo
5. Exported file select karo
6. Import karo

---

## Quick Commands Summary

### Export Local Data
```bash
cd ~/Desktop/CodeCampus/server
mongodump --uri="mongodb://127.0.0.1:27017/codecampus" --out=./data-export
```

### Import to Production
```bash
cd ~/Desktop/CodeCampus/server
mongorestore --uri="mongodb+srv://roushanydv2003_db_user:Qtyj79zS0eKsnnGK@cluster0.wocqkj8.mongodb.net/codecampus" ./data-export/codecampus
```

### Seed Sample Data
```bash
cd ~/Desktop/CodeCampus/server

# Update .env with production MongoDB URL
# DB_CLUSTER_URL=mongodb+srv://roushanydv2003_db_user:Qtyj79zS0eKsnnGK@cluster0.wocqkj8.mongodb.net/codecampus
# DB_NAME=codecampus

# Get instructor ID first
node get-instructor-id.js your-instructor@email.com

# Then add sample data
node add-sample-students.js
node add-sample-courses.js <instructorId>
node enroll-students-to-courses.js <instructorId>
```

---

## Important Notes

1. **Database Name:**
   - Local: `codecampus`
   - Production: `codecampus`
   - Migration ke time database name change karna padega

2. **Connection String:**
   - Local: `mongodb://127.0.0.1:27017`
   - Production: `mongodb+srv://roushanydv2003_db_user:Qtyj79zS0eKsnnGK@cluster0.wocqkj8.mongodb.net/codecampus`

3. **Data Conflicts:**
   - Agar same email/mobile already hai, to skip ho jayega
   - Duplicate data add nahi hoga

4. **Enrollments:**
   - Enrollments `coursesEnrolled` field mein stored hain
   - Migration ke time automatically migrate ho jayenge

---

## Verification

**After Migration:**

1. **MongoDB Atlas Check:**
   - MongoDB Atlas dashboard → Database → Browse Collections
   - `students`, `course`, `instructor` collections check karo
   - Data count verify karo

2. **Website Test:**
   - Production website login karo
   - Dashboard check karo
   - Courses, students, enrollments dikhne chahiye

---

## Troubleshooting

**Issue: mongodump/mongorestore command not found**
```bash
# Install MongoDB tools
brew install mongodb-database-tools
```

**Issue: Connection failed**
- MongoDB Atlas network access check karo (`0.0.0.0/0` allow)
- Connection string verify karo
- Password correct hai?

**Issue: Data not showing**
- Browser cache clear karo
- Hard refresh karo (Cmd+Shift+R)
- MongoDB Atlas mein data verify karo

