import React, { useEffect, useState, useMemo } from "react";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  UserPlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  CardFooter,
  Avatar,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { formatDate } from "../../../utils/helpers";
import { getLessonsByCourse } from "../../../api/endpoints/course/lesson";
import { getIndividualCourse } from "../../../api/endpoints/course/course";
import { useParams } from "react-router-dom";
import { ApiResponseLessons } from "../../../api/types/apiResponses/api-response-instructors";
import AddLessonForm from "./add-lessons-form";
import { Link } from "react-router-dom";
import { LESSON_AVATAR } from "../../../constants/common";
import usePagination from "../../../hooks/usePagination";
import { toast } from "react-toastify";
  
const ViewLessons: React.FC = () => {
  // Initialize with empty arrays to prevent invalid array length errors
  const [lessons, setLessons] = useState<ApiResponseLessons[]>(() => {
    try {
      return [];
    } catch (error) {
      console.error("Error initializing lessons state:", error);
      return [];
    }
  });
  const [allLessons, setAllLessons] = useState<ApiResponseLessons[]>(() => {
    try {
      return [];
    } catch (error) {
      console.error("Error initializing allLessons state:", error);
      return [];
    }
  });
  const [course, setCourse] = useState<any>(null);
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { courseId } = useParams<{ courseId: string | undefined }>();

  const ITEMS_PER_PAGE = 10;
  
  // Filter lessons based on search query with safety checks
  const safeLessons = Array.isArray(lessons) ? lessons : [];
  const filteredLessons = searchQuery.trim() !== "" 
    ? safeLessons.filter((lesson) => {
        if (!lesson) return false;
        const query = searchQuery.toLowerCase();
        return (
          lesson.title?.toLowerCase().includes(query) ||
          lesson.description?.toLowerCase().includes(query)
        );
      })
    : safeLessons;

  // Ensure filteredLessons is always a valid array before passing to usePagination
  const safeFilteredLessons = useMemo(() => {
    try {
      if (!Array.isArray(filteredLessons)) return [];
      // Additional validation: ensure all items are valid objects
      return filteredLessons.filter((lesson: any) => 
        lesson && 
        typeof lesson === 'object' && 
        lesson !== null &&
        !Array.isArray(lesson) // Ensure it's not an array masquerading as an object
      );
    } catch (error) {
      console.error("Error validating filteredLessons:", error);
      return [];
    }
  }, [filteredLessons]);

  const {
    currentPage,
    totalPages,
    currentData,
    goToPage,
    goToNextPage,
    goToPreviousPage,
  } = usePagination(safeFilteredLessons, ITEMS_PER_PAGE);

  const fetchCourseDetails = async (courseId: string) => {
    try {
      const response = await getIndividualCourse(courseId);
      const courseData = response?.data?.data || response?.data;
      setCourse(courseData);
    } catch (error) {
      console.error("Error fetching course details:", error);
    }
  };

  const fetchData = async (courseId: string) => {
    try {
      setLoading(true);
      const response = await getLessonsByCourse(courseId);
      const lessonsData = response?.data;
      
      // Comprehensive safety checks to prevent invalid array length errors
      let lessonsArray: ApiResponseLessons[] = [];
      if (Array.isArray(lessonsData)) {
        // Filter out any invalid entries that might cause issues
        lessonsArray = lessonsData.filter((lesson: any) => 
          lesson && 
          typeof lesson === 'object' && 
          lesson !== null &&
          !Number.isNaN(lesson)
        );
      }
      
      setAllLessons(lessonsArray);
      setLessons(lessonsArray);
    } catch (error) {
      toast.error("Failed to load lessons");
      console.error("Error fetching lessons:", error);
      setLessons([]);
      setAllLessons([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchQuery(e.currentTarget.value);
  };

  const handleViewAll = () => {
    setSearchQuery("");
    setLessons(allLessons);
  };

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails(courseId);
      fetchData(courseId);
    }
  }, [courseId]);

  // Refresh lessons when form is closed (after adding a lesson)
  useEffect(() => {
    if (!formVisible && courseId) {
      fetchData(courseId);
    }
  }, [formVisible, courseId]);

  const displayData = currentData;

  return (
    <Card className='h-auto w-full mb-24'>
      <CardHeader floated={false} shadow={false} className='rounded-none'>
        <div className='mb-8 flex items-center justify-between gap-8'>
          <div>
            <Typography variant='h5' color='blue-gray' className='font-bold'>
              {course?.title || "Course name"}
            </Typography>
            <Typography color='gray' className='mt-1 font-normal'>
              {course?.description || "about the course"}
            </Typography>
          </div>
          <div className='flex shrink-0 flex-col gap-2 sm:flex-row'>
            <Button 
              variant='outlined' 
              color='blue-gray' 
              size='sm'
              onClick={handleViewAll}
            >
              view all
            </Button>
            <Button
              onClick={() => {
                setFormVisible(!formVisible);
              }}
              className='flex items-center gap-3'
              color='blue'
              size='sm'
            >
              {!formVisible ? (
                <UserPlusIcon strokeWidth={2} className='h-4 w-4' />
              ) : (
                ""
              )}
              {formVisible ? "View lessons" : "Add lessons"}
            </Button>
          </div>
        </div>
        <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
          <div className='w-full md:w-72'>
            <Input
              label='Search lessons'
              value={searchQuery}
              onInput={handleSearch}
              icon={<MagnifyingGlassIcon className='h-5 w-5' />}
            />
          </div>
        </div>  
      </CardHeader>
      {formVisible ? (
        <AddLessonForm />
      ) : (
        <>
          <CardBody className='overflow-scroll px-0'>
            {loading ? (
              <div className='flex items-center justify-center p-8'>
                <Typography variant='small' color='gray'>
                  Loading lessons...
                </Typography>
              </div>
            ) : displayData && displayData.length > 0 ? (
              <ul className='mt-4 w-full min-w-max text-left'>
                {displayData.map(
                  (
                    lesson: ApiResponseLessons,
                    index
                  ) => {
                    const { _id, title, description, createdAt, media } = lesson;
                    
                    // Extract thumbnail and videoUrl from media array
                    const thumbnailMedia = media?.find(m => 
                      m.name?.toLowerCase().includes('thumbnail') || 
                      m.name?.toLowerCase().includes('image') ||
                      m.key?.toLowerCase().includes('thumbnail')
                    );
                    const videoMedia = media?.find(m => 
                      m.name?.toLowerCase().includes('video') || 
                      m.name?.toLowerCase().includes('lessonvideo') ||
                      m.key?.toLowerCase().includes('video')
                    );
                    
                    // Get thumbnail URL - prefer direct thumbnail, then media array, then fallback
                    const thumbnailUrl = lesson.thumbnail || 
                      (thumbnailMedia?.url ? 
                        (thumbnailMedia.url.startsWith('http') ? thumbnailMedia.url : `http://localhost:4000${thumbnailMedia.url}`) : 
                        null) ||
                      (thumbnailMedia?.key ? 
                        `http://localhost:4000/uploads/${thumbnailMedia.key}` : 
                        null);
                    
                    // Get video URL
                    const videoUrl = lesson.videoUrl || 
                      (videoMedia?.url ? 
                        (videoMedia.url.startsWith('http') ? videoMedia.url : `http://localhost:4000${videoMedia.url}`) : 
                        null) ||
                      (videoMedia?.key ? 
                        `http://localhost:4000/uploads/${videoMedia.key}` : 
                        null);
                    
                    const isLast = index === displayData.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";
                    return (
                      <li key={_id} className={`flex items-center ${classes} hover:bg-gray-50 transition-colors`}>
                        <Avatar 
                          src={thumbnailUrl || LESSON_AVATAR} 
                          alt={title} 
                          size='md'
                          className='mr-4'
                          onError={(e: any) => {
                            e.target.src = LESSON_AVATAR;
                          }}
                        />
                        <div className='flex flex-col flex-grow ml-3 mr-8'>
                          <div className='flex items-center gap-3 mb-1'>
                            <Typography
                              variant='small'
                              color='blue-gray'
                              className='font-semibold'
                            >
                              {title}
                            </Typography>
                          </div>
                          {description && (
                            <Typography
                              variant='small'
                              color='gray'
                              className='font-normal opacity-70 line-clamp-2'
                            >
                              {description}
                            </Typography>
                          )}
                        </div>
                        <div className='flex items-center mr-8'>
                          <Typography
                            variant='small'
                            color='blue-gray'
                            className='font-normal text-xs'
                          >
                            {formatDate(createdAt)}
                          </Typography>
                        </div>
                        <div className='flex items-center mr-6 gap-2'>
                          <Tooltip content='Edit lesson'>
                            <Link to={`/instructors/view-lessons/${courseId}/edit-lesson/${_id}`}>
                              <IconButton variant='text' color='blue-gray' size='sm'>
                                <PencilIcon className='h-4 w-4' />
                              </IconButton>
                            </Link>
                          </Tooltip>
                          <Tooltip content='Delete lesson'>
                            <IconButton variant='text' color='blue-gray' size='sm'>
                              <TrashIcon className='h-4 w-4 text-red-500' />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </li>
                    );
                  }
                )}
              </ul>
            ) : (
              <div className='flex items-center justify-center p-8'>
                <div className='text-center'>
                  <Typography variant='h6' color='gray' className='mb-2'>
                    No lessons found
                  </Typography>
                  <Typography variant='small' color='gray' className='mb-4'>
                    {searchQuery ? "No lessons match your search" : "Start by adding your first lesson"}
                  </Typography>
                  {!searchQuery && (
                    <Button
                      onClick={() => setFormVisible(true)}
                      color='blue'
                      size='sm'
                      className='flex items-center gap-2'
                    >
                      <UserPlusIcon className='h-4 w-4' />
                      Add First Lesson
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardBody>
          {!formVisible && filteredLessons.length > 0 && (
            <CardFooter className='flex items-center justify-between border-t border-blue-gray-50 p-4'>
              <Typography
                variant='small'
                color='blue-gray'
                className='font-normal'
              >
                Page {currentPage} of {totalPages} ({filteredLessons.length} {searchQuery ? 'found' : 'total'} lessons)
              </Typography>
              <div className='flex gap-2'>
                <Button 
                  variant='outlined' 
                  color='blue-gray' 
                  size='sm'
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button 
                  variant='outlined' 
                  color='blue-gray' 
                  size='sm'
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </CardFooter>
          )}
        </>
      )}
    </Card>
  );
};

export default ViewLessons;
