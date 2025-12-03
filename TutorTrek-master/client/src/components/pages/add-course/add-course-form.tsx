import React, { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from "formik";
import { AddCourseValidationSchema } from "../../../validations/course/AddCourse";
import { Switch, Card, CardHeader, CardBody, Typography, Button, Input } from "@material-tailwind/react";
import { addCourse } from "../../../api/endpoints/course/course";
import { toast } from "react-toastify";
import { getAllCategories } from "../../../api/endpoints/category";
import { ApiResponseCategory } from "../../../api/types/apiResponses/api-response-category";
import { 
  BookOpenIcon, 
  ClockIcon, 
  TagIcon, 
  CurrencyDollarIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  PhotoIcon,
  AcademicCapIcon
} from "@heroicons/react/24/outline";
interface CourseFormValues {
  title: string;
  duration: string;
  category: string;
  level: string;
  tags: string;
  about: string;
  description: string;
  syllabus: string;
  requirements: string;
  price: string;
  [key: string]: string;
}

const initialValues = {
  title: "",
  duration: "",
  category: "",
  level: "",
  tags: "",
  about: "",
  description: "",
  syllabus: "",
  requirements: "",
  price: "",
};

const CombinedForm: React.FC = () => {
  const [paid, setPaid] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [guidelines, setGuidelines] = useState<File | null>(null);
  const [introduction,setIntroduction] = useState<File | null>(null)
  const [categories, setCategories] = useState<ApiResponseCategory[] | null>(
    null
  );

  const handleFormSubmit = async (
    values: CourseFormValues,
    { resetForm }: FormikHelpers<CourseFormValues>
  ) => {
    try {
      const formData = new FormData();
      // Only append files if they are provided (optional)
      if (guidelines) formData.append("files", guidelines);
      if (thumbnail) formData.append("files", thumbnail);
      if (introduction) formData.append("files", introduction);
      
      // Convert duration to number and ensure isPaid is boolean
      const processedValues = {
        ...values,
        duration: values.duration ? Number(values.duration) : 0,
        isPaid: paid,
        price: paid && values.price ? Number(values.price) : 0,
      };
      
      Object.keys(processedValues).forEach((key) => {
        const value = processedValues[key as keyof typeof processedValues];
        if (value !== null && value !== undefined && value !== '') {
          formData.append(key, typeof value === 'boolean' ? String(value) : String(value));
        }
      });
      
      const response = await addCourse(formData);
      toast.success(response.data.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      resetForm();
      setGuidelines(null)
      setThumbnail(null)
      setIntroduction(null)
    } catch (error: any) {
      toast.error(error.data.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response.data);
    } catch (error) {
      toast.error("something went wrong");
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handlePaid = () => {
    setPaid(!paid);
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='mb-8'>
          <Typography variant='h3' color='blue-gray' className='font-bold mb-2'>
            Create New Course
          </Typography>
          <Typography variant='paragraph' color='gray' className='text-sm'>
            Fill in the details below to create and publish your course
          </Typography>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={AddCourseValidationSchema}
          onSubmit={handleFormSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className='space-y-6'>
                {/* Basic Information Section */}
                <Card className='shadow-lg'>
                  <CardHeader floated={false} shadow={false} className='rounded-t-lg bg-gradient-to-r from-blue-500 to-blue-700'>
                    <div className='flex items-center gap-3'>
                      <AcademicCapIcon className='h-6 w-6 text-white' />
                      <Typography variant='h5' color='white' className='font-semibold'>
                        Basic Information
                      </Typography>
                    </div>
                  </CardHeader>
                  <CardBody className='p-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      {/* Title */}
                      <div>
                        <label
                          htmlFor='title'
                          className='block text-sm font-semibold text-gray-700 mb-2'
                        >
                          <BookOpenIcon className='h-4 w-4 inline mr-1' />
                          Course Title *
                        </label>
                        <Field
                          type='text'
                          id='title'
                          name='title'
                          placeholder='e.g., Complete React Development Bootcamp'
                          className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                        />
                        <ErrorMessage
                          name='title'
                          component='div'
                          className='text-red-500 text-sm mt-1'
                        />
                      </div>

                      {/* Duration */}
                      <div>
                        <label
                          htmlFor='duration'
                          className='block text-sm font-semibold text-gray-700 mb-2'
                        >
                          <ClockIcon className='h-4 w-4 inline mr-1' />
                          Duration (minutes) *
                        </label>
                        <Field
                          type='number'
                          id='duration'
                          name='duration'
                          placeholder='e.g., 750'
                          min='1'
                          className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                        />
                        <small className='text-gray-500 text-xs mt-1 block'>
                          Total course duration in minutes (750 = 12h 30m)
                        </small>
                        <ErrorMessage
                          name='duration'
                          component='div'
                          className='text-red-500 text-sm mt-1'
                        />
                      </div>

                      {/* Category */}
                      <div>
                        <label
                          htmlFor='category'
                          className='block text-sm font-semibold text-gray-700 mb-2'
                        >
                          Category *
                        </label>
                        <Field
                          as='select'
                          id='category'
                          name='category'
                          className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white'
                        >
                          <option value=''>Select a category</option>
                          {categories?.map(({ _id, name }) => (
                            <option key={_id} value={name}>
                              {name}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name='category'
                          component='div'
                          className='text-red-500 text-sm mt-1'
                        />
                      </div>

                      {/* Level */}
                      <div>
                        <label
                          htmlFor='level'
                          className='block text-sm font-semibold text-gray-700 mb-2'
                        >
                          Difficulty Level *
                        </label>
                        <Field
                          as='select'
                          id='level'
                          name='level'
                          className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white'
                        >
                          <option value=''>Select level</option>
                          <option value='easy'>Easy</option>
                          <option value='medium'>Medium</option>
                          <option value='hard'>Hard</option>
                        </Field>
                        <ErrorMessage
                          name='level'
                          component='div'
                          className='text-red-500 text-sm mt-1'
                        />
                      </div>

                      {/* Tags */}
                      <div className='md:col-span-2'>
                        <label
                          htmlFor='tags'
                          className='block text-sm font-semibold text-gray-700 mb-2'
                        >
                          <TagIcon className='h-4 w-4 inline mr-1' />
                          Tags *
                        </label>
                        <Field
                          type='text'
                          id='tags'
                          name='tags'
                          placeholder='e.g., React, JavaScript, Frontend (comma-separated)'
                          className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                        />
                        <small className='text-gray-500 text-xs mt-1 block'>
                          Separate multiple tags with commas
                        </small>
                        <ErrorMessage
                          name='tags'
                          component='div'
                          className='text-red-500 text-sm mt-1'
                        />
                      </div>

                      {/* Pricing */}
                      <div className='md:col-span-2'>
                        <div className='flex items-center gap-3 mb-3'>
                          <Switch
                            id='paid-course'
                            checked={paid}
                            onChange={handlePaid}
                            label={
                              <Typography variant='small' className='font-semibold text-gray-700'>
                                <CurrencyDollarIcon className='h-4 w-4 inline mr-1' />
                                Paid Course
                              </Typography>
                            }
                          />
                        </div>
                        {paid && (
                          <div>
                            <label
                              htmlFor='price'
                              className='block text-sm font-semibold text-gray-700 mb-2'
                            >
                              Price ($) *
                            </label>
                            <Field
                              type='number'
                              id='price'
                              name='price'
                              placeholder='e.g., 49.99'
                              min='0'
                              step='0.01'
                              className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                            />
                            <ErrorMessage
                              name='price'
                              component='div'
                              className='text-red-500 text-sm mt-1'
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Course Content Section */}
                <Card className='shadow-lg'>
                  <CardHeader floated={false} shadow={false} className='rounded-t-lg bg-gradient-to-r from-purple-500 to-purple-700'>
                    <div className='flex items-center gap-3'>
                      <BookOpenIcon className='h-6 w-6 text-white' />
                      <Typography variant='h5' color='white' className='font-semibold'>
                        Course Content
                      </Typography>
                    </div>
                  </CardHeader>
                  <CardBody className='p-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      {/* About */}
                      <div className='md:col-span-2'>
                        <label
                          htmlFor='about'
                          className='block text-sm font-semibold text-gray-700 mb-2'
                        >
                          About Course *
                        </label>
                        <Field
                          as='textarea'
                          id='about'
                          name='about'
                          rows={4}
                          placeholder='Brief overview of your course...'
                          className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none'
                        />
                        <ErrorMessage
                          name='about'
                          component='div'
                          className='text-red-500 text-sm mt-1'
                        />
                      </div>

                      {/* Description */}
                      <div className='md:col-span-2'>
                        <label
                          htmlFor='description'
                          className='block text-sm font-semibold text-gray-700 mb-2'
                        >
                          Detailed Description *
                        </label>
                        <Field
                          as='textarea'
                          id='description'
                          name='description'
                          rows={5}
                          placeholder='Provide a detailed description of what students will learn...'
                          className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none'
                        />
                        <ErrorMessage
                          name='description'
                          component='div'
                          className='text-red-500 text-sm mt-1'
                        />
                      </div>

                      {/* Syllabus */}
                      <div>
                        <label
                          htmlFor='syllabus'
                          className='block text-sm font-semibold text-gray-700 mb-2'
                        >
                          Syllabus *
                        </label>
                        <Field
                          as='textarea'
                          id='syllabus'
                          name='syllabus'
                          rows={6}
                          placeholder='Enter topics separated by commas (e.g., Introduction, Basics, Advanced)'
                          className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none'
                        />
                        <small className='text-gray-500 text-xs mt-1 block'>
                          Separate topics with commas
                        </small>
                        <ErrorMessage
                          name='syllabus'
                          component='div'
                          className='text-red-500 text-sm mt-1'
                        />
                      </div>

                      {/* Requirements */}
                      <div>
                        <label
                          htmlFor='requirements'
                          className='block text-sm font-semibold text-gray-700 mb-2'
                        >
                          Requirements
                        </label>
                        <Field
                          as='textarea'
                          id='requirements'
                          name='requirements'
                          rows={6}
                          placeholder='What students need to know before taking this course...'
                          className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none'
                        />
                        <small className='text-gray-500 text-xs mt-1 block'>
                          Separate requirements with commas
                        </small>
                        <ErrorMessage
                          name='requirements'
                          component='div'
                          className='text-red-500 text-sm mt-1'
                        />
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Media Files Section */}
                <Card className='shadow-lg'>
                  <CardHeader floated={false} shadow={false} className='rounded-t-lg bg-gradient-to-r from-green-500 to-green-700'>
                    <div className='flex items-center gap-3'>
                      <VideoCameraIcon className='h-6 w-6 text-white' />
                      <Typography variant='h5' color='white' className='font-semibold'>
                        Media Files
                      </Typography>
                    </div>
                  </CardHeader>
                  <CardBody className='p-6'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                      {/* Thumbnail */}
                      <div>
                        <label
                          htmlFor='thumbnail'
                          className='block text-sm font-semibold text-gray-700 mb-2'
                        >
                          <PhotoIcon className='h-4 w-4 inline mr-1' />
                          Course Thumbnail
                        </label>
                        <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors'>
                          <input
                            type='file'
                            id='thumbnail'
                            name='thumbnail'
                            accept='image/*'
                            onChange={(event) => {
                              const file = event.target.files?.[0] || null;
                              setThumbnail(file);
                            }}
                            className='hidden'
                          />
                          <label htmlFor='thumbnail' className='cursor-pointer'>
                            {thumbnail ? (
                              <div className='space-y-2'>
                                <PhotoIcon className='h-12 w-12 mx-auto text-green-500' />
                                <Typography variant='small' className='text-gray-600'>
                                  {thumbnail.name}
                                </Typography>
                                <Typography variant='small' className='text-green-600 font-semibold'>
                                  Click to change
                                </Typography>
                              </div>
                            ) : (
                              <div className='space-y-2'>
                                <PhotoIcon className='h-12 w-12 mx-auto text-gray-400' />
                                <Typography variant='small' className='text-gray-600'>
                                  Click to upload image
                                </Typography>
                                <Typography variant='small' className='text-gray-500'>
                                  PNG, JPG up to 10MB
                                </Typography>
                              </div>
                            )}
                          </label>
                        </div>
                        <ErrorMessage
                          name='thumbnail'
                          component='div'
                          className='text-red-500 text-sm mt-1'
                        />
                      </div>

                      {/* Introduction Video */}
                      <div>
                        <label
                          htmlFor='introduction-video'
                          className='block text-sm font-semibold text-gray-700 mb-2'
                        >
                          <VideoCameraIcon className='h-4 w-4 inline mr-1' />
                          Introduction Video
                        </label>
                        <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors'>
                          <input
                            type='file'
                            id='introduction-video'
                            name='introduction-video'
                            accept='video/*'
                            onChange={(event) => {
                              const file = event.target.files?.[0] || null;
                              setIntroduction(file);
                            }}
                            className='hidden'
                          />
                          <label htmlFor='introduction-video' className='cursor-pointer'>
                            {introduction ? (
                              <div className='space-y-2'>
                                <VideoCameraIcon className='h-12 w-12 mx-auto text-green-500' />
                                <Typography variant='small' className='text-gray-600'>
                                  {introduction.name}
                                </Typography>
                                <Typography variant='small' className='text-green-600 font-semibold'>
                                  Click to change
                                </Typography>
                              </div>
                            ) : (
                              <div className='space-y-2'>
                                <VideoCameraIcon className='h-12 w-12 mx-auto text-gray-400' />
                                <Typography variant='small' className='text-gray-600'>
                                  Click to upload video
                                </Typography>
                                <Typography variant='small' className='text-gray-500'>
                                  MP4, MOV up to 100MB
                                </Typography>
                              </div>
                            )}
                          </label>
                        </div>
                        <ErrorMessage
                          name='introduction-video'
                          component='div'
                          className='text-red-500 text-sm mt-1'
                        />
                      </div>

                      {/* Guidelines PDF */}
                      <div>
                        <label
                          htmlFor='guidelines'
                          className='block text-sm font-semibold text-gray-700 mb-2'
                        >
                          <DocumentTextIcon className='h-4 w-4 inline mr-1' />
                          Course Guidelines
                        </label>
                        <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors'>
                          <input
                            type='file'
                            id='guidelines'
                            name='guidelines'
                            accept='application/pdf'
                            onChange={(event) => {
                              const file = event.target.files?.[0] || null;
                              setGuidelines(file);
                            }}
                            className='hidden'
                          />
                          <label htmlFor='guidelines' className='cursor-pointer'>
                            {guidelines ? (
                              <div className='space-y-2'>
                                <DocumentTextIcon className='h-12 w-12 mx-auto text-green-500' />
                                <Typography variant='small' className='text-gray-600'>
                                  {guidelines.name}
                                </Typography>
                                <Typography variant='small' className='text-green-600 font-semibold'>
                                  Click to change
                                </Typography>
                              </div>
                            ) : (
                              <div className='space-y-2'>
                                <DocumentTextIcon className='h-12 w-12 mx-auto text-gray-400' />
                                <Typography variant='small' className='text-gray-600'>
                                  Click to upload PDF
                                </Typography>
                                <Typography variant='small' className='text-gray-500'>
                                  PDF up to 10MB
                                </Typography>
                              </div>
                            )}
                          </label>
                        </div>
                        <ErrorMessage
                          name='guidelines'
                          component='div'
                          className='text-red-500 text-sm mt-1'
                        />
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Submit Button */}
                <div className='flex justify-end gap-4 pb-8'>
                  <Button
                    type='button'
                    variant='outlined'
                    color='gray'
                    className='px-8'
                    onClick={() => window.history.back()}
                  >
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    color='blue'
                    className='px-8 bg-gradient-to-r from-blue-500 to-blue-700'
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating Course...' : 'Create Course'}
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CombinedForm;
