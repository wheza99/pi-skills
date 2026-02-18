---
name: spec-engineer
description: Skill untuk membuat Engineering Specification (Spec). Gunakan ketika user ingin mendokumentasikan implementasi teknis, arsitektur sistem, API design, database schema, atau technical requirements.
---

# Spec Engineer

Skill ini membantu membuat Engineering Specification yang detail dan terstruktur untuk implementasi teknis.

## Hubungan dengan Dokumen Lain

```
┌─────────────────────────────────────────┐
│  1. PRODUCT VISION (product-vision)     │  ← WHY (buat pertama kali)
│     Problem, Opportunity, North Star    │
└──────────────────────┬──────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────┐
│  2. PRD (prd-creator)                   │  ← WHAT
│     Features, Requirements, User Stories│
└──────────────────────┬──────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────┐
│  3. ENGINEERING SPEC (Skill ini)        │  ← HOW
│     Architecture, API, Database         │
└─────────────────────────────────────────┘
```

## Kapan Menggunakan Skill Ini

- **Setelah PRD** selesai dibuat
- User ingin mendokumentasikan arsitektur sistem
- User ingin membuat API specification
- User ingin mendesain database schema
- User ingin membuat technical design document

## Cara Menggunakan

1. **Cek apakah sudah ada PRD** - jika belum, arahkan user untuk membuatnya dulu dengan `prd-creator` skill
2. **Baca PRD** untuk memahami requirements dan user stories
3. **Pilih jenis spec** yang dibutuhkan:
   - Full Technical Spec (semua aspek)
   - API Specification (fokus API)
   - Database Specification (fokus DB)
   - Architecture Specification (fokus sistem)
4. **Baca template** yang sesuai dari `templates/`
5. **Isi template** dengan detail teknis
6. **Tanyakan** jika ada bagian yang perlu clarification

## Pertanyaan yang Harus Ditanyakan

### Wajib:
- **Referensi PRD**: Apakah sudah ada PRD? (Jika ada, baca dulu)
- **Tech Stack**: Framework, bahasa, database apa yang digunakan?
- **Scope**: Apa saja yang perlu di-spec?

### Penting:
- **API Requirements**: Endpoint apa saja yang dibutuhkan?
- **Data Model**: Entity apa saja dan relasinya?
- **Authentication**: Bagaimana sistem auth yang digunakan?
- **Performance**: Ada SLA atau performance requirement?
- **Integrations**: Perlu integrasi dengan sistem lain?

### Opsional:
- **Existing System**: Apakah integrasi dengan sistem yang sudah ada?
- **Compliance**: Ada requirement security/compliance?
- **Infrastructure**: Preference untuk deployment (cloud, on-premise)?

## Jenis Specification

### 1. Full Technical Spec
Dokumen lengkap yang mencakup semua aspek teknis. Gunakan untuk fitur/proyek besar.

Template: [templates/full-spec-template.md](templates/full-spec-template.md)

### 2. API Specification
Fokus pada REST/GraphQL API design. Cocok untuk backend services.

Template: [templates/api-spec-template.md](templates/api-spec-template.md)

### 3. Database Specification
Fokus pada data model, schema, dan query patterns.

Template: [templates/database-spec-template.md](templates/database-spec-template.md)

### 4. Architecture Specification
Fokus pada system design, components, dan infrastructure.

Template: [templates/architecture-spec-template.md](templates/architecture-spec-template.md)

## Struktur Spec Output (Full)

```
1. Overview
   - Summary
   - Goals
   - Non-Goals

2. System Architecture
   - High-level Design
   - Components
   - Data Flow

3. API Specification
   - Endpoints
   - Request/Response Schema
   - Authentication

4. Database Design
   - ERD
   - Schema
   - Indexes
   - Migrations

5. Implementation Details
   - Algorithms
   - Business Logic
   - Error Handling

6. Security
   - Authentication/Authorization
   - Data Protection
   - Vulnerability Considerations

7. Performance
   - Caching Strategy
   - Query Optimization
   - Load Handling

8. Testing Strategy
   - Unit Tests
   - Integration Tests
   - Performance Tests

9. Deployment
   - Infrastructure
   - CI/CD
   - Monitoring

10. Appendix
    - References
    - Decisions Log
```

## Best Practices

### API Design:
- Gunakan RESTful conventions atau GraphQL best practices
- Versioning: `/api/v1/resource`
- Consistent naming: snake_case atau camelCase
- Proper HTTP methods dan status codes
- Pagination untuk list endpoints
- Rate limiting consideration

### Database Design:
- Normalisasi vs denormalisasi sesuai use case
- Index pada kolom yang sering di-query
- Soft delete vs hard delete
- Audit trail (created_at, updated_at, deleted_at)
- Foreign keys dan constraints

### Security:
- Input validation dan sanitization
- SQL injection prevention
- XSS prevention
- CORS configuration
- Rate limiting
- Secrets management

### Performance:
- Query optimization
- Caching strategy (Redis, CDN)
- Lazy loading
- Database connection pooling
- Async processing untuk heavy operations

## Tips

- Fokus pada HOW, bukan WHAT
- Buat diagram untuk memvisualisasikan arsitektur
- Sertakan code examples untuk kompleks logic
- Dokumentasikan decision dan alasannya (ADR)
- Pertimbangkan edge cases dan error scenarios
- Pikirkan scalability dan maintainability
