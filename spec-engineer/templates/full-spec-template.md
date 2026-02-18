# Engineering Specification

## Informasi Dokumen

| Field | Value |
|-------|-------|
| Nama Proyek/Feature | [Nama] |
| Versi Spec | 1.0 |
| Status | Draft |
| Author | [Nama] |
| Reviewer | [Nama] |
| Tanggal | [Tanggal] |
| PRD Reference | [Link ke PRD] |

---

## 1. Overview

### 1.1 Summary

[Ringkasan singkat tentang apa yang akan diimplementasikan secara teknis.]

### 1.2 Goals

- Goal 1
- Goal 2
- Goal 3

### 1.3 Non-Goals

- [Hal yang TIDAK termasuk dalam scope teknis]
- [Explicit exclusions]

---

## 2. System Architecture

### 2.1 High-Level Design

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   API GW    │────▶│   Service   │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │  Database   │
                                        └─────────────┘
```

[Penjelasan diagram]

### 2.2 Components

| Component | Technology | Responsibility |
|-----------|------------|----------------|
| Frontend | Next.js/React | UI, user interaction |
| API Gateway | [Tech] | Routing, auth, rate limiting |
| Backend Service | [Tech] | Business logic |
| Database | PostgreSQL | Data persistence |
| Cache | Redis | Session, caching |

### 2.3 Data Flow

```
1. User action → 2. API request → 3. Validation → 4. Processing → 5. Response
```

[Detail setiap langkah]

---

## 3. API Specification

### 3.1 Endpoints Overview

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/v1/resource | Get all resources | ✅ |
| GET | /api/v1/resource/:id | Get single resource | ✅ |
| POST | /api/v1/resource | Create resource | ✅ |
| PUT | /api/v1/resource/:id | Update resource | ✅ |
| DELETE | /api/v1/resource/:id | Delete resource | ✅ |

### 3.2 Endpoint Details

#### GET /api/v1/resource

**Description:** Mendapatkan list resource dengan pagination

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | integer | No | Page number (default: 1) |
| limit | integer | No | Items per page (default: 10, max: 100) |
| sort | string | No | Sort field (default: created_at) |
| order | string | No | asc/desc (default: desc) |

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "total_pages": 10
  }
}
```

**Response 400:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "Invalid page parameter"
  }
}
```

#### POST /api/v1/resource

**Description:** Membuat resource baru

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
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### 3.3 Authentication

**Type:** JWT Bearer Token

**Header:**
```
Authorization: Bearer <jwt_token>
```

**JWT Payload:**
```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "role": "admin",
  "iat": 1234567890,
  "exp": 1234571490
}
```

### 3.4 Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | Missing or invalid token |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 422 | Request validation failed |
| INTERNAL_ERROR | 500 | Server error |

---

## 4. Database Design

### 4.1 Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐
│   users     │       │  resources  │
├─────────────┤       ├─────────────┤
│ id (PK)     │◀──────│ user_id(FK) │
│ email       │       │ id (PK)     │
│ password    │       │ name        │
│ role        │       │ description │
└─────────────┘       └─────────────┘
```

### 4.2 Schema Definition

#### Table: users

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hash |
| role | VARCHAR(50) | NOT NULL, DEFAULT 'user' | User role |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Update timestamp |

**Indexes:**
- `idx_users_email` ON (email)

#### Table: resources

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| user_id | UUID | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | Owner |
| name | VARCHAR(255) | NOT NULL | Resource name |
| description | TEXT | NULL | Description |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Update timestamp |
| deleted_at | TIMESTAMP | NULL | Soft delete timestamp |

**Indexes:**
- `idx_resources_user_id` ON (user_id)
- `idx_resources_created_at` ON (created_at DESC)
- `idx_resources_deleted_at` ON (deleted_at) WHERE deleted_at IS NULL

### 4.3 Migrations

```sql
-- Migration: 001_create_users_table.sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- Migration: 002_create_resources_table.sql
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_resources_user_id ON resources(user_id);
CREATE INDEX idx_resources_created_at ON resources(created_at DESC);
```

---

## 5. Implementation Details

### 5.1 Business Logic

#### Create Resource Flow

```
1. Validate request body
2. Check user authentication
3. Validate business rules
4. Create record in database
5. Invalidate relevant cache
6. Return created resource
```

#### Pseudocode

```typescript
async function createResource(userId: string, data: CreateResourceDTO) {
  // 1. Validate input
  const validated = validateCreateResource(data);
  
  // 2. Check user exists
  const user = await userRepository.findById(userId);
  if (!user) throw new NotFoundError('User not found');
  
  // 3. Check business rules
  if (user.role !== 'admin' && await resourceRepository.countByUser(userId) >= 100) {
    throw new ValidationError('Resource limit reached');
  }
  
  // 4. Create resource
  const resource = await resourceRepository.create({
    userId,
    ...validated,
  });
  
  // 5. Invalidate cache
  await cache.del(`user:${userId}:resources`);
  
  // 6. Return result
  return resource;
}
```

### 5.2 Error Handling

```typescript
// Custom error classes
class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500
  ) {
    super(message);
  }
}

class ValidationError extends AppError {
  constructor(message: string) {
    super('VALIDATION_ERROR', message, 422);
  }
}

class NotFoundError extends AppError {
  constructor(message: string) {
    super('NOT_FOUND', message, 404);
  }
}

// Global error handler
function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }
  
  // Log unexpected errors
  logger.error('Unexpected error', { error: err });
  
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  });
}
```

---

## 6. Security

### 6.1 Authentication & Authorization

| Aspect | Implementation |
|--------|----------------|
| Authentication | JWT with RS256 |
| Token Expiry | Access: 15min, Refresh: 7d |
| Password Hashing | bcrypt with cost factor 12 |
| Session Management | Redis-based token blacklist |

### 6.2 Input Validation

```typescript
// Using Zod for validation
const createResourceSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
});

function validateCreateResource(data: unknown) {
  return createResourceSchema.parse(data);
}
```

### 6.3 Security Headers

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### 6.4 Rate Limiting

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| Public | 100 | 15 min |
| Authenticated | 1000 | 15 min |
| Write Operations | 100 | 15 min |

---

## 7. Performance

### 7.1 Caching Strategy

| Data Type | Cache | TTL | Invalidation |
|-----------|-------|-----|--------------|
| User session | Redis | 15 min | On logout |
| Resource list | Redis | 5 min | On CRUD |
| Static data | CDN | 1 day | On update |

### 7.2 Query Optimization

- Use database indexes on frequently queried columns
- Implement cursor-based pagination for large datasets
- Use SELECT with specific columns, avoid SELECT *
- Implement query result caching

### 7.3 Performance Targets

| Metric | Target |
|--------|--------|
| API Response Time (p50) | < 100ms |
| API Response Time (p99) | < 500ms |
| Database Query Time | < 50ms |
| Concurrent Users | 10,000 |

---

## 8. Testing Strategy

### 8.1 Unit Tests

```typescript
describe('ResourceService', () => {
  describe('createResource', () => {
    it('should create resource successfully', async () => {
      // Arrange
      const mockUser = { id: 'user-1', role: 'admin' };
      const mockData = { name: 'Test Resource' };
      
      // Act
      const result = await resourceService.createResource(mockUser.id, mockData);
      
      // Assert
      expect(result.name).toBe(mockData.name);
    });
    
    it('should throw error when limit reached', async () => {
      // Test for non-admin user with 100 resources
    });
  });
});
```

### 8.2 Integration Tests

```typescript
describe('POST /api/v1/resource', () => {
  it('should create resource and return 201', async () => {
    const response = await request(app)
      .post('/api/v1/resource')
      .set('Authorization', `Bearer ${testToken}`)
      .send({ name: 'New Resource' });
    
    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe('New Resource');
  });
});
```

### 8.3 Test Coverage Target

| Type | Coverage |
|------|----------|
| Unit Tests | 80% |
| Integration Tests | Critical paths |
| E2E Tests | Happy path + key scenarios |

---

## 9. Deployment

### 9.1 Infrastructure

```
┌─────────────────────────────────────────┐
│              Production                 │
├─────────────────────────────────────────┤
│  Load Balancer (nginx/AWS ALB)          │
│         ↓                               │
│  App Server (Node.js) x N               │
│         ↓                               │
│  Database (PostgreSQL - Managed)        │
│  Cache (Redis - Managed)                │
└─────────────────────────────────────────┘
```

### 9.2 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
stages:
  - lint
  - test
  - build
  - deploy

lint:
  - ESLint
  - TypeScript check
  - Prettier check

test:
  - Unit tests
  - Integration tests
  - Coverage report

build:
  - Docker image build
  - Push to registry

deploy:
  - Deploy to staging (on PR)
  - Deploy to production (on main branch)
```

### 9.3 Monitoring & Alerting

| Metric | Alert Threshold |
|--------|-----------------|
| Error Rate | > 1% |
| Response Time (p99) | > 1s |
| CPU Usage | > 80% |
| Memory Usage | > 85% |
| Database Connections | > 80% |

---

## 10. Appendix

### 10.1 Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Runtime | Node.js | 20.x |
| Framework | Express/Fastify | 4.x |
| Database | PostgreSQL | 15.x |
| Cache | Redis | 7.x |
| ORM | Prisma | 5.x |

### 10.2 Decision Log (ADR)

| Decision | Choice | Reason |
|----------|--------|--------|
| Soft Delete | Yes | Need to preserve data for audit |
| UUID vs Integer ID | UUID | Better for distributed systems |
| JWT vs Session | JWT | Stateless, scalable |

### 10.3 References

- [Link ke PRD]
- [Link ke API documentation]
- [Link ke design mockups]
- [Link ke related specs]

### 10.4 Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | [Date] | [Author] | Initial version |

---

## Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Tech Lead | | | |
| Architect | | | |
| Security | | | |
