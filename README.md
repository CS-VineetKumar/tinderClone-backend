# TinderClone Backend

A Node.js/TypeScript backend for the TinderClone application.

## Environment Variables

This application uses environment variables for configuration. Copy the `.env.example` file to `.env` and fill in your values:

```bash
cp .env.example .env
```

**⚠️ Important**: All environment variables are required. The application will fail to start if any required environment variable is missing.

### Required Environment Variables

#### Server Configuration
- `PORT` - Server port (e.g., 2000)
- `NODE_ENV` - Environment (development/production)

#### CORS Configuration
- `FRONTEND_URL` - Frontend URL for CORS (e.g., http://localhost:3000)

#### JWT Configuration
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - JWT token expiration time (e.g., 1h)

#### Cookie Configuration
- `COOKIE_EXPIRES_HOURS` - Cookie expiration time in hours (e.g., 8)

#### MongoDB Configuration
- `MONGODB_URI` - MongoDB connection string

#### MySQL Configuration
- `MYSQL_HOST` - MySQL host
- `MYSQL_USER` - MySQL username
- `MYSQL_PASSWORD` - MySQL password
- `MYSQL_DATABASE` - MySQL database name
- `MYSQL_CONNECTION_LIMIT` - Connection pool limit (e.g., 10)
- `MYSQL_QUEUE_LIMIT` - Queue limit (e.g., 0)

#### Default User Configuration
- `DEFAULT_USER_PHOTO` - Default profile photo URL
- `DEFAULT_USER_ABOUT` - Default user about text

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Start Production

```bash
npm start
```

## API Documentation

See `apiList.md` for available API endpoints. 