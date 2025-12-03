import React, { useEffect, useState, useRef } from "react";
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/outline";
import {
  PencilIcon,
  UserPlusIcon,
  TrashIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { getCourseByInstructor } from "../../../api/endpoints/course/course";
import { formatDate } from "../../../utils/helpers";
import { Link } from "react-router-dom";
import usePagination from "../../../hooks/usePagination";
import useSearch from "../../../hooks/useSearch";

const TABS = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Monitored",
    value: "monitored",
  },
  {
    label: "Pending",
    value: "pending",
  },
];

const TABLE_HEAD = ["Course", "Category", "Price", "Students", "Rating", "Duration", "Status", "Added", "Actions"];

const ListCourseForInstructors: React.FC = () => {
  // const [courses, setCourses] = useState<
  //   GetCourseByInstructorInterface[] | null
  // >(null);
  const [courses, setCourses] = useState<any[]>(() => {
    try {
      return [];
    } catch (error) {
      console.error("Error initializing courses state:", error);
      return [];
    }
  });
  const [allCourses, setAllCourses] = useState<any[]>(() => {
    try {
      return [];
    } catch (error) {
      console.error("Error initializing allCourses state:", error);
      return [];
    }
  }); // Store all courses for filtering
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const {
    currentPage,
    totalPages,
    currentData,
    goToPage,
    goToPreviousPage,
    goToNextPage,
  } = usePagination(courses, 10);
  const searchResult = useSearch(courses, searchQuery);
  const fetchInProgress = useRef(false); // Prevent multiple simultaneous API calls
  
  const fetData = async () => {
    // Prevent multiple simultaneous calls
    if (fetchInProgress.current) {
      return;
    }
    
    fetchInProgress.current = true;
    
    try {
      const response = await getCourseByInstructor();
      const coursesData = response.data || [];
      
      // Validate that coursesData is an array
      if (Array.isArray(coursesData)) {
        setAllCourses(coursesData);
        setCourses(coursesData);
      } else {
        setAllCourses([]);
        setCourses([]);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setAllCourses([]);
      setCourses([]);
    } finally {
      fetchInProgress.current = false;
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchQuery(e.currentTarget.value);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchQuery(""); // Reset search when changing tabs
    
    let filteredCourses = [...allCourses];
    
    if (value === "monitored") {
      // Show only verified courses
      filteredCourses = allCourses.filter((course: any) => course.isVerified === true);
    } else if (value === "pending") {
      // Show only unverified/pending courses
      filteredCourses = allCourses.filter((course: any) => course.isVerified === false);
    }
    // else "all" - show all courses
    
    setCourses(filteredCourses);
  };

  const handleViewAll = () => {
    setActiveTab("all");
    setSearchQuery("");
    setFilterCategory(null);
    setSortConfig(null);
    setCourses(allCourses);
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedCourses = [...courses].sort((a: any, b: any) => {
      let aValue: any;
      let bValue: any;

      if (key === 'title' || key === 'course') {
        aValue = a.title?.toLowerCase() || '';
        bValue = b.title?.toLowerCase() || '';
      } else if (key === 'price') {
        aValue = a.isPaid ? (a.price || 0) : 0;
        bValue = b.isPaid ? (b.price || 0) : 0;
      } else if (key === 'category') {
        aValue = a.category?.toLowerCase() || '';
        bValue = b.category?.toLowerCase() || '';
      } else if (key === 'students' || key === 'enrollment') {
        aValue = a.enrollmentCount || 0;
        bValue = b.enrollmentCount || 0;
      } else if (key === 'rating') {
        aValue = a.rating || 0;
        bValue = b.rating || 0;
      } else if (key === 'duration') {
        aValue = a.duration || 0;
        bValue = b.duration || 0;
      } else if (key === 'status') {
        aValue = a.isVerified ? 1 : 0;
        bValue = b.isVerified ? 1 : 0;
      } else if (key === 'added' || key === 'created') {
        aValue = new Date(a.createdAt || 0).getTime();
        bValue = new Date(b.createdAt || 0).getTime();
      } else {
        return 0;
      }

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setCourses(sortedCourses);
  };

  const handleCategoryFilter = (category: string) => {
    if (filterCategory === category) {
      setFilterCategory(null);
      setCourses(allCourses);
    } else {
      setFilterCategory(category);
      const filtered = allCourses.filter((course: any) => course.category === category);
      setCourses(filtered);
    }
  };

  useEffect(() => {
    // Only fetch if not already in progress
    if (!fetchInProgress.current) {
      fetData();
    }
    
    // Cleanup function
    return () => {
      fetchInProgress.current = false;
    };
  }, []); // Empty dependency array - only run once on mount
  
  const displayData = searchQuery !== "" ? searchResult : currentData;

  return (
    <Card className='h-auto w-full mb-24 '>
      <CardHeader floated={false} shadow={false} className='rounded-none'>
        <div className='mb-8 flex items-center justify-between gap-8'>
          <div>
            <Typography variant='h5' color='blue-gray'>
              Course list
            </Typography>
            <Typography color='gray' className='mt-1 font-normal'>
              See information about all courses
            </Typography>
          </div>
          <div className='flex shrink-0 flex-col gap-2 sm:flex-row'>
            <Button variant='outlined' color='blue-gray' size='sm' onClick={handleViewAll}>
              view all
            </Button>
            <Link to="/instructors/add-course">
            <Button className='flex items-center gap-3' color='blue' size='sm'>
              <UserPlusIcon strokeWidth={2} className='h-4 w-4' /> Add course
            </Button>
            </Link>
          </div>
        </div>
        <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
          <Tabs value={activeTab} className='w-full md:w-max'>
            <TabsHeader>
              {TABS.map(({ label, value }) => (
                <Tab key={value} value={value} onClick={() => handleTabChange(value)}>
                  &nbsp;&nbsp;{label}&nbsp;&nbsp;
                </Tab>
              ))}
            </TabsHeader>
          </Tabs>
          <div className='w-full md:w-72'>
            <Input
              label='Search'
              value={searchQuery}
              onInput={handleSearch}
              icon={<MagnifyingGlassIcon className='h-5 w-5' />}
            />
          </div>
        </div>
      </CardHeader>
      <CardBody className='overflow-x-auto px-0'>
        <table className='mt-4 w-full min-w-max table-auto text-left'>
          <thead>
            <tr>
              {TABLE_HEAD.map((head, index) => {
                const isClickable = head !== "Actions";
                const sortKeyMap: { [key: string]: string } = {
                  "Course": "title",
                  "Category": "category",
                  "Price": "price",
                  "Students": "students",
                  "Rating": "rating",
                  "Duration": "duration",
                  "Status": "status",
                  "Added": "added"
                };
                const sortKey = sortKeyMap[head];
                const isSorted = sortConfig?.key === sortKey;
                
                return (
                  <th
                    key={head}
                    className={`border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors ${
                      isClickable ? 'cursor-pointer hover:bg-blue-gray-100' : ''
                    }`}
                    onClick={() => {
                      if (isClickable && sortKey) {
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
                      {isClickable && (
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
            {displayData.length > 0 ? (
              displayData.map(
                (
                  {
                    _id,
                    title,
                    thumbnailUrl,
                    description,
                    category,
                    createdAt,
                    isVerified,
                    price,
                    isPaid,
                    enrollmentCount,
                    rating,
                    duration,
                    level,
                  },
                  index
                ) => {
                  const isLast = index === displayData.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";
                  
                  // Format duration (assuming it's in minutes)
                  const formatDuration = (mins: number) => {
                    if (!mins) return "N/A";
                    const hours = Math.floor(mins / 60);
                    const minutes = mins % 60;
                    if (hours > 0) {
                      return `${hours}h ${minutes}m`;
                    }
                    return `${minutes}m`;
                  };

                  // Format price
                  const formatPrice = (price: number | undefined, isPaid: boolean) => {
                    if (!isPaid) return "Free";
                    if (!price) return "N/A";
                    return `$${price.toFixed(2)}`;
                  };

                  return (
                      <tr key={_id}>
                        <td className={classes}>
                          <Link to={`/instructors/edit-course/${_id}`} className='flex items-center gap-3 hover:opacity-80 transition-opacity'>
                            <Avatar 
                              src={
                                thumbnailUrl && thumbnailUrl.startsWith('http') 
                                  ? thumbnailUrl 
                                  : thumbnailUrl && !thumbnailUrl.includes('default_key')
                                    ? `http://localhost:4000${thumbnailUrl}`
                                    : "https://via.placeholder.com/150/4F46E5/FFFFFF?text=" + encodeURIComponent(title.substring(0, 2).toUpperCase())
                              } 
                              alt={title} 
                              size='sm'
                              onError={(e: any) => {
                                e.target.src = "https://via.placeholder.com/150/4F46E5/FFFFFF?text=" + encodeURIComponent(title.substring(0, 2).toUpperCase());
                              }}
                            />
                            <div className='flex flex-col'>
                              <Typography
                                variant='small'
                                color='blue-gray'
                                className='font-semibold hover:text-blue-600 cursor-pointer'
                              >
                                {title}
                              </Typography>
                              {description && (
                                <Typography
                                  variant='small'
                                  color='gray'
                                  className='font-normal text-xs line-clamp-1 max-w-xs'
                                >
                                  {description.substring(0, 50)}...
                                </Typography>
                              )}
                            </div>  
                          </Link>
                        </td>
                        <td className={classes}>
                          <div className='flex flex-col'>
                            <div
                              onClick={() => handleCategoryFilter(category || "")}
                              className='cursor-pointer inline-block'
                            >
                              <Chip
                                variant='outlined'
                                size='sm'
                                value={category || "Uncategorized"}
                                color={filterCategory === category ? 'blue' : 'blue-gray'}
                                className={`w-max hover:shadow-md transition-all ${filterCategory === category ? 'ring-2 ring-blue-500' : ''}`}
                              />
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant='small'
                            color='blue-gray'
                            className={`font-semibold cursor-pointer hover:text-blue-600 transition-colors ${sortConfig?.key === 'price' ? 'text-blue-600' : ''}`}
                            onClick={() => handleSort('price')}
                          >
                            {formatPrice(price, isPaid)}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <div className='flex items-center gap-1'>
                            <Typography
                              variant='small'
                              color='blue-gray'
                              className={`font-normal cursor-pointer hover:text-blue-600 transition-colors ${sortConfig?.key === 'students' ? 'text-blue-600 font-semibold' : ''}`}
                              onClick={() => handleSort('students')}
                            >
                              {enrollmentCount || 0}
                            </Typography>
                            <Typography
                              variant='small'
                              color='gray'
                              className='text-xs'
                            >
                              students
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className='flex items-center gap-1'>
                            <Typography
                              variant='small'
                              color='blue-gray'
                              className={`font-semibold cursor-pointer hover:text-blue-600 transition-colors ${sortConfig?.key === 'rating' ? 'text-blue-600' : ''}`}
                              onClick={() => handleSort('rating')}
                            >
                              {rating ? rating.toFixed(1) : "0.0"}
                            </Typography>
                            <span className='text-yellow-500'>★</span>
                          </div>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant='small'
                            color='blue-gray'
                            className={`font-normal cursor-pointer hover:text-blue-600 transition-colors ${sortConfig?.key === 'duration' ? 'text-blue-600 font-semibold' : ''}`}
                            onClick={() => handleSort('duration')}
                          >
                            {formatDuration(duration)}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <div 
                            className='w-max cursor-pointer'
                            onClick={() => handleSort('status')}
                          >
                            <Chip
                              variant='ghost'
                              size='sm'
                              value={isVerified ? "Verified" : "Pending"}
                              color={sortConfig?.key === 'status' ? 'blue' : (isVerified ? "green" : "orange")}
                              className={sortConfig?.key === 'status' ? 'ring-2 ring-blue-500' : ''}
                            />
                          </div>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant='small'
                            color='blue-gray'
                            className={`font-normal cursor-pointer hover:text-blue-600 transition-colors ${sortConfig?.key === 'added' ? 'text-blue-600 font-semibold' : ''}`}
                            onClick={() => handleSort('added')}
                          >
                            {formatDate(createdAt)}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <div className='flex items-center gap-1'>
                            <Tooltip content='Add lessons'>
                              <Link to={`/instructors/view-lessons/${_id}`}>
                                <IconButton variant='text' color='blue-gray' size='sm'>
                                  <SquaresPlusIcon className='h-4 w-4 text-blue-500' />
                                </IconButton>
                              </Link>
                            </Tooltip>
                            <Tooltip content='Edit course'>
                              <Link to={`/instructors/edit-course/${_id}`}>
                                <IconButton variant='text' color='blue-gray' size='sm'>
                                  <PencilIcon className='h-4 w-4' />
                                </IconButton>
                              </Link>
                            </Tooltip>
                            <Tooltip content='Delete course'>
                              <IconButton variant='text' color='blue-gray' size='sm'>
                                <TrashIcon className='h-4 w-4 text-red-500' />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    );
                }
              )
            ) : (
              <tr>
                <td className='p-4 text-center' colSpan={TABLE_HEAD.length}>
                  <div className='flex items-center justify-center gap-2'>
                    <ExclamationCircleIcon className='h-6 w-6 text-blue-gray-400' />
                    <Typography variant='body' color='blue-gray'>
                      No results found for your search query.
                    </Typography>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className='flex items-center justify-between border-t border-blue-gray-50 p-4'>
        <Typography variant='small' color='blue-gray' className='font-normal'>
          Page {currentPage} of {totalPages}
        </Typography>
        <div className='flex gap-2'>
          <Button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            variant='outlined'
            color='blue-gray'
            size='sm'
          >
            Previous
          </Button>
          <Button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            variant='outlined'
            color='blue-gray'
            size='sm'
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
export default ListCourseForInstructors;
