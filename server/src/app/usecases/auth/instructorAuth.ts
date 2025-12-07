import HttpStatusCodes from '../../../constants/HttpStatusCodes';
import {
  SavedInstructorInterface,
  InstructorInterface
} from '@src/types/instructorInterface';
import AppError from '../../../utils/appError';
import { InstructorDbInterface } from '../../../app/repositories/instructorDbRepository';
import { AuthServiceInterface } from '../../../app/services/authServicesInterface';
import { RefreshTokenDbInterface } from '../../../app/repositories/refreshTokenDBRepository';
import { UploadedFileInterface } from '@src/types/common';
import { CloudServiceInterface } from '@src/app/services/cloudServiceInterface';

export const instructorRegister = async (
  instructor: InstructorInterface,
  files: Express.Multer.File[],
  instructorRepository: ReturnType<InstructorDbInterface>,
  authService: ReturnType<AuthServiceInterface>,
  cloudService: ReturnType<CloudServiceInterface>
) => {
  console.log(files);
  instructor.certificates=[]
  // Use object destructuring and default value
  const { password = '', email = '' }: InstructorInterface = instructor;
  instructor.email = email.toLowerCase();

  // Check if the email is already registered
  const isEmailAlreadyRegistered = await instructorRepository.getInstructorByEmail(
    instructor.email
  );

  if (isEmailAlreadyRegistered) {
    throw new AppError(
      'Instructor with the same email already exists..!',
      HttpStatusCodes.CONFLICT
    );
  }


  for (const file of files) {
    let uploadedFile;

    if (file.originalname === 'profilePic') {
      uploadedFile = await cloudService.upload(file);
      instructor.profilePic = uploadedFile;
    } else {
      uploadedFile = await cloudService.upload(file);
      instructor.certificates.push(uploadedFile);
    }
  }

  // Hash the password if provided
  if (password) {
    instructor.password = await authService.hashPassword(password);
  }
  console.log(instructor)

  // Add instructor to the repository
  const response = await instructorRepository.addInstructor(instructor);

  return response
    ? { status: true, message: 'Successfully registered!' }
    : { status: false, message: 'Failed to register!' };
};

export const instructorLogin = async (
  email: string,
  password: string,
  instructorRepository: ReturnType<InstructorDbInterface>,
  refreshTokenRepository: ReturnType<RefreshTokenDbInterface>,
  authService: ReturnType<AuthServiceInterface>
) => {
  let instructor: SavedInstructorInterface | null;
  try {
    instructor = await instructorRepository.getInstructorByEmail(email);
  } catch (error: any) {
    // Handle MongoDB connection errors
    if (error.message?.includes('buffering') || error.message?.includes('timeout')) {
      throw new AppError(
        'Database connection issue. Please try again in a moment.',
        HttpStatusCodes.SERVICE_UNAVAILABLE
      );
    }
    throw error;
  }
  
  if (!instructor) {
    throw new AppError(
      "Instructor doesn't exist, please register",
      HttpStatusCodes.UNAUTHORIZED
    );
  }
  
  // Auto-verify instructors for testing (can be disabled via env var)
  // Set AUTO_VERIFY_INSTRUCTORS=false to require admin verification
  if (!instructor.isVerified) {
    const autoVerify = process.env.AUTO_VERIFY_INSTRUCTORS !== 'false';
    if (autoVerify) {
      // Auto-verify for testing/development
      try {
        await instructorRepository.acceptInstructorRequest(instructor._id.toString());
        instructor.isVerified = true;
        console.log(`✅ Auto-verified instructor: ${instructor.email}`);
      } catch (error) {
        console.error('Error auto-verifying instructor:', error);
        // Continue with login even if auto-verify fails
        instructor.isVerified = true;
      }
    } else {
      // Manual verification required
      throw new AppError(
        'Your details is under verification please try again later',
        HttpStatusCodes.UNAUTHORIZED
      );
    }
  }
  const isPasswordCorrect = await authService.comparePassword(
    password,
    instructor.password
  );
  if (!isPasswordCorrect) {
    throw new AppError(
      'Sorry, your password is incorrect. Please try again',
      HttpStatusCodes.UNAUTHORIZED
    );
  }
  const payload = {
    Id: instructor._id,
    email: instructor.email,
    role: 'instructor'
  };
  await refreshTokenRepository.deleteRefreshToken(instructor._id);
  const accessToken = authService.generateToken(payload);
  const refreshToken = authService.generateRefreshToken(payload);
  const expirationDate =
    authService.decodedTokenAndReturnExpireDate(refreshToken);
  await refreshTokenRepository.saveRefreshToken(
    instructor._id,
    refreshToken,
    expirationDate
  );
  return {
    accessToken,
    refreshToken
  };
};
