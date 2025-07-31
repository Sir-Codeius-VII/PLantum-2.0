# API Documentation

## Authentication Endpoints

### POST /api/auth/login
Authenticate a user and create a session.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "role": "string",
    "name": "string"
  },
  "token": "string"
}
```

### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "name": "string",
  "role": "user"
}
```

**Response:**
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "role": "string",
    "name": "string"
  }
}
```

## Business Endpoints

### GET /api/business/profile
Get business profile information.

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "status": "string",
  "balance": "number",
  "createdAt": "string",
  "lastActive": "string"
}
```

### POST /api/business/profile
Update business profile.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "settings": {
    "currency": "string",
    "paymentMethods": ["string"]
  }
}
```

## Payment Endpoints

### POST /api/payments/process
Process a new payment.

**Request Body:**
```json
{
  "amount": "number",
  "currency": "string",
  "paymentMethodId": "string",
  "metadata": {
    "product": "string",
    "customerEmail": "string"
  }
}
```

**Response:**
```json
{
  "id": "string",
  "status": "string",
  "amount": "number",
  "currency": "string"
}
```

### GET /api/payments/history
Get payment history.

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `status`: string (optional)
- `startDate`: string (optional)
- `endDate`: string (optional)

**Response:**
```json
{
  "payments": [
    {
      "id": "string",
      "amount": "number",
      "currency": "string",
      "status": "string",
      "createdAt": "string"
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

## Admin Endpoints

### GET /api/admin/dashboard
Get admin dashboard statistics.

**Response:**
```json
{
  "stats": {
    "totalUsers": "number",
    "totalBusinesses": "number",
    "totalRevenue": "number",
    "pendingWithdrawals": "number",
    "activeUsers": "number",
    "newUsers": "number",
    "newBusinesses": "number",
    "monthlyRevenue": "number",
    "averageTransactionValue": "number",
    "userGrowth": "number",
    "businessGrowth": "number",
    "revenueGrowth": "number"
  },
  "users": [
    {
      "id": "string",
      "email": "string",
      "name": "string",
      "role": "string",
      "status": "string",
      "createdAt": "string",
      "lastActive": "string"
    }
  ],
  "businesses": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "status": "string",
      "balance": "number",
      "createdAt": "string",
      "lastActive": "string"
    }
  ],
  "withdrawals": [
    {
      "id": "string",
      "businessId": "string",
      "businessName": "string",
      "amount": "number",
      "status": "string",
      "createdAt": "string"
    }
  ],
  "transactions": [
    {
      "id": "string",
      "businessId": "string",
      "businessName": "string",
      "amount": "number",
      "type": "string",
      "status": "string",
      "createdAt": "string"
    }
  ]
}
```

### POST /api/admin/actions
Perform admin actions.

**Request Body:**
```json
{
  "action": "string", // "approve_withdrawal" | "reject_withdrawal" | "update_user_status" | "update_business_status"
  "withdrawalId": "string", // for withdrawal actions
  "userId": "string", // for user actions
  "businessId": "string", // for business actions
  "status": "string" // for status updates
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "string",
  "message": "string"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
``` 