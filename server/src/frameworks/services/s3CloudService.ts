import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { CloudFrontClient, GetDistributionCommand } from '@aws-sdk/client-cloudfront';
import configKeys from '../../config';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Validate AWS config before initializing clients
const isAWSConfigured = () => {
  const hasAccessKey = configKeys.AWS_ACCESS_KEY && 
    configKeys.AWS_ACCESS_KEY.trim() !== '' && 
    !configKeys.AWS_ACCESS_KEY.includes('your_aws');
  const hasSecretKey = configKeys.AWS_SECRET_KEY && 
    configKeys.AWS_SECRET_KEY.trim() !== '' && 
    !configKeys.AWS_SECRET_KEY.includes('your_aws');
  const hasBucketName = configKeys.AWS_BUCKET_NAME && 
    configKeys.AWS_BUCKET_NAME.trim() !== '' && 
    !configKeys.AWS_BUCKET_NAME.includes('your_bucket');
  const hasRegion = configKeys.AWS_BUCKET_REGION && 
    configKeys.AWS_BUCKET_REGION.trim() !== '';
  
  return !!(hasAccessKey && hasSecretKey && hasBucketName && hasRegion);
};

// Lazy initialization of S3 clients - only create when needed and config is valid
const getS3Client = () => {
  if (!isAWSConfigured()) {
    throw new Error('AWS S3 configuration is missing. Please set AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_BUCKET_NAME, and AWS_BUCKET_REGION in your .env file.');
  }
  return new S3Client({
    credentials: {
      accessKeyId: configKeys.AWS_ACCESS_KEY,
      secretAccessKey: configKeys.AWS_SECRET_KEY,
    },
    region: configKeys.AWS_BUCKET_REGION,
  });
};

const getCloudFrontClient = () => {
  if (!isAWSConfigured()) {
    throw new Error('AWS S3 configuration is missing. Please set AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_BUCKET_NAME, and AWS_BUCKET_REGION in your .env file.');
  }
  return new CloudFrontClient({
    credentials: {
      accessKeyId: configKeys.AWS_ACCESS_KEY,
      secretAccessKey: configKeys.AWS_SECRET_KEY,
    },
    region: configKeys.AWS_BUCKET_REGION,
  });
};

const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

// Local file storage for development (when AWS is not configured)
const ensureUploadsDir = () => {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  return uploadsDir;
};

const saveFileLocally = async (file: Express.Multer.File): Promise<{ name: string; key: string; url?: string }> => {
  const uploadsDir = ensureUploadsDir();
  const key = randomImageName() + path.extname(file.originalname);
  const filePath = path.join(uploadsDir, key);
  
  // Cast buffer to Uint8Array to satisfy TypeScript type checking
  fs.writeFileSync(filePath, file.buffer as Uint8Array);
  
  // Return a local URL that can be served by Express static middleware
  // Use the server's origin for the full URL
  const serverUrl = `http://localhost:${configKeys.PORT}`;
  const url = `${serverUrl}/uploads/${key}`;
  
  return {
    name: file.originalname,
    key,
    url
  };
};

export const s3Service = () => {
  const uploadFile = async (file: Express.Multer.File) => {
    // Fallback to local storage if AWS is not configured
    if (!isAWSConfigured()) {
      console.warn('AWS S3 not configured, using local file storage for development');
      return await saveFileLocally(file);
    }
    
    const s3Client = getS3Client();
    const key = randomImageName();
    const params = {
      Bucket: configKeys.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    return {
      name: file.originalname,
      key,
    };
  };

   const uploadAndGetUrl = async (file: Express.Multer.File) => {
    // Fallback to local storage if AWS is not configured
    if (!isAWSConfigured()) {
      console.warn('AWS S3 not configured, using local file storage for development');
      return await saveFileLocally(file);
    }
    
    const s3Client = getS3Client();
    const key = randomImageName();
    const params = {
      Bucket: configKeys.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read' as const, 
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    const url = `https://${configKeys.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;

    return {
      name: file.originalname,
      key,
      url,
    };
  };

  const getFile = async (fileKey: string) => {
    // Fallback to local file URL if AWS is not configured
    if (!isAWSConfigured()) {
      // Silently return local URL for development (no console spam)
      const serverUrl = `http://localhost:${configKeys.PORT}`;
      // Check if file exists locally
      const uploadsDir = ensureUploadsDir();
      const filePath = path.join(uploadsDir, fileKey);
      if (fs.existsSync(filePath)) {
        return `${serverUrl}/uploads/${fileKey}`;
      }
      // If file doesn't exist locally, still return the URL (file might be in a subdirectory or have different name)
      // This allows the frontend to try loading it
      return `${serverUrl}/uploads/${fileKey}`;
    }
    
    const s3Client = getS3Client();
    const getObjectParams = {
      Bucket: configKeys.AWS_BUCKET_NAME,
      Key: fileKey,
    };
    const command = new GetObjectCommand(getObjectParams);
    return await getSignedUrl(s3Client, command, { expiresIn: 60000 });
  };

  const getVideoStream = async (key: string): Promise<NodeJS.ReadableStream> => {
    const s3Client = getS3Client();
    const s3Params = {
      Bucket: configKeys.AWS_BUCKET_NAME,
      Key: key,
    };

    const command = new GetObjectCommand(s3Params);
    const { Body } = await s3Client.send(command);

    return Body as NodeJS.ReadableStream;
  };

  const getCloudFrontUrl = async (fileKey: string) => {
    const cloudFrontClient = getCloudFrontClient();
    const getDistributionParams = {
      Id: configKeys.CLOUDFRONT_DISTRIBUTION_ID,
    };
    const command = new GetDistributionCommand(getDistributionParams);
    const { Distribution } = await cloudFrontClient.send(command);
    const cloudFrontDomain = Distribution?.DomainName;
    const cloudFrontUrl = `https://${cloudFrontDomain}/${fileKey}`;

    return cloudFrontUrl;
  };

  const removeFile = async (fileKey: string) => {
    const s3Client = getS3Client();
    const params = {
      Bucket: configKeys.AWS_BUCKET_NAME,
      Key: fileKey,
    };
    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
  };

  return {
    uploadFile,
    uploadAndGetUrl,
    getFile,
    getVideoStream,
    getCloudFrontUrl,
    removeFile,
  };
};

export type CloudServiceImpl = typeof s3Service;
