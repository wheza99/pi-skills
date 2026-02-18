---
name: product-vision
description: Skill untuk membuat Product Vision Document / Product Brief. Gunakan SEBELUM PRD untuk mendefinisikan problem statement, north star metric, dan strategic direction. Ini adalah dokumen level tertinggi yang menjadi "North Star" produk.
---

# Product Vision

Skill ini membantu membuat **Product Vision Document** (juga dikenal sebagai Product Brief, Opportunity Canvas, atau Vision Board) yang menjadi fondasi dan "North Star" untuk semua keputusan produk.

## Kapan Menggunakan Skill Ini

- **Paling awal** - sebelum buat PRD
- User punya ide tapi belum jelas problem statement-nya
- User ingin align stakeholders pada satu visi
- User ingin mendefinisikan north star metric
- User mau validate opportunity sebelum build
- User butuh dokumen untuk pitch atau buy-in

## Hubungan dengan Dokumen Lain

```
┌─────────────────────────────────────────┐
│  1. PRODUCT VISION (Skill ini)          │  ← WHY
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
│  3. ENGINEERING SPEC (spec-engineer)    │  ← HOW
│     Architecture, API, Database         │
└─────────────────────────────────────────┘
```

## Cara Menggunakan

1. **Kumpulkan informasi** dari user melalui pertanyaan guiding
2. **Baca template** dari `templates/vision-template.md`
3. **Help user articulate** problem dan opportunity dengan jelas
4. **Define north star metric** yang measurable
5. **Dokumentasikan** dalam format yang jelas

## Pertanyaan yang Harus Ditanyakan

### Problem Space (Wajib)

1. **Problem Statement**
   - Masalah apa yang ingin dipecahkan?
   - Siapa yang mengalami masalah ini?
   - Seberapa besar masalahnya? Ada data?

2. **Current State**
   - Bagaimana user menyelesaikan masalah ini saat ini?
   - Apa pain points dari solusi yang ada?

3. **Opportunity**
   - Mengapa masalah ini worth solving?
   - Apa konsekuensi jika tidak dipecahkan?
   - Apa potential impact-nya?

### Target Outcome (Wajib)

4. **North Star Metric**
   - Jika hanya 1 metric yang mengukur sukses, apa itu?
   - Metric ini harus mencerminkan value yang diberikan ke user

5. **Key Results / Success Criteria**
   - Apa outcome yang kita targetkan dalam 3/6/12 bulan?
   - Bagaimana kita tahu kalau produk ini sukses?

6. **Hypothesis**
   - Apa assumption utama kita?
   - Apa yang harus benar agar produk ini sukses?

### Scope & Context (Penting)

7. **Target Users**
   - Siapa primary persona?
   - Apa characteristics mereka?

8. **Competitive Landscape**
   - Siapa kompetitor / alternatif yang ada?
   - Apa differentiation kita?

9. **Constraints**
   - Apa batasan waktu, budget, resources?
   - Apa technical atau business constraints?

10. **Out of Scope**
    - Apa yang TIDAK termasuk di phase pertama?
    - Apa yang explicit excluded?

## North Star Metric Guidelines

### Karakteristik North Star Metric yang Baik

✅ **DO:**
- Mencerminkan value ke user, bukan vanity metric
- Dapat diukur dan di-track
- Long-term oriented
- Dapat di-influence oleh tim produk
- Simple dan mudah dipahami

❌ **DON'T:**
- Revenue-focused (itu outcome, bukan value)
- Terlalu banyak metrics (pilih 1 utama)
- Metric yang tidak bisa dikontrol tim
- Vanity metrics (downloads, signups tanpa engagement)

### Contoh North Star Metrics

| Produk | North Star Metric | Alasan |
|--------|-------------------|--------|
| Spotify | Time spent listening | Mencerminkan engagement & value |
| Airbnb | Nights booked | Mencerminkan transaksi sukses |
| Slack | Messages sent per week | Mencerminkan active usage |
| Zoom | Monthly active hosts | Mencerminkan adoption |
| E-commerce | Monthly active buyers with purchase | Mencerminkan transacting users |
| SaaS B2B | Weekly active users | Mencerminkan product stickiness |

## Format Output

```
PRODUCT VISION DOCUMENT
=======================

1. Executive Summary (2-3 kalimat)

2. Problem Statement
   - The Problem
   - Who is affected
   - Current pain

3. Opportunity & Impact
   - Why now?
   - Market opportunity
   - Potential impact

4. Vision & Strategy
   - Product vision statement
   - Strategic approach
   - Differentiation

5. Target Users
   - Primary persona
   - User segments

6. North Star Metric
   - The ONE metric
   - Why this metric
   - Current baseline (if any)

7. Key Results (OKRs)
   - 3-month target
   - 6-month target
   - 12-month target

8. Hypotheses & Assumptions
   - What must be true
   - Riskiest assumptions

9. Scope
   - In scope (MVP)
   - Out of scope
   - Future considerations

10. Constraints & Dependencies
    - Time/Budget/Resources
    - Technical constraints
    - Dependencies

11. Stakeholders & Approval
    - Who needs to sign off
```

## Template

Lihat template lengkap di: [templates/vision-template.md](templates/vision-template.md)

## Tips

### Menulis Problem Statement yang Kuat

❌ **Lemah:**
> "User butuh aplikasi untuk manajemen keuangan"

✅ **Kuat:**
> "70% UMKM di Indonesia tidak memiliki sistem pencatatan keuangan yang proper. Akibatnya, mereka tidak bisa track cash flow, sulit mengajukan pinjaman, dan 60% gulung tikar dalam 3 tahun pertama."

### Vision Statement Formula

```
"For [target user], who [statement of need/opportunity],
[product name] is a [product category] that [key benefit].
Unlike [competitors/alternatives], our product [differentiation]."
```

**Contoh:**
> "Untuk UMKM di Indonesia yang kesulitan mengelola keuangan, BukuKita adalah aplikasi pencatatan keuangan yang memberikan insight otomatis tentang kondisi bisnis. Berbeda dengan software akuntansi tradisional yang rumit, BukuKita dirancang untuk pengguna non-akuntan dengan setup dalam 5 menit."

### Validasi Vision

Sebelum lanjut ke PRD, pastikan:
- [ ] Problem statement didukung data atau research
- [ ] North star metric jelas dan measurable
- [ ] Hypotheses teridentifikasi
- [ ] Stakeholders aligned dengan vision
- [ ] Scope MVP realistis dalam constraints yang ada

## Next Steps

Setelah Product Vision selesai:
1. Review dan approve dengan stakeholders
2. Lanjut ke **PRD** untuk detail requirements
3. Lakukan user research jika diperlukan untuk validate hypotheses
