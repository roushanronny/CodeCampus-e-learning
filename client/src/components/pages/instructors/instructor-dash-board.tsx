import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Typography, Card, CardBody, Button, Chip, Avatar } from "@material-tailwind/react";
import {
  BookOpenIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { getInstructorDetails } from "../../../api/endpoints/instructor";
import { getCourseByInstructor } from "../../../api/endpoints/course/course";
import { getMyStudents } from "../../../api/endpoints/instructor";
import { InstructorApiResponse } from "../../../api/types/apiResponses/api-response-instructors";
import { GetCourseByInstructorInterface } from "../../../api/types/apiResponses/api-response-instructors";
import { toast } from "react-toastify";
import { formatDate } from "../../../utils/helpers";
import { USER_AVATAR } from "../../../constants/common";

const InstructorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [instructor, setInstructor] = useState<InstructorApiResponse | null>(null);
  const [courses, setCourses] = useState<GetCourseByInstructorInterface[]>(() => {
    try {
      return [];
    } catch (error) {
      console.error("Error initializing courses state:", error);
      return [];
    }
  });
  const [students, setStudents] = useState<any[]>(() => {
    try {
      return [];
    } catch (error) {
      console.error("Error initializing students state:", error);
      return [];
    }
  });
  const [loading, setLoading] = useState(true);
  const fetchInProgress = useRef(false); // Prevent multiple simultaneous API calls

  useEffect(() => {
    // Only fetch if not already in progress
    if (!fetchInProgress.current) {
      fetchDashboardData();
    }
    
    // Cleanup function
    return () => {
      fetchInProgress.current = false;
    };
  }, []);

  const fetchDashboardData = async () => {
    // Prevent multiple simultaneous calls
    if (fetchInProgress.current) {
      return;
    }
    
    fetchInProgress.current = true;
    
    try {
      setLoading(true);
      
      // Fetch instructor details
      const instructorResponse = await getInstructorDetails();
      setInstructor(instructorResponse?.data?.data || instructorResponse?.data);

      // Fetch courses
      const coursesResponse = await getCourseByInstructor();
      const coursesData = coursesResponse?.data || [];
      setCourses(Array.isArray(coursesData) ? coursesData : []);

      // Fetch students
      try {
        const studentsResponse = await getMyStudents();
        console.log("Students API Response:", studentsResponse);
        // Response structure: { status: 'success', message: '...', data: students[] }
        // getMyStudentsService returns response.data, so studentsResponse is already the data object
        const studentsData = studentsResponse?.data || studentsResponse || [];
        const studentsArray = Array.isArray(studentsData) ? studentsData : [];
        console.log("Processed students count:", studentsArray.length);
        console.log("Sample student:", studentsArray[0]);
        setStudents(studentsArray);
      } catch (error: any) {
        console.error("Error fetching students:", error);
        // Don't show error toast for students, just log it
        console.log("Students data not available or error occurred");
        setStudents([]);
      }
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      toast.error(error?.data?.message || "Failed to load dashboard data", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } finally {
      setLoading(false);
      fetchInProgress.current = false;
    }
  };

  // Calculate statistics
  const totalCourses = courses.length;
  const verifiedCourses = courses.filter((c) => c.isVerified).length;
  const pendingCourses = courses.filter((c) => !c.isVerified).length;
  const totalStudents = students.length;
  const totalEnrollments = courses.reduce((sum, course) => sum + (course.enrollmentCount || 0), 0);
  const totalRevenue = courses
    .filter((c) => c.isPaid && c.isVerified)
    .reduce((sum, course) => sum + (course.price || 0) * (course.enrollmentCount || 0), 0);

  // Get recent courses (last 5)
  const recentCourses = courses.slice(0, 5);

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
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      {/* Welcome Section */}
      <div className="mb-8">
        <Typography variant="h3" color="blue-gray" className="font-bold mb-2">
          Welcome back, {instructor?.firstName} {instructor?.lastName}! 👋
        </Typography>
        <Typography variant="paragraph" color="gray" className="text-sm">
          Here's what's happening with your courses today
        </Typography>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Courses */}
        <div 
          className="bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-all hover:border-blue-500 hover:scale-105 h-full cursor-pointer"
          onClick={() => navigate("/instructors/view-course")}
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="small" color="gray" className="mb-2 font-semibold">
                  Total Courses
                </Typography>
                <Typography variant="h4" color="blue-gray" className="font-bold">
                  {totalCourses}
                </Typography>
                <Typography variant="small" color="gray" className="mt-2">
                  {verifiedCourses} verified, {pendingCourses} pending
                </Typography>
              </div>
              <div className="bg-blue-100 p-4 rounded-full">
                <BookOpenIcon className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Total Students */}
        <div 
          className="bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-all hover:border-green-500 hover:scale-105 h-full cursor-pointer"
          onClick={() => navigate("/instructors/view-students")}
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="small" color="gray" className="mb-2 font-semibold">
                  Total Students
                </Typography>
                <Typography variant="h4" color="blue-gray" className="font-bold">
                  {totalStudents}
                </Typography>
                <Typography variant="small" color="gray" className="mt-2">
                  Across all courses
                </Typography>
              </div>
              <div className="bg-green-100 p-4 rounded-full">
                <UserGroupIcon className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Total Enrollments */}
        <div 
          className="bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-all hover:border-purple-500 hover:scale-105 h-full cursor-pointer"
          onClick={() => navigate("/instructors/view-students")}
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="small" color="gray" className="mb-2 font-semibold">
                  Total Enrollments
                </Typography>
                <Typography variant="h4" color="blue-gray" className="font-bold">
                  {totalEnrollments}
                </Typography>
                <Typography variant="small" color="gray" className="mt-2">
                  All time enrollments
                </Typography>
              </div>
              <div className="bg-purple-100 p-4 rounded-full">
                <UserGroupIcon className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div 
          className="bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-all hover:border-yellow-500 hover:scale-105 h-full cursor-pointer"
          onClick={() => navigate("/instructors/view-course")}
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="small" color="gray" className="mb-2 font-semibold">
                  Total Revenue
                </Typography>
                <Typography variant="h4" color="blue-gray" className="font-bold">
                  ${totalRevenue.toFixed(2)}
                </Typography>
                <Typography variant="small" color="gray" className="mt-2">
                  From paid courses
                </Typography>
              </div>
              <div className="bg-yellow-100 p-4 rounded-full">
                <CurrencyDollarIcon className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Courses Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Courses */}
        <Card className="lg:col-span-2 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Typography variant="h5" color="blue-gray" className="font-bold">
                Recent Courses
              </Typography>
              <Link to="/instructors/view-course">
                <Button variant="text" size="sm" className="flex items-center gap-2">
                  View All
                  <ArrowRightIcon className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {recentCourses.length > 0 ? (
              <div className="space-y-4">
                {recentCourses.map((course) => (
                  <div
                    key={course._id}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Avatar
                      src={course.thumbnailUrl || "https://via.placeholder.com/60"}
                      alt={course.title}
                      size="md"
                      className="rounded-lg"
                    />
                    <div className="flex-1">
                      <Typography variant="h6" color="blue-gray" className="font-semibold text-sm">
                        {course.title}
                      </Typography>
                      <div className="flex items-center gap-2 mt-1">
                        <Chip
                          size="sm"
                          value={course.isVerified ? "Verified" : "Pending"}
                          color={course.isVerified ? "green" : "orange"}
                          variant="ghost"
                        />
                        <Typography variant="small" color="gray" className="text-xs">
                          {course.enrollmentCount || 0} students
                        </Typography>
                      </div>
                    </div>
                    <Link to={`/instructors/view-lessons/${course._id}`}>
                      <Button variant="text" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpenIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <Typography variant="paragraph" color="gray">
                  No courses yet. Create your first course!
                </Typography>
                <Link to="/instructors/add-course" className="mt-4 inline-block">
                  <Button color="blue" size="sm">
                    Add Course
                  </Button>
                </Link>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
          <CardBody className="p-6">
            <Typography variant="h5" color="blue-gray" className="font-bold mb-6">
              Quick Actions
            </Typography>
            <div className="space-y-3">
              <Link to="/instructors/add-course">
                <Button
                  color="blue"
                  fullWidth
                  className="flex items-center justify-center gap-2"
                >
                  <BookOpenIcon className="h-5 w-5" />
                  Add New Course
                </Button>
              </Link>
              <Link to="/instructors/view-course">
                <Button
                  variant="outlined"
                  color="blue-gray"
                  fullWidth
                  className="flex items-center justify-center gap-2"
                >
                  <BookOpenIcon className="h-5 w-5" />
                  View All Courses
                </Button>
              </Link>
              <Link to="/instructors/view-students">
                <Button
                  variant="outlined"
                  color="blue-gray"
                  fullWidth
                  className="flex items-center justify-center gap-2"
                >
                  <UserGroupIcon className="h-5 w-5" />
                  My Students
                </Button>
              </Link>
              <Link to="/instructors/view-channels">
                <Button
                  variant="outlined"
                  color="blue-gray"
                  fullWidth
                  className="flex items-center justify-center gap-2"
                >
                  <UserGroupIcon className="h-5 w-5" />
                  Channels
                </Button>
              </Link>
            </div>

            {/* Status Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <Typography variant="small" color="gray" className="mb-3 font-semibold">
                Account Status
              </Typography>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {instructor?.isVerified ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircleIcon className="h-5 w-5 text-orange-500" />
                  )}
                  <Typography variant="small" color="gray">
                    {instructor?.isVerified ? "Verified" : "Pending Verification"}
                  </Typography>
                </div>
                {instructor?.dateJoined && (
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-5 w-5 text-gray-400" />
                    <Typography variant="small" color="gray">
                      Joined {formatDate(instructor.dateJoined)}
                    </Typography>
                  </div>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default InstructorDashboard;
