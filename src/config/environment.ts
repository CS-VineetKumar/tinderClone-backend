import dotenv from 'dotenv';

// Load environment variables based on NODE_ENV
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });

export interface EnvironmentConfig {
  // Server Configuration
  port: number;
  nodeEnv: string;
  
  // CORS Configuration
  frontendUrl: string;
  
  // JWT Configuration
  jwtSecret: string;
  jwtExpiresIn: string;
  
  // Cookie Configuration
  cookieExpiresHours: number;
  
  // MongoDB Configuration
  mongodbUri: string;
  
  // Database Configuration
  database: {
    host: string;
    user: string;
    password: string;
    database: string;
    connectionLimit: number;
    queueLimit: number;
  };
  
  // Default User Configuration
  defaultUserPhoto: string;
  defaultUserAbout: string;
  
  // Logging Configuration
  logLevel: string;
  
  // Security Configuration
  corsEnabled: boolean;
  rateLimitEnabled: boolean;
}

const getEnvironmentConfig = (): EnvironmentConfig => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  // Base configuration
  const baseConfig = {
    port: parseInt(process.env.PORT || '2000'),
    nodeEnv,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    jwtSecret: process.env.JWT_SECRET!,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
    cookieExpiresHours: parseInt(process.env.COOKIE_EXPIRES_HOURS || '8'),
    mongodbUri: process.env.MONGODB_URI!,
    defaultUserPhoto: process.env.DEFAULT_USER_PHOTO || 'https://www.w3schools.com/howto/img_avatar.png',
    defaultUserAbout: process.env.DEFAULT_USER_ABOUT || 'The default about for the user',
    logLevel: process.env.LOG_LEVEL || 'info',
    corsEnabled: true,
    rateLimitEnabled: true,
  };

  // Environment-specific configurations
  switch (nodeEnv) {
    case 'development':
      return {
        ...baseConfig,
        database: {
          host: process.env.LOCAL_MYSQL_HOST || 'localhost',
          user: process.env.LOCAL_MYSQL_USER || 'root',
          password: process.env.LOCAL_MYSQL_PASSWORD || '',
          database: process.env.LOCAL_MYSQL_DATABASE || 'tinderClone_local',
          connectionLimit: parseInt(process.env.LOCAL_MYSQL_CONNECTION_LIMIT || '10'),
          queueLimit: parseInt(process.env.LOCAL_MYSQL_QUEUE_LIMIT || '0'),
        },
        logLevel: 'debug',
        corsEnabled: true,
        rateLimitEnabled: false, // Disable rate limiting in development
      };

    case 'staging':
      return {
        ...baseConfig,
        database: {
          host: process.env.STAGING_MYSQL_HOST!,
          user: process.env.STAGING_MYSQL_USER!,
          password: process.env.STAGING_MYSQL_PASSWORD!,
          database: process.env.STAGING_MYSQL_DATABASE!,
          connectionLimit: parseInt(process.env.STAGING_MYSQL_CONNECTION_LIMIT || '20'),
          queueLimit: parseInt(process.env.STAGING_MYSQL_QUEUE_LIMIT || '0'),
        },
        logLevel: 'info',
        corsEnabled: true,
        rateLimitEnabled: true,
      };

    case 'production':
      return {
        ...baseConfig,
        database: {
          host: process.env.PRODUCTION_MYSQL_HOST!,
          user: process.env.PRODUCTION_MYSQL_USER!,
          password: process.env.PRODUCTION_MYSQL_PASSWORD!,
          database: process.env.PRODUCTION_MYSQL_DATABASE!,
          connectionLimit: parseInt(process.env.PRODUCTION_MYSQL_CONNECTION_LIMIT || '50'),
          queueLimit: parseInt(process.env.PRODUCTION_MYSQL_QUEUE_LIMIT || '0'),
        },
        logLevel: 'warn',
        corsEnabled: true,
        rateLimitEnabled: true,
      };

    default:
      throw new Error(`Unknown environment: ${nodeEnv}`);
  }
};

// Validate required environment variables
const validateConfig = (config: EnvironmentConfig): void => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  // Different validation rules for different environments
  const requiredFields = nodeEnv === 'development' 
    ? [
        'jwtSecret',
        'mongodbUri',
        'database.host',
        'database.user',
        'database.database',
        // Note: database.password can be empty in development
      ]
    : [
        'jwtSecret',
        'mongodbUri',
        'database.host',
        'database.user',
        'database.password',
        'database.database',
      ];

  for (const field of requiredFields) {
    let value: any;
    
    if (field.includes('.')) {
      const keys = field.split('.');
      value = keys.reduce((obj: any, key) => obj?.[key], config);
    } else {
      value = config[field as keyof EnvironmentConfig];
    }
    
    if (!value) {
      throw new Error(`Missing required environment variable: ${field}`);
    }
  }
};

// Get and validate configuration
const config = getEnvironmentConfig();
validateConfig(config);

export default config; 