import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Button,
  Spinner,
} from "@material-tailwind/react";
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { formatDate } from "../../../utils/helpers";
import { getMyStudents } from "../../../api/endpoints/instructor";
import { Students } from "../../../api/types/student/student";

const ViewStudentProfile: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Students | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const response = await getMyStudents();
        const studentsData = response?.data?.data || response?.data || [];
        const studentsArray = Array.isArray(studentsData) ? studentsData : [];
        
        // Find the student by ID
        const foundStudent = studentsArray.find(
          (s: Students) => s._id === studentId
        );
        
        if (foundStudent) {
          setStudent(foundStudent);
        } else {
          toast.error("Student not found");
          navigate("/instructors/view-students");
        }
      } catch (error) {
        console.error("Error fetching student:", error);
        toast.error("Failed to load student profile");
        navigate("/instructors/view-students");
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchStudent();
    }
  }, [studentId, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Spinner className="h-12 w-12" />
        <Typography variant="h6" color="gray" className="ml-4">
          Loading student profile...
        </Typography>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Typography variant="h6" color="gray">
          Student not found
        </Typography>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Back Button */}
      <Button
        variant="text"
        color="blue-gray"
        className="mb-4 flex items-center gap-2"
        onClick={() => navigate("/instructors/view-students")}
      >
        <ArrowLeftIcon className="h-5 w-5" />
        Back to Students
      </Button>

      <div className="max-w-4xl mx-auto">
        {/* Profile Header Card */}
        <Card className="shadow-lg border border-gray-200 mb-6">
          <CardBody className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar
                src={
                  student.isGoogleUser
                    ? student.profilePic?.url
                    : student.profileUrl || "https://via.placeholder.com/150"
                }
                alt={`${student.firstName} ${student.lastName}`}
                size="xxl"
                className="border-4 border-white shadow-lg"
              />
              <div className="flex-grow text-center md:text-left">
                <Typography variant="h3" color="blue-gray" className="font-bold mb-2">
                  {student.firstName} {student.lastName}
                </Typography>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
                  <Chip
                    variant="ghost"
                    size="md"
                    value={student.isBlocked ? "Blocked" : "Active"}
                    color={student.isBlocked ? "red" : "green"}
                  />
                  {student.isGoogleUser && (
                    <Chip
                      variant="ghost"
                      size="md"
                      value="Google User"
                      color="blue"
                    />
                  )}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Details Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <Card className="shadow-lg border border-gray-200">
            <CardBody className="p-6">
              <Typography variant="h5" color="blue-gray" className="font-bold mb-4">
                Contact Information
              </Typography>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <EnvelopeIcon className="h-5 w-5 text-gray-500" />
                  <div>
                    <Typography variant="small" color="gray" className="font-semibold">
                      Email
                    </Typography>
                    <Typography variant="paragraph" color="blue-gray">
                      {student.email}
                    </Typography>
                  </div>
                </div>
                {student.mobile && (
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="h-5 w-5 text-gray-500" />
                    <div>
                      <Typography variant="small" color="gray" className="font-semibold">
                        Phone
                      </Typography>
                      <Typography variant="paragraph" color="blue-gray">
                        {student.mobile}
                      </Typography>
                    </div>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Account Information */}
          <Card className="shadow-lg border border-gray-200">
            <CardBody className="p-6">
              <Typography variant="h5" color="blue-gray" className="font-bold mb-4">
                Account Information
              </Typography>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CalendarDaysIcon className="h-5 w-5 text-gray-500" />
                  <div>
                    <Typography variant="small" color="gray" className="font-semibold">
                      Joined Date
                    </Typography>
                    <Typography variant="paragraph" color="blue-gray">
                      {formatDate(student.dateJoined)}
                    </Typography>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <AcademicCapIcon className="h-5 w-5 text-gray-500" />
                  <div>
                    <Typography variant="small" color="gray" className="font-semibold">
                      Account Type
                    </Typography>
                    <Typography variant="paragraph" color="blue-gray">
                      {student.isGoogleUser ? "Google Account" : "Email Account"}
                    </Typography>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Course Information */}
          {student.course && (
            <Card className="shadow-lg border border-gray-200 md:col-span-2">
              <CardBody className="p-6">
                <Typography variant="h5" color="blue-gray" className="font-bold mb-4">
                  Course Information
                </Typography>
                <div className="flex items-center gap-3">
                  <BookOpenIcon className="h-5 w-5 text-gray-500" />
                  <div>
                    <Typography variant="small" color="gray" className="font-semibold">
                      Enrolled Course
                    </Typography>
                    <Typography variant="paragraph" color="blue-gray">
                      {student.course}
                    </Typography>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewStudentProfile;

