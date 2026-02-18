# API Specification

## Informasi Dokumen

| Field | Value |
|-------|-------|
| Nama API | [Nama API] |
| Versi | 1.0.0 |
| Base URL | `/api/v1` |
| Author | [Nama] |

---

## 1. Overview

### 1.1 Description

[Deskripsi singkat tentang API ini]

### 1.2 Authentication

**Type:** JWT Bearer Token / API Key / OAuth 2.0

```
Authorization: Bearer <token>
```

### 1.3 Rate Limiting

| Plan | Limit | Window |
|------|-------|--------|
| Free | 100 | 1 hour |
| Pro | 1000 | 1 hour |
| Enterprise | Unlimited | - |

---

## 2. Endpoints

### 2.1 Resources

#### List Resources

```http
GET /api/v1/resources
```

**Query Parameters:**

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| page | integer | No | 1 | Page number |
| limit | integer | No | 10 | Items per page (max: 100) |
| sort | string | No | created_at | Sort field |
| order | string | No | desc | Sort direction (asc/desc) |
| search | string | No | - | Search query |

**Response:**
```json
{
  "success": true,
  "data": [],
  "meta": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "total_pages": 0
  }
}
```

---

#### Get Resource

```http
GET /api/v1/resources/:id
```

**Path Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string (UUID) | Yes | Resource ID |

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "string",
    "created_at": "ISO8601",
    "updated_at": "ISO8601"
  }
}
```

---

#### Create Resource

```http
POST /api/v1/resources
```

**Request Body:**
```json
{
  "name": "string (required, max: 255)",
  "description": "string (optional, max: 1000)"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "string",
    "description": "string",
    "created_at": "ISO8601"
  }
}
```

---

#### Update Resource

```http
PUT /api/v1/resources/:id
```

**Request Body:**
```json
{
  "name": "string (optional, max: 255)",
  "description": "string (optional, max: 1000)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {}
}
```

---

#### Delete Resource

```http
DELETE /api/v1/resources/:id
```

**Response 204:** No Content

---

## 3. Error Responses

### Standard Error Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": []
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | Authentication required |
| FORBIDDEN | 403 | Permission denied |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 422 | Invalid request data |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |

### Validation Error Details

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "name",
        "message": "Name is required"
      },
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

---

## 4. Data Models

### Resource

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique identifier |
| name | string | Resource name |
| description | string | Description |
| created_at | ISO8601 | Creation timestamp |
| updated_at | ISO8601 | Update timestamp |

---

## 5. Webhooks (Optional)

### Events

| Event | Description |
|-------|-------------|
| resource.created | Fired when resource is created |
| resource.updated | Fired when resource is updated |
| resource.deleted | Fired when resource is deleted |

### Payload

```json
{
  "event": "resource.created",
  "timestamp": "ISO8601",
  "data": {}
}
```
