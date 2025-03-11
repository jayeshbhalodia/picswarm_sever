# PicSwarm API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication Endpoints

### 1. Register User

Register a new user account.

**Endpoint:** `POST /auth/register`

**Request Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "123456"
}
```

**Request Parameters:**

| Parameter  | Type   | Required | Description                    |
|-----------|--------|----------|--------------------------------|
| firstName | string | Yes      | User's first name              |
| lastName  | string | Yes      | User's last name               |
| email     | string | Yes      | User's email address          |
| password  | string | Yes      | Password (min 6 characters)    |

**Success Response (200):**

```json
{
    "user": {
        "id": "user_id",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
    }
}
```

**Error Responses:**

- 400: Bad Request

```json
{
    "msg": "User already exists"
}
```

```json
{
    "errors": [
        {
            "msg": "First name is required",
            "param": "firstName"
        }
    ]
}
```

- 500: Server Error

### 2. Login

Login to existing account.

**Endpoint:** `POST /auth/login`

**Request Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
    "email": "john@example.com",
    "password": "123456"
}
```

**Request Parameters:**

| Parameter | Type   | Required | Description         |
|-----------|--------|----------|---------------------|
| email     | string | Yes      | User's email       |
| password  | string | Yes      | User's password    |

**Success Response (200):**

```json
{
    "user": {
        "id": "user_id",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
    }
}
```

**Error Responses:**

- 400: Invalid credentials
- 500: Server Error

### 3. Logout

Logout from current session.

**Endpoint:** `POST /auth/logout`

**Request Headers:**

```
Cookie: connect.sid=<session_id>
```

**Success Response (200):**

```json
{
    "msg": "Logged out successfully"
}
```

**Error Responses:**

- 401: Not authenticated
- 500: Could not log out

### 4. Check Authentication

Check if user is currently authenticated.

**Endpoint:** `GET /auth/check`

**Request Headers:**

```
Cookie: connect.sid=<session_id>
```

**Success Response (200):**

```json
{
    "authenticated": true
}
```

**Error Response:**

- 401: Not authenticated

### 5. Forgot Password

Request password reset email.

**Endpoint:** `POST /auth/forgot-password`

**Request Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
    "email": "john@example.com"
}
```

**Request Parameters:**

| Parameter | Type   | Required | Description    |
|-----------|--------|----------|----------------|
| email     | string | Yes      | User's email  |

**Success Response (200):**

```json
{
    "msg": "Password reset email sent"
}
```

**Error Responses:**

- 404: User not found
- 500: Server Error

### 6. Reset Password

Reset password using token.

**Endpoint:** `POST /auth/reset-password/:token`

**URL Parameters:**

| Parameter | Type   | Required | Description        |
|-----------|--------|----------|--------------------|
| token     | string | Yes      | Reset token       |

**Request Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
    "password": "newpassword123"
}
```

**Request Parameters:**

| Parameter | Type   | Required | Description              |
|-----------|--------|----------|--------------------------|
| password  | string | Yes      | New password (min 6 chars) |

**Success Response (200):**

```json
{
    "msg": "Password updated successfully"
}
```

**Error Responses:**

- 400: Invalid or expired reset token
- 500: Server Error

## User Profile Endpoints

### 1. Get User Profile

Get current user's profile information.

**Endpoint:** `GET /users/me`

**Request Headers:**

```
Cookie: connect.sid=<session_id>
```

**Success Response (200):**

```json
{
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "profilePicture": "url_to_picture",
    "createdAt": "2024-02-20T10:00:00.000Z"
}
```

**Error Responses:**

- 401: Not authenticated
- 500: Server Error

### 2. Update Profile

Update user profile information.

**Endpoint:** `PUT /users/profile`

**Request Headers:**

```
Content-Type: application/json
Cookie: connect.sid=<session_id>
```

**Request Body:**

```json
{
    "firstName": "John",
    "lastName": "Smith",
    "email": "john@example.com"
}
```

**Request Parameters:**

| Parameter  | Type   | Required | Description       |
|-----------|--------|----------|-------------------|
| firstName | string | Yes      | New first name   |
| lastName  | string | Yes      | New last name    |
| email     | string | Yes      | New email address |

**Success Response (200):**

```json
{
    "id": "user_id",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john@example.com",
    "profilePicture": "url_to_picture",
    "createdAt": "2024-02-20T10:00:00.000Z"
}
```

**Error Responses:**

- 400: Email already taken
- 401: Not authenticated
- 500: Server Error

### 3. Change Password

Change user's password.

**Endpoint:** `PUT /users/password`

**Request Headers:**

```
Content-Type: application/json
Cookie: connect.sid=<session_id>
```

**Request Body:**

```json
{
    "currentPassword": "123456",
    "newPassword": "newpassword123"
}
```

**Request Parameters:**

| Parameter       | Type   | Required | Description              |
|----------------|--------|----------|--------------------------|
| currentPassword | string | Yes      | Current password         |
| newPassword     | string | Yes      | New password (min 6 chars) |

**Success Response (200):**

```json
{
    "msg": "Password updated successfully"
}
```

**Error Responses:**

- 400: Current password is incorrect
- 401: Not authenticated
- 500: Server Error

### 4. Update Profile Picture

Update user's profile picture.

**Endpoint:** `PUT /users/profile-picture`

**Request Headers:**

```
Content-Type: application/json
Cookie: connect.sid=<session_id>
```

**Request Body:**

```json
{
    "profilePicture": "url_to_picture"
}
```

**Request Parameters:**

| Parameter      | Type   | Required | Description           |
|---------------|--------|----------|-----------------------|
| profilePicture | string | Yes      | URL to profile picture |

**Success Response (200):**

```json
{
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "profilePicture": "url_to_picture",
    "createdAt": "2024-02-20T10:00:00.000Z"
}
```

**Error Responses:**

- 401: Not authenticated
- 500: Server Error

## General Notes

### Authentication

- All endpoints except `/auth/register`, `/auth/login`, `/auth/forgot-password`, and `/auth/reset-password/:token` require authentication
- Authentication is handled via session cookies
- Session cookie name is `connect.sid`
- Sessions expire after 24 hours

### Error Response Format

Standard error response format:

```json
{
    "msg": "Error message"
}
```

Validation error format:

```json
{
    "errors": [
        {
            "msg": "Error message",
            "param": "field_name",
            "value": "invalid_value"
        }
    ]
}
```

### HTTP Status Codes

- 200: Success
- 400: Bad Request (invalid input)
- 401: Unauthorized (not authenticated)
- 404: Not Found
- 500: Server Error
