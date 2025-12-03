import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Avatar,
  IconButton
} from "@material-tailwind/react";
import { getMyStudents } from "../../../api/endpoints/instructor";
import { useState, useEffect } from "react";
import usePagination from "../../../hooks/usePagination";
import { formatDate } from "../../../utils/helpers";
import { toast } from "react-toastify";
import { Students } from "../../../api/types/student/student";
import { Link } from "react-router-dom";
const TABLE_HEAD = ["Student", "Course", "Status", "Joined"];

const MyStudents: React.FC = () => {
  const [students, setStudents] = useState<Students[]>(() => {
    try {
      return [];
    } catch (error) {
      console.error("Error initializing students state:", error);
      return [];
    }
  });
  const [allStudents, setAllStudents] = useState<Students[]>(() => {
    try {
      return [];
    } catch (error) {
      console.error("Error initializing allStudents state:", error);
      return [];
    }
  });
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const ITEMS_PER_PAGE = 5;  
  const {
    currentPage,
    totalPages,
    currentData,
    goToPage,
    goToNextPage,
    goToPreviousPage,
  } = usePagination(students, ITEMS_PER_PAGE);

  const fetchStudents = async () => {
    try {
      const response = await getMyStudents();
      const studentsData = response?.data?.data || response?.data || [];
      const studentsArray = Array.isArray(studentsData) ? studentsData : [];
      setAllStudents(studentsArray);
      setStudents(studentsArray);
    } catch (error) {
      toast.error("Something went wrong")
    }
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedStudents = [...students].sort((a: any, b: any) => {
      let aValue: any;
      let bValue: any;

      if (key === 'student' || key === 'name') {
        const aName = `${a.firstName || ''} ${a.lastName || ''}`.toLowerCase();
        const bName = `${b.firstName || ''} ${b.lastName || ''}`.toLowerCase();
        aValue = aName;
        bValue = bName;
      } else if (key === 'course') {
        aValue = (a.course || '').toLowerCase();
        bValue = (b.course || '').toLowerCase();
      } else if (key === 'status') {
        aValue = a.isBlocked ? 1 : 0;
        bValue = b.isBlocked ? 1 : 0;
      } else if (key === 'joined' || key === 'date') {
        aValue = new Date(a.dateJoined || 0).getTime();
        bValue = new Date(b.dateJoined || 0).getTime();
      } else {
        return 0;
      }

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setStudents(sortedStudents);
  };

  const handleSearch = (e: React.FormEvent<HTMLInputElement>) => {
    const query = e.currentTarget.value.toLowerCase();
    setSearchQuery(query);
    
    if (!query) {
      setStudents(allStudents);
      return;
    }

    const filtered = allStudents.filter((student: any) => {
      const fullName = `${student.firstName || ''} ${student.lastName || ''}`.toLowerCase();
      const email = (student.email || '').toLowerCase();
      const course = (student.course || '').toLowerCase();
      return fullName.includes(query) || email.includes(query) || course.includes(query);
    });
    
    setStudents(filtered);
  };

  useEffect(() => {
    fetchStudents();
  }, []);
  return (
    <div className='pb-10'>
      <Card className='h-full w-full'>
        <CardHeader floated={false} shadow={false} className='rounded-none'>
          <div className=' flex items-center justify-between gap-8'>
            <div>
              <Typography variant='h5' color='blue-gray'>
                Students list
              </Typography>
              <Typography color='gray' className='mt-1 font-normal'>
                See information about all students
              </Typography>
            </div>
            <div className='flex shrink-0 flex-col gap-2 sm:flex-row'>
              <Input
                label='Search'
                value={searchQuery}
                onInput={handleSearch}
                icon={<MagnifyingGlassIcon className='h-5 w-5' />}
              />
            </div>
          </div>
        </CardHeader>
        <CardBody className='overflow-scroll px-0'>
          <table className='mt-4 w-full min-w-max table-auto text-left'>
            <thead>
              <tr>
                {TABLE_HEAD.map((head, index) => {
                  const sortKeyMap: { [key: string]: string } = {
                    "Student": "student",
                    "Course": "course",
                    "Status": "status",
                    "Joined": "joined"
                  };
                  const sortKey = sortKeyMap[head];
                  const isSorted = sortConfig?.key === sortKey;
                  
                  return (
                    <th
                      key={head}
                      className={`border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 ${
                        sortKey ? 'cursor-pointer transition-colors hover:bg-blue-gray-100' : ''
                      }`}
                      onClick={() => {
                        if (sortKey) {
                          handleSort(sortKey);
                        }
                      }}
                    >
                      <Typography
                        variant='small'
                        color={isSorted ? 'blue' : 'blue-gray'}
                        className={`flex items-center justify-between gap-2 font-normal leading-none ${
                          isSorted ? 'opacity-100 font-semibold' : 'opacity-70'
                        }`}
                      >
                        {head}
                        {sortKey && (
                          <ChevronUpDownIcon
                            strokeWidth={2}
                            className={`h-4 w-4 transition-colors ${isSorted ? 'text-blue-600' : 'text-gray-400'}`}
                          />
                        )}
                      </Typography>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {currentData?.map(
                (
                  {
                    _id,
                    email,
                    firstName,
                    lastName,  
                    course,
                    courseId,
                    mobile,
                    isBlocked,
                    isGoogleUser,
                    dateJoined,
                    profileUrl,
                    profilePic
                  },
                  index
                ) => {
                  const isLast = index === students.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";
   
                  return (
                    <tr key={index}>
                      <td className={classes}>
                        <div className='flex items-center gap-3'>
                          <Avatar
                            src={isGoogleUser?profilePic?.url:profileUrl}
                            alt={"image"}  
                            size='sm'
                          />
                          <div className='flex flex-col'>
                            <Link
                              to={`/instructors/view-student/${_id}`}
                              className='hover:opacity-80 transition-opacity'
                              onClick={(e) => {
                                // Prevent sorting when clicking on name
                                e.stopPropagation();
                              }}
                            >
                              <Typography
                                variant='small'
                                color='blue-gray'
                                className={`font-normal hover:text-blue-600 transition-colors cursor-pointer ${sortConfig?.key === 'student' ? 'text-blue-600 font-semibold' : ''}`}
                              >
                                {firstName + " " + lastName}
                              </Typography>
                            </Link>
                            <Typography
                              variant='small'
                              color='blue-gray'
                              className='font-normal opacity-70'
                            >
                              {email}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className='flex flex-col'>
                          {courseId ? (
                            <Link
                              to={`/courses/${courseId}`}
                              className='hover:opacity-80 transition-opacity'
                              onClick={(e) => {
                                // Prevent sorting when clicking on course name
                                e.stopPropagation();
                              }}
                            >
                              <Typography
                                variant='small'
                                color='blue-gray'
                                className={`font-normal hover:text-blue-600 transition-colors cursor-pointer ${sortConfig?.key === 'course' ? 'text-blue-600 font-semibold' : ''}`}
                              >
                                {course}
                              </Typography>
                            </Link>
                          ) : (
                            <Typography
                              variant='small'
                              color='blue-gray'
                              className={`font-normal cursor-pointer hover:text-blue-600 transition-colors ${sortConfig?.key === 'course' ? 'text-blue-600 font-semibold' : ''}`}
                              onClick={() => handleSort('course')}
                            >
                              {course}
                            </Typography>
                          )}
                        </div>
                      </td>
                      <td className={classes}>
                        <div 
                          className='w-max cursor-pointer'
                          onClick={() => handleSort('status')}
                        >
                          <Chip
                            variant='ghost'
                            size='sm'
                            value={!isBlocked ? "active" : "blocked"}
                            color={sortConfig?.key === 'status' ? 'blue' : (isBlocked ? "red" : "green")}
                            className={sortConfig?.key === 'status' ? 'ring-2 ring-blue-500' : ''}
                          />
                        </div>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant='small'
                          color='blue-gray'
                          className={`font-normal cursor-pointer hover:text-blue-600 transition-colors ${sortConfig?.key === 'joined' ? 'text-blue-600 font-semibold' : ''}`}
                          onClick={() => handleSort('joined')}
                        >
                          {formatDate(dateJoined)}
                        </Typography>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className='flex items-center justify-between border-t border-blue-gray-50 p-4'>
        <Button
          variant='outlined'
          color='blue-gray'
          size='sm'
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <div className='flex items-center gap-2'>
          {Array.from({ length: Math.max(0, Math.min(totalPages || 1, 1000)) }, (_, index) => index + 1).map(
            (pageNumber) => (
              <IconButton
                key={pageNumber}
                variant={pageNumber === currentPage ? "outlined" : "text"}
                color='blue-gray'
                size='sm'
                onClick={() => goToPage(pageNumber)}
              >
                {pageNumber}
              </IconButton>
            )
          )}
        </div>
        <Button
          variant='outlined'
          color='blue-gray'
          size='sm'
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </CardFooter>
      </Card>
    </div>
  );
};

export default MyStudents;
