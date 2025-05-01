# Todo API

A RESTful API for a Todo application built with Node.js, Express, and MongoDB.

## Environment Variables

Make sure to set up the following environment variables:

- `PORT`: The port on which the server will run (default: 5000)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRES_IN`: JWT token expiration time (e.g., "1d" for one day)
- `NODE_ENV`: Environment mode ("development" or "production")

## Getting Started

1. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

2. Start the server:
   \`\`\`
   npm start
   \`\`\`

   For development with auto-restart:
   \`\`\`
   npm run dev
   \`\`\`

3. The server will be running at `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info (protected)

### User Management

- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)
- `PUT /api/users/change-password` - Change password (protected)
- `DELETE /api/users` - Delete user account (protected)
- `GET /api/users/stats` - Get user statistics (protected)

### Todo Management

- `GET /api/todos` - Get all todos (protected)
- `POST /api/todos` - Create a new todo (protected)
- `GET /api/todos/:todoId` - Get a specific todo (protected)
- `PUT /api/todos/:todoId` - Update a todo (protected)
- `DELETE /api/todos/:todoId` - Delete a todo (protected)
- `PATCH /api/todos/bulk` - Bulk update todos (protected)

## Health Check

- `GET /health` - Check if the server is running

## Error Handling

The API includes comprehensive error handling with appropriate HTTP status codes and error messages.
