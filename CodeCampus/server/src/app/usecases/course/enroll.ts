import { CourseDbRepositoryInterface } from '../../repositories/courseDbRepository';
import HttpStatusCodes from '../../../constants/HttpStatusCodes';
import AppError from '../../../utils/appError';
import { PaymentInterface } from '@src/app/repositories/paymentDbRepository';
import { PaymentInfo } from '@src/types/payment';

export const enrollStudentU = async (
  courseId: string,
  studentId: string,
  paymentInfo: any,
  courseDbRepository: ReturnType<CourseDbRepositoryInterface>,
  paymentDbRepository: ReturnType<PaymentInterface>
) => {
  if (!courseId) {
    throw new AppError(
      'Please provide course details',
      HttpStatusCodes.BAD_REQUEST
    );
  }
  if (!studentId) {
    throw new AppError(
      'Please provide valid student details',
      HttpStatusCodes.BAD_REQUEST
    );
  }
  const course = await courseDbRepository.getCourseById(courseId);
  if (!course) {
    throw new AppError(
      'Course not found',
      HttpStatusCodes.NOT_FOUND
    );
  }
  
  if (course?.isPaid) {
    // For paid courses, payment info is preferred but optional in development
    if (paymentInfo && paymentInfo.id) {
      // Real payment - save payment record
      const payment = {
        paymentId: paymentInfo.id,
        courseId: courseId,
        studentId: studentId,
        amount: paymentInfo.amount / 100,
        currency: paymentInfo.currency,
        payment_method: paymentInfo.payment_method,
        status: paymentInfo.status
      };
      await Promise.all([
        courseDbRepository.enrollStudent(courseId, studentId),
        paymentDbRepository.savePayment(payment)
      ]);
    } else {
      // Development mode: allow enrollment without payment
      console.warn(`⚠️  Enrolling student ${studentId} in paid course ${courseId} without payment (development mode)`);
      await courseDbRepository.enrollStudent(courseId, studentId);
    }
  } else {
    // For free courses, enroll directly
    await courseDbRepository.enrollStudent(courseId, studentId);
  }
};
