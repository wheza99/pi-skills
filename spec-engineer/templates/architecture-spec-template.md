# Architecture Specification

## Informasi Dokumen

| Field | Value |
|-------|-------|
| Nama Sistem | [Nama] |
| Versi | 1.0 |
| Author | [Nama] |
| Date | [Tanggal] |

---

## 1. Overview

### 1.1 System Purpose

[Deskripsi singkat tentang sistem dan tujuannya]

### 1.2 Key Requirements

- Scalability: [Requirements]
- Availability: [Requirements]
- Performance: [Requirements]
- Security: [Requirements]

---

## 2. High-Level Architecture

### 2.1 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTS                                  │
│        Web App │ Mobile App │ Third-party Integrations          │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      LOAD BALANCER                               │
│                    (AWS ALB / nginx)                             │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                ┌───────────────┴───────────────┐
                ▼                               ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│     API GATEWAY           │   │      CDN                  │
│  - Rate Limiting          │   │   - Static Assets         │
│  - Auth                   │   │   - Caching               │
│  - Routing                │   │                           │
└───────────┬───────────────┘   └───────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  User Svc   │  │  Post Svc   │  │  Notify Svc │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ PostgreSQL  │  │   Redis     │  │    S3       │             │
│  │ (Primary)   │  │  (Cache)    │  │  (Storage)  │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Architecture Style

- **Pattern:** Microservices / Monolith / Modular Monolith
- **Communication:** REST API / gRPC / Event-driven
- **Data Strategy:** Database per Service / Shared Database

---

## 3. Components

### 3.1 Component List

| Component | Type | Technology | Description |
|-----------|------|------------|-------------|
| Web Client | Frontend | Next.js | User-facing web app |
| API Gateway | Gateway | Kong/Express Gateway | Request routing, auth |
| User Service | Backend | Node.js | User management |
| Post Service | Backend | Node.js | Content management |
| Notification Service | Backend | Node.js | Email, push notifications |
| Primary DB | Database | PostgreSQL | Main data store |
| Cache | Cache | Redis | Session, caching |
| Object Storage | Storage | AWS S3 | Files, images |
| Message Queue | Queue | RabbitMQ/SQS | Async processing |

### 3.2 Component Details

#### User Service

**Responsibility:**
- User registration & authentication
- Profile management
- Role & permission management

**Dependencies:**
- PostgreSQL (user data)
- Redis (session cache)

**APIs Exposed:**
- POST /auth/register
- POST /auth/login
- GET /users/me
- PUT /users/me

---

#### Post Service

**Responsibility:**
- CRUD posts
- Content search
- Post publishing workflow

**Dependencies:**
- PostgreSQL (post data)
- Redis (cache)
- Elasticsearch (search)

**Events Published:**
- post.created
- post.updated
- post.published
- post.deleted

---

## 4. Data Flow

### 4.1 Request Flow

```
Client → CDN → Load Balancer → API Gateway → Service → Database
                                                       ↓
Client ← CDN ← Load Balancer ← API Gateway ← Service ←┘
```

### 4.2 Authentication Flow

```
1. Client sends credentials to /auth/login
2. User Service validates credentials
3. User Service generates JWT
4. JWT returned to client
5. Client includes JWT in subsequent requests
6. API Gateway validates JWT
7. Request forwarded to appropriate service
```

### 4.3 Event Flow (Async)

```
Post Service → Message Queue → Notification Service
                  ↓
            Search Service
```

---

## 5. Infrastructure

### 5.1 Cloud Architecture (AWS)

```
┌─────────────────────────────────────────────────────────┐
│                         VPC                              │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Public Subnets                        │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐           │  │
│  │  │   ALB   │  │  NAT    │  │Bastion  │           │  │
│  │  └─────────┘  └─────────┘  └─────────┘           │  │
│  └───────────────────────────────────────────────────┘  │
│                         │                               │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Private Subnets                       │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐           │  │
│  │  │  EC2    │  │  EC2    │  │  ECS    │           │  │
│  │  │ (API)   │  │ (API)   │  │ (Svc)   │           │  │
│  │  └─────────┘  └─────────┘  └─────────┘           │  │
│  └───────────────────────────────────────────────────┘  │
│                         │                               │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Data Subnets                          │  │
│  │  ┌─────────┐  ┌─────────┐                        │  │
│  │  │   RDS   │  │ElastiCach│                        │  │
│  │  │ (Postgres)│(Redis)  │                        │  │
│  │  └─────────┘  └─────────┘                        │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 5.2 Infrastructure Components

| Component | Service | Configuration |
|-----------|---------|---------------|
| DNS | Route53 | - |
| CDN | CloudFront | Edge locations |
| Load Balancer | ALB | HTTPS, health checks |
| Compute | ECS Fargate | Auto-scaling |
| Database | RDS PostgreSQL | Multi-AZ |
| Cache | ElastiCache Redis | Cluster mode |
| Storage | S3 | Standard, versioning |
| Secrets | Secrets Manager | - |
| Monitoring | CloudWatch | - |

---

## 6. Security Architecture

### 6.1 Network Security

| Layer | Control |
|-------|---------|
| Edge | WAF, DDoS protection (Shield) |
| Network | Security Groups, NACLs |
| Application | Authentication, Authorization |
| Data | Encryption at rest, Encryption in transit |

### 6.2 Authentication & Authorization

```
┌─────────────────────────────────────────┐
│           OAuth 2.0 / OIDC              │
│                                         │
│  ┌─────────────┐    ┌─────────────┐    │
│  │   Auth      │    │   Token     │    │
│  │   Server    │───▶│   Service   │    │
│  └─────────────┘    └─────────────┘    │
│                            │            │
│                            ▼            │
│                     ┌─────────────┐    │
│                     │    JWT      │    │
│                     │   Tokens    │    │
│                     └─────────────┘    │
└─────────────────────────────────────────┘
```

### 6.3 Security Controls

- All traffic over HTTPS
- JWT with short expiry + refresh tokens
- API rate limiting
- Input validation & sanitization
- SQL injection prevention
- XSS protection
- CORS configuration
- Secrets management via Secrets Manager

---

## 7. Scalability

### 7.1 Horizontal Scaling

| Component | Scaling Strategy |
|-----------|------------------|
| API Services | Auto-scaling based on CPU/RPS |
| Database | Read replicas |
| Cache | Redis cluster |
| Queue | Multiple consumers |

### 7.2 Auto-Scaling Configuration

```yaml
# ECS Auto-scaling
Service:
  MinTasks: 2
  MaxTasks: 10
  TargetCPU: 70
  TargetMemory: 80
```

---

## 8. Monitoring & Observability

### 8.1 Monitoring Stack

| Layer | Tool | Metrics |
|-------|------|---------|
| Infrastructure | CloudWatch | CPU, Memory, Network |
| Application | Datadog/New Relic | APM, Errors, Traces |
| Logs | CloudWatch Logs / ELK | Application logs |
| Alerts | PagerDuty | Incident management |

### 8.2 Key Metrics

| Metric | Threshold | Action |
|--------|-----------|--------|
| CPU > 80% | 5 min | Scale out |
| Memory > 85% | 5 min | Scale out |
| Error Rate > 1% | 1 min | Alert |
| Response Time p99 > 1s | 5 min | Alert |
| Database Connections > 80% | 1 min | Alert |

### 8.3 Health Checks

```yaml
HealthCheck:
  Path: /health
  Interval: 30s
  Timeout: 5s
  HealthyThreshold: 2
  UnhealthyThreshold: 3
```

---

## 9. Disaster Recovery

### 9.1 DR Strategy

| Metric | Target | Strategy |
|--------|--------|----------|
| RPO (Recovery Point Objective) | < 1 hour | WAL archiving, S3 replication |
| RTO (Recovery Time Objective) | < 4 hours | Multi-region failover |

### 9.2 Backup Strategy

| Component | Backup Type | Frequency | Retention |
|-----------|-------------|-----------|-----------|
| Database | Full + WAL | Daily + Continuous | 30 days |
| S3 | Cross-region replication | Real-time | N/A |
| Config | Version control | On change | Forever |

---

## 10. Technology Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js, React | Web application |
| API Gateway | Kong / Custom | Routing, auth |
| Backend | Node.js, Express/Fastify | API services |
| Database | PostgreSQL | Primary data store |
| Cache | Redis | Session, caching |
| Search | Elasticsearch | Full-text search |
| Queue | RabbitMQ / SQS | Async processing |
| Storage | S3 | Files, assets |
| Monitoring | CloudWatch, Datadog | Observability |
| CI/CD | GitHub Actions | Deployment pipeline |
