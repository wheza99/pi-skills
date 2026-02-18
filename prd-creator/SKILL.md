---
name: prd-creator
description: Skill untuk membuat Product Requirements Document (PRD). Gunakan ketika user ingin mendokumentasikan ide produk, fitur baru, atau requirements dari perspektif bisnis dan user.
---

# PRD Creator

Skill ini membantu membuat Product Requirements Document (PRD) yang terstruktur dan lengkap.

## Dokumen Terkait

```
┌─────────────────────────────────────────┐
│  1. PRODUCT VISION (product-vision)     │  ← WHY (buat pertama kali)
│     Problem, Opportunity, North Star    │
└──────────────────────┬──────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────┐
│  2. PRD (Skill ini)                     │  ← WHAT
│     Features, Requirements, User Stories│
└──────────────────────┬──────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────┐
│  3. ENGINEERING SPEC (spec-engineer)    │  ← HOW
│     Architecture, API, Database         │
└─────────────────────────────────────────┘
```

## Kapan Menggunakan Skill Ini

- **Setelah Product Vision** selesai dibuat
- User ingin mendokumentasikan requirements untuk fitur baru
- User butuh dokumen untuk komunikasi dengan stakeholder
- User ingin mengubah vision menjadi detail requirements

## Cara Menggunakan

1. **Cek apakah sudah ada Product Vision** - jika belum, arahkan user untuk membuatnya dulu dengan `product-vision` skill
2. **Baca Product Vision** untuk memahami north star dan problem statement
3. **Kumpulkan informasi** dari user tentang fitur yang ingin dibuat
4. **Baca template** PRD dari `templates/prd-template.md`
5. **Isi template** berdasarkan vision dan informasi dari user
6. **Tanyakan** jika ada bagian yang kurang jelas

## Pertanyaan yang Harus Ditanyakan

Untuk membuat PRD yang baik, tanyakan hal-hal berikut:

### Wajib:
- **Nama Produk/Proyek**: Apa nama produk atau fitur ini?
- **Tujuan/Bisnis Goal**: Mengapa produk ini dibuat? Masalah apa yang ingin dipecahkan?
- **Target User**: Siapa yang akan menggunakan produk ini?

### Penting:
- **User Stories**: Apa saja hal yang user ingin lakukan?
- **Fitur Utama**: Apa saja fitur yang harus ada (MVP)?
- **Success Metrics**: Bagaimana mengukur keberhasilan produk?
- **Timeline**: Kapan target rilis?

### Opsional:
- **Competitor Analysis**: Apa referensi dari kompetitor?
- **Constraints**: Apa batasan-batasan yang ada?
- **Out of Scope**: Apa yang TIDAK termasuk dalam scope?

## Struktur PRD Output

```
1. Overview
   - Nama Produk
   - Ringkasan Eksekutif
   
2. Background & Problem Statement
   - Konteks
   - Masalah yang ingin dipecahkan
   
3. Goals & Success Metrics
   - Business Goals
   - Success Metrics/KPIs
   
4. Target Users
   - User Personas
   - User Journey
   
5. User Stories & Requirements
   - User Stories
   - Functional Requirements
   - Non-Functional Requirements
   
6. Features & Scope
   - MVP Features
   - Future Features (Backlog)
   - Out of Scope
   
7. Timeline & Milestones
   - Phases
   - Key Dates
   
8. Dependencies & Risks
   - Dependencies
   - Risks & Mitigation
   
9. Appendix (opsional)
   - References
   - Competitor Analysis
```

## Template

Lihat template lengkap di: [templates/prd-template.md](templates/prd-template.md)

## Tips

- Gunakan bahasa yang jelas dan non-teknis
- Fokus pada WHAT dan WHY, bukan HOW
- Buat user stories dengan format: "Sebagai [role], saya ingin [action], sehingga [benefit]"
- Prioritaskan fitur dengan MoSCoW (Must have, Should have, Could have, Won't have)
- Sertakan diagram atau mockup jika membantu penjelasan
