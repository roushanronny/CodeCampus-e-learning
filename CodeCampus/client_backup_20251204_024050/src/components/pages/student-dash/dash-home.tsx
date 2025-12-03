import React, { useEffect, useState, useRef } from "react";
import { Tooltip, Typography, Card, CardBody, Button, Avatar, Chip } from "@material-tailwind/react";
import { 
  InformationCircleIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ClockIcon,
  FireIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { selectStudent } from "../../../redux/reducers/studentSlice";
import { getCourseByStudent } from "../../../api/endpoints/course/course";
import { CourseInterface } from "../../../types/course";
import { Link } from "react-router-dom";

type Props = {};

const DashHome: React.FC = (props: Props) => {
  const student = useSelector(selectStudent);
  const [weeklyGoal, setWeeklyGoal] = useState<string | null>(null);
  const [courses, setCourses] = useState<CourseInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchInProgress = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem("codecampus_weekly_goal");
    if (saved) {
      setWeeklyGoal(saved);
    }
  }, []);

  useEffect(() => {
    if (fetchInProgress.current) return;
    
    fetchInProgress.current = true;
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await getCourseByStudent();
        const coursesData = response.data || [];
        if (Array.isArray(coursesData)) {
          setCourses(coursesData);
        } else {
          setCourses([]);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
      } finally {
        setLoading(false);
        fetchInProgress.current = false;
      }
    };
    
    fetchCourses();
    
    return () => {
      fetchInProgress.current = false;
    };
  }, []);

  const handleSetGoal = () => {
    const current = weeklyGoal ?? "";
    const value = window.prompt("Set your weekly learning goal:", current);
    if (value && value.trim()) {
      const trimmed = value.trim();
      setWeeklyGoal(trimmed);
      localStorage.setItem("codecampus_weekly_goal", trimmed);
    }
  };

  // Calculate statistics
  const totalCourses = courses.length;
  const completedCourses = courses.filter((c: any) => c.completed).length; // Assuming completed field exists
  const inProgressCourses = totalCourses - completedCourses;
  const totalLessons = courses.reduce((sum: number, course: any) => sum + (course.lessonsCount || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Typography variant="h6" color="gray">
          Loading dashboard...
        </Typography>
      </div>
    );
  }

  return (
    <div className='w-full p-6 bg-gray-50 min-h-screen'>
      {/* Welcome Section */}
      <div className="mb-8">
        <Typography variant="h3" color="blue-gray" className="font-bold mb-2">
          Welcome back, {student.studentDetails?.firstName} {student.studentDetails?.lastName}! 👋
        </Typography>
        <Typography variant="paragraph" color="gray" className="text-sm">
          Here's your learning progress and upcoming courses
        </Typography>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Courses */}
        <Card className="shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="small" color="gray" className="mb-2 font-semibold">
                  Enrolled Courses
                </Typography>
                <Typography variant="h4" color="blue-gray" className="font-bold">
                  {totalCourses}
                </Typography>
                <Typography variant="small" color="gray" className="mt-2">
                  {inProgressCourses} in progress
                </Typography>
              </div>
              <div className="bg-blue-100 p-4 rounded-full">
                <BookOpenIcon className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Completed Courses */}
        <Card className="shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="small" color="gray" className="mb-2 font-semibold">
                  Completed
                </Typography>
                <Typography variant="h4" color="blue-gray" className="font-bold">
                  {completedCourses}
                </Typography>
                <Typography variant="small" color="gray" className="mt-2">
                  Courses finished
                </Typography>
              </div>
              <div className="bg-green-100 p-4 rounded-full">
                <AcademicCapIcon className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Total Lessons */}
        <Card className="shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="small" color="gray" className="mb-2 font-semibold">
                  Total Lessons
                </Typography>
                <Typography variant="h4" color="blue-gray" className="font-bold">
                  {totalLessons}
                </Typography>
                <Typography variant="small" color="gray" className="mt-2">
                  Available to learn
                </Typography>
              </div>
              <div className="bg-purple-100 p-4 rounded-full">
                <ClockIcon className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Learning Streak */}
        <Card className="shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="small" color="gray" className="mb-2 font-semibold">
                  Learning Streak
                </Typography>
                <Typography variant="h4" color="blue-gray" className="font-bold">
                  {weeklyGoal ? "🔥" : "0"}
                </Typography>
                <Typography variant="small" color="gray" className="mt-2">
                  {weeklyGoal ? "Goal set!" : "Set a goal to start"}
                </Typography>
              </div>
              <div className="bg-orange-100 p-4 rounded-full">
                <FireIcon className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Assignments / Goal Setting */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Assignments Card */}
          <Card className="shadow-lg border border-gray-200">
            <CardBody className="p-6">
              <div className="mb-4">
                <Typography variant="h5" color="blue-gray" className="font-bold mb-2">
                  MY ASSIGNMENTS
                </Typography>
              </div>
              {totalCourses === 0 ? (
                <div className='flex h-64 flex-col justify-center items-center text-center'>
                  <BookOpenIcon className="h-16 w-16 text-gray-300 mb-4" />
                  <Typography variant="h6" color="gray" className="mb-2">
                    There's nothing harder than starting from a blank canvas.
                  </Typography>
                  <Typography variant="small" color="gray" className="mb-4 max-w-md">
                    Set a goal and we'll be your accountability partner with custom reminders and weekly progress reports.
                  </Typography>
                  <Button
                    onClick={handleSetGoal}
                    className='bg-blue-500 hover:bg-blue-600'
                    size="md"
                  >
                    Set yourself a goal
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Typography variant="paragraph" color="gray">
                    You have {totalCourses} enrolled course{totalCourses !== 1 ? 's' : ''}. Continue learning to complete your assignments!
                  </Typography>
                  <Link to="/dashboard/my-courses">
                    <Button variant="outlined" color="blue" className="flex items-center gap-2">
                      View My Courses <ArrowRightIcon className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Recent Courses */}
          {courses.length > 0 && (
            <Card className="shadow-lg border border-gray-200">
              <CardBody className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <Typography variant="h5" color="blue-gray" className="font-bold">
                    Recent Courses
                  </Typography>
                  <Link to="/dashboard/my-courses">
                    <Button variant="text" size="sm" color="blue">View All</Button>
                  </Link>
                </div>
                <div className="space-y-4">
                  {courses.slice(0, 3).map((course: CourseInterface) => (
                    <Link key={course._id} to={`/courses/${course._id}`}>
                      <div className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <Avatar
                          src={course.thumbnailUrl || "https://via.placeholder.com/150/4F46E5/FFFFFF?text=Course"}
                          alt={course.title}
                          size="md"
                          className="object-cover"
                        />
                        <div className="flex-grow">
                          <Typography variant="h6" color="blue-gray">{course.title}</Typography>
                          <Typography variant="small" color="gray">
                            {course.category} • {course.duration} weeks
                          </Typography>
                        </div>
                        <Chip
                          variant="ghost"
                          size="sm"
                          value="Continue"
                          color="blue"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Weekly Goal Card */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg border border-gray-200 h-full">
            <CardBody className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Typography variant="h5" color="blue-gray" className="font-bold">
                  My Weekly Goal
                </Typography>
                <Tooltip
                  content={
                    <div className='w-80'>
                      <Typography color='white' className='font-medium'>
                        Info
                      </Typography>
                      <Typography
                        variant='small'
                        color='white'
                        className='font-normal opacity-80'
                      >
                        To achieve your goal for a day, complete any lectures, practice with a lab, or take a quiz or exam.
                      </Typography>
                    </div>
                  }
                >
                  <InformationCircleIcon
                    strokeWidth={2}
                    className='text-blue-gray-500 w-5 h-5 cursor-pointer'
                  />
                </Tooltip>
              </div>
              
              <div className='bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 mb-4 border border-blue-100'>
                {weeklyGoal ? (
                  <div>
                    <Typography variant="small" color="gray" className="mb-2">
                      Your current goal:
                    </Typography>
                    <Typography variant="h6" color="blue-gray" className="font-bold mb-3">
                      {weeklyGoal}
                    </Typography>
                    <Button
                      onClick={handleSetGoal}
                      variant="outlined"
                      size="sm"
                      color="blue"
                      className="w-full"
                    >
                      Update Goal
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <FireIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <Typography variant="small" color="gray" className="mb-4">
                      Make it a habit! Each day that you complete a lecture, practice with a lab, or take a quiz or exam you'll build your learning streak.
                    </Typography>
                    <Button
                      onClick={handleSetGoal}
                      className='bg-blue-500 hover:bg-blue-600 w-full'
                      size="md"
                    >
                      Set yourself a goal
                    </Button>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 space-y-2">
                <Typography variant="small" color="gray" className="font-semibold mb-2">
                  Quick Actions
                </Typography>
                <Link to="/dashboard/my-courses">
                  <Button variant="outlined" color="blue-gray" size="sm" fullWidth className="justify-start">
                    <BookOpenIcon className="h-4 w-4 mr-2" />
                    My Courses
                  </Button>
                </Link>
                <Link to="/dashboard/inbox">
                  <Button variant="outlined" color="blue-gray" size="sm" fullWidth className="justify-start">
                    <AcademicCapIcon className="h-4 w-4 mr-2" />
                    Inbox
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button variant="outlined" color="blue-gray" size="sm" fullWidth className="justify-start">
                    <ArrowRightIcon className="h-4 w-4 mr-2" />
                    Browse Courses
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashHome;
