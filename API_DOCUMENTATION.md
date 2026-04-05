# API Documentation

## Authentication Endpoints

### Sign Up
Create a new user account.

**Endpoint:** `POST /api/auth/signup`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "userId": 1
}
```

**Status Codes:**
- 201: User created successfully
- 400: Missing required fields
- 409: Email already registered
- 500: Internal server error

---

### Login
User login using credentials.

**Endpoint:** `POST /api/auth/callback/credentials`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response:** Session token and user data

**Status Codes:**
- 200: Login successful
- 401: Invalid credentials
- 500: Internal server error

---

## Issues Endpoints

### Get All Issues
Retrieve all complaint issues.

**Endpoint:** `GET /api/issues`

**Query Parameters:** None

**Response:**
```json
[
  {
    "id": 1,
    "ticketId": "ISS-001",
    "title": "Login not working",
    "description": "Users cannot login to the system",
    "status": "New",
    "priority": "Critical",
    "createdById": 1,
    "createdBy": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Customer"
    },
    "comments": [],
    "createdAt": "2025-03-26T10:00:00Z",
    "updatedAt": "2025-03-26T10:00:00Z"
  }
]
```

**Status Codes:**
- 200: Success
- 500: Internal server error

---

### Create Issue
Create a new complaint issue.

**Endpoint:** `POST /api/issues`

**Headers:**
- Authorization: Required (SessionToken)

**Request Body:**
```json
{
  "title": "Payment processing error",
  "description": "Payment fails when trying to checkout",
  "priority": "High"
}
```

**Response:**
```json
{
  "id": 2,
  "ticketId": "ISS-1711428000000",
  "title": "Payment processing error",
  "description": "Payment fails when trying to checkout",
  "status": "New",
  "priority": "High",
  "createdById": 1,
  "createdBy": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "createdAt": "2025-03-26T10:00:00Z",
  "updatedAt": "2025-03-26T10:00:00Z"
}
```

**Status Codes:**
- 201: Issue created successfully
- 400: Missing required fields
- 401: Unauthorized
- 500: Internal server error

---

### Get Issue Details
Retrieve specific issue with comments.

**Endpoint:** `GET /api/issues/:id`

**Parameters:**
- id: Issue ID (integer)

**Response:**
```json
{
  "id": 1,
  "ticketId": "ISS-001",
  "title": "Login not working",
  "description": "Users cannot login to the system",
  "status": "New",
  "priority": "Critical",
  "createdById": 1,
  "createdBy": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "comments": [
    {
      "id": 1,
      "content": "We are investigating this issue",
      "userId": 2,
      "user": {
        "id": 2,
        "name": "Jane Agent",
        "email": "agent@example.com"
      },
      "createdAt": "2025-03-26T10:15:00Z"
    }
  ],
  "createdAt": "2025-03-26T10:00:00Z",
  "updatedAt": "2025-03-26T10:00:00Z"
}
```

**Status Codes:**
- 200: Success
- 404: Issue not found
- 500: Internal server error

---

### Update Issue
Update issue status, priority, or description.

**Endpoint:** `PATCH /api/issues/:id`

**Headers:**
- Authorization: Required

**Request Body:**
```json
{
  "status": "In Progress",
  "priority": "High",
  "title": "Updated title",
  "description": "Updated description"
}
```

**Response:** Updated issue object

**Status Codes:**
- 200: Updated successfully
- 401: Unauthorized
- 404: Issue not found
- 500: Internal server error

---

## Comments Endpoints

### Create Comment
Post a comment on an issue.

**Endpoint:** `POST /api/comments`

**Headers:**
- Authorization: Required

**Request Body:**
```json
{
  "issueId": 1,
  "content": "We found the root cause and are working on a fix"
}
```

**Response:**
```json
{
  "id": 1,
  "content": "We found the root cause and are working on a fix",
  "issueId": 1,
  "userId": 2,
  "user": {
    "id": 2,
    "name": "Jane Agent",
    "email": "agent@example.com"
  },
  "createdAt": "2025-03-26T10:15:00Z",
  "updatedAt": "2025-03-26T10:15:00Z"
}
```

**Status Codes:**
- 201: Comment created successfully
- 400: Missing required fields
- 401: Unauthorized
- 500: Internal server error

---

## Response Codes

| Status | Meaning |
|--------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error - Server error |

---

## Error Response Format

All errors follow this format:

```json
{
  "message": "Error description"
}
```

Example:
```json
{
  "message": "Invalid email or password"
}
```

---

## Authentication

All protected endpoints require a valid session. Include your authentication token in requests.

Users can login with:
- Admin: admin@example.com / Admin@123456
- Agent: agent1@example.com / Agent@123456
- Customer: customer@example.com / Customer@123456
