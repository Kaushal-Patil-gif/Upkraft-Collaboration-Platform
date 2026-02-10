# EsportsConnect Authentication Backend

A complete Spring Boot backend with JWT authentication and Google OAuth2 integration.

## Features

- JWT-based authentication
- User registration and login
- Google OAuth2 Sign-In
- Role-based authorization (CREATOR, FREELANCER, ADMIN)
- Password encryption with BCrypt
- CORS configuration for frontend integration
- H2 in-memory database for development

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- Node.js 18+ (for frontend)

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd esports-backend
```

### 2. Configure Google OAuth2

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5010/api/auth/google/callback`
   - `http://localhost:5173` (for frontend)

### 3. Update Configuration

Edit `src/main/resources/application.properties`:

```properties
# Replace with your actual Google OAuth credentials
spring.security.oauth2.client.registration.google.client-id=YOUR_ACTUAL_GOOGLE_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_ACTUAL_GOOGLE_CLIENT_SECRET

# Optional: Change JWT secret for production
jwt.secret=your-super-secret-jwt-key-here
```

### 4. Run the Backend
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:5010`

## Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd esports-cc-frontend
```

### 2. Update Google Client ID

In both `Login.jsx` and `SignUp.jsx`, replace:
```javascript
client_id: 'YOUR_GOOGLE_CLIENT_ID'
```
with your actual Google Client ID.

### 3. Install Dependencies and Run
```bash
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth authentication

### Request/Response Examples

#### Register
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "CREATOR"
}
```

#### Login
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Response
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "CREATOR",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Database

The application uses H2 in-memory database for development. Access the H2 console at:
`http://localhost:5010/h2-console`

- JDBC URL: `jdbc:h2:mem:esports`
- Username: `sa`
- Password: (empty)

## Security Features

- JWT tokens with configurable expiration
- Password encryption using BCrypt
- CORS configuration for cross-origin requests
- Role-based access control
- Google OAuth2 integration

## Production Considerations

1. **Database**: Replace H2 with PostgreSQL/MySQL
2. **JWT Secret**: Use a strong, environment-specific secret
3. **HTTPS**: Enable SSL/TLS in production
4. **Environment Variables**: Use environment variables for sensitive data
5. **Logging**: Configure appropriate logging levels

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure frontend URL is in `cors.allowed-origins`
2. **Google Auth Fails**: Verify Google Client ID/Secret and redirect URIs
3. **JWT Errors**: Check JWT secret configuration
4. **Database Issues**: Verify H2 console access and connection

### Development Tips

- Use H2 console to inspect database state
- Check application logs for detailed error messages
- Verify JWT tokens using online JWT decoders
- Test API endpoints using Postman or similar tools

## Next Steps

1. Add password reset functionality
2. Implement email verification
3. Add refresh token mechanism
4. Create user profile management endpoints
5. Add rate limiting for authentication endpoints