import dotenv from 'dotenv';
dotenv.config();

const configKeys = {
  // Original DATABASE variable (not heavily used now, but keep for compatibility)
  MONGO_DB_URL: process.env.DATABASE as string,

  // Default to 4000 if PORT is not set to avoid undefined crashes in dev
  PORT: process.env.PORT || '4000',

  // Default DB name for local development
  DB_NAME: process.env.DB_NAME || 'codecampus',

  // JWT secrets: fall back to dev defaults if env is missing to avoid runtime errors
  JWT_SECRET: process.env.JWT_SECRET || 'dev_jwt_secret_change_me',

  JWT_REFRESH_SECRET:process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_me',

  NODE_ENV: process.env.NODE_ENV as string,

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,

  GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET as string,

  ORIGIN_PORT: process.env.ORIGIN_PORT || 'http://localhost:3000',

  EMAIL_NODE_MAILER: process.env.EMAIL_USERNAME as string,

  PASSWORD_NODE_MAILER: process.env.EMAIL_PASSWORD as string,

  FROM_EMAIL_NODE_MAILER:process.env.FROM_EMAIL as string,




  AWS_ACCESS_KEY:process.env.AWS_ACCESS_KEY || '',

  AWS_SECRET_KEY:process.env.AWS_SECRET_KEY || '',

  AWS_BUCKET_REGION:process.env.AWS_BUCKET_REGION || 'us-east-1',

  AWS_BUCKET_NAME:process.env.AWS_BUCKET_NAME || '',

  CLOUDFRONT_DISTRIBUTION_ID:process.env.CLOUDFRONT_DISTRIBUTION_ID as string,

  CLOUDFRONT_DOMAIN_NAME:process.env.CLOUDFRONT_DOMAIN_NAME as string,

  STRIPE_SECRET_KEY:process.env.STRIPE_SECRET_KEY  as string,

  STRIPE_PUBLISHABLE_KEY:process.env.STRIPE_PUBLISHABLE_KEY as string,

  // Prefer DB_CLUSTER_URL if provided (e.g. MongoDB Atlas), otherwise fall back to local Mongo
  DB_CLUSTER_URL:
    process.env.DB_CLUSTER_URL ||
    process.env.DATABASE ||
    'mongodb://127.0.0.1:27017',

  // Default Redis URL for local development (can be overridden via env)
  REDIS_URL:process.env.REDIS_URL || 'redis://127.0.0.1:6379'

};

export default configKeys;
