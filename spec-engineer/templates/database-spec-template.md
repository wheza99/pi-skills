# Database Specification

## Informasi Dokumen

| Field | Value |
|-------|-------|
| Nama Database | [Nama] |
| DBMS | PostgreSQL / MySQL / MongoDB |
| Versi | [Versi] |
| Author | [Nama] |

---

## 1. Overview

### 1.1 Description

[Deskripsi singkat tentang database ini dan purpose-nya]

### 1.2 Design Principles

- Normalization level: 3NF
- Naming convention: snake_case
- Primary keys: UUID
- Soft delete: Yes/No
- Audit columns: created_at, updated_at, deleted_at

---

## 2. Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   users     │       │   posts     │       │  comments   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │───┐   │ id (PK)     │───┐   │ id (PK)     │
│ email       │   │   │ user_id(FK) │   │   │ post_id(FK) │
│ name        │   └──▶│ title       │   └──▶│ user_id(FK) │
│ role        │       │ content     │       │ content     │
└─────────────┘       │ status      │       └─────────────┘
                      └─────────────┘
```

---

## 3. Tables

### 3.1 users

**Description:** Menyimpan data user

| Column | Type | Nullable | Default | Constraints | Description |
|--------|------|----------|---------|-------------|-------------|
| id | UUID | No | gen_random_uuid() | PRIMARY KEY | Unique ID |
| email | VARCHAR(255) | No | - | UNIQUE | Email user |
| password_hash | VARCHAR(255) | No | - | - | Hashed password |
| name | VARCHAR(100) | No | - | - | Full name |
| role | VARCHAR(50) | No | 'user' | CHECK (role IN ('user', 'admin')) | User role |
| is_active | BOOLEAN | No | true | - | Active status |
| created_at | TIMESTAMP | No | NOW() | - | Created timestamp |
| updated_at | TIMESTAMP | No | NOW() | - | Updated timestamp |
| deleted_at | TIMESTAMP | Yes | NULL | - | Soft delete |

**Indexes:**

| Name | Columns | Type | Purpose |
|------|---------|------|---------|
| idx_users_email | email | UNIQUE | Fast email lookup |
| idx_users_created_at | created_at | BTREE | Sorting by date |
| idx_users_deleted_at | deleted_at | PARTIAL | Soft delete filter |

**Constraints:**

```sql
CONSTRAINT chk_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
```

---

### 3.2 posts

**Description:** Menyimpan data post/article

| Column | Type | Nullable | Default | Constraints | Description |
|--------|------|----------|---------|-------------|-------------|
| id | UUID | No | gen_random_uuid() | PRIMARY KEY | Unique ID |
| user_id | UUID | No | - | REFERENCES users(id) ON DELETE CASCADE | Author |
| title | VARCHAR(255) | No | - | - | Post title |
| slug | VARCHAR(255) | No | - | UNIQUE | URL slug |
| content | TEXT | No | - | - | Post content |
| status | VARCHAR(20) | No | 'draft' | CHECK (status IN ('draft', 'published', 'archived')) | Post status |
| published_at | TIMESTAMP | Yes | NULL | - | Publish date |
| created_at | TIMESTAMP | No | NOW() | - | Created timestamp |
| updated_at | TIMESTAMP | No | NOW() | - | Updated timestamp |
| deleted_at | TIMESTAMP | Yes | NULL | - | Soft delete |

**Indexes:**

| Name | Columns | Type | Purpose |
|------|---------|------|---------|
| idx_posts_user_id | user_id | BTREE | Filter by user |
| idx_posts_slug | slug | UNIQUE | Fast slug lookup |
| idx_posts_status | status | BTREE | Filter by status |
| idx_posts_published_at | published_at | BTREE DESC | Sort by publish date |

---

## 4. Migrations

### 001_create_users_table.sql

```sql
-- Up
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    
    CONSTRAINT uk_users_email UNIQUE (email),
    CONSTRAINT chk_users_role CHECK (role IN ('user', 'admin'))
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_deleted_at ON users(deleted_at) WHERE deleted_at IS NULL;

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Down
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP TABLE IF EXISTS users;
```

### 002_create_posts_table.sql

```sql
-- Up
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    
    CONSTRAINT fk_posts_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_posts_slug UNIQUE (slug),
    CONSTRAINT chk_posts_status CHECK (status IN ('draft', 'published', 'archived'))
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);

CREATE TRIGGER update_posts_updated_at 
    BEFORE UPDATE ON posts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Down
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
DROP TABLE IF EXISTS posts;
```

---

## 5. Seed Data

```sql
-- Insert default admin user
INSERT INTO users (email, password_hash, name, role) 
VALUES (
    'admin@example.com',
    '$2b$12$...', -- bcrypt hash
    'Admin',
    'admin'
);
```

---

## 6. Query Patterns

### Common Queries

```sql
-- Get active users with post count
SELECT u.id, u.name, u.email, COUNT(p.id) as post_count
FROM users u
LEFT JOIN posts p ON u.id = p.user_id AND p.deleted_at IS NULL
WHERE u.deleted_at IS NULL
GROUP BY u.id
ORDER BY post_count DESC;

-- Get published posts with author
SELECT p.*, u.name as author_name
FROM posts p
JOIN users u ON p.user_id = u.id
WHERE p.status = 'published' 
  AND p.deleted_at IS NULL
  AND p.published_at <= NOW()
ORDER BY p.published_at DESC
LIMIT 10;
```

---

## 7. Performance Considerations

### Indexing Strategy

- Index semua foreign keys
- Index kolom yang sering di-WHERE
- Index kolom yang sering di-ORDER BY
- Gunakan partial index untuk soft delete
- Pertimbangkan composite index untuk query yang sering dipakai bersama

### Query Optimization

- Gunakan EXPLAIN ANALYZE untuk analyze query
- Hindari SELECT * di production
- Gunakan pagination untuk list data
- Pertimbangkan denormalization untuk read-heavy tables

---

## 8. Backup & Recovery

### Backup Strategy

| Type | Frequency | Retention |
|------|-----------|-----------|
| Full backup | Daily | 30 days |
| Incremental | Hourly | 7 days |
| WAL archiving | Continuous | 7 days |

### Recovery Point Objective (RPO)
- Target: < 1 hour data loss

### Recovery Time Objective (RTO)
- Target: < 4 hours downtime
