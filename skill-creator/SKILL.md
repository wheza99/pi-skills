---
name: skill-creator
description: Membantu membuat skill baru untuk pi coding agent. Gunakan skill ini ketika user ingin membuat skill baru, mendefinisikan workflow, atau membuat otomasi untuk tugas tertentu.
---

# Skill Creator

Skill ini membantu kamu membuat skill baru untuk pi coding agent dengan mudah dan terstruktur.

## Cara Menggunakan

Ketika user ingin membuat skill baru, ikuti langkah-langkah berikut:

### 1. Kumpulkan Informasi

Tanyakan kepada user:
- **Nama skill**: Nama yang deskriptif (huruf kecil, angka, tanda hubung)
- **Deskripsi**: Apa yang skill ini lakukan dan kapan harus digunakan
- **Fungsi utama**: Apa saja yang akan dilakukan skill ini
- **Script/helper yang dibutuhkan**: Apakah perlu script bash, JavaScript, Python, dll.
- **Referensi/dokumentasi**: Apakah ada dokumentasi tambahan yang perlu disertakan

### 2. Buat Struktur Skill

Buat direktori skill di salah satu lokasi:
- **Project level**: `.pi/skills/<nama-skill>/`
- **Global level**: `~/.pi/agent/skills/<nama-skill>/`

Struktur standar:
```
<nama-skill>/
├── SKILL.md              # Wajib: frontmatter + instruksi
├── scripts/              # Script helper (opsional)
│   └── <script>.sh
├── references/           # Dokumentasi tambahan (opsional)
│   └── <dokumen>.md
└── assets/               # Template atau file statis (opsional)
    └── <template>.json
```

### 3. Buat File SKILL.md

Format SKILL.md:

```markdown
---
name: <nama-skill>
description: <deskripsi skill max 1024 karakter>
---

# <Nama Skill>

## Setup

Instruksi setup yang dijalankan sekali sebelum menggunakan skill:
\`\`\`bash
# Perintah setup jika diperlukan
\`\`\`

## Penggunaan

Cara menggunakan skill ini:

\`\`\`bash
# Contoh perintah
\`\`\`

## Fitur

- Fitur 1
- Fitur 2
- dst.

## Referensi

Lihat [referensi](references/<file>.md) untuk detail lebih lanjut.
```

### 4. Validasi

Pastikan:
- [ ] Nama skill sesuai dengan nama direktori
- [ ] Nama menggunakan huruf kecil, angka, dan tanda hubung saja
- [ ] Nama tidak diawali/diakhiri tanda hubung
- [ ] Nama tidak memiliki tanda hubung berturut-turut
- [ ] Deskripsi tidak lebih dari 1024 karakter
- [ ] Deskripsi jelas dan spesifik

## Template Skill

Berikut template dasar yang bisa langsung digunakan:

### SKILL.md Template

```markdown
---
name: my-skill
description: Deskripsi yang jelas tentang apa yang skill ini lakukan dan kapan harus menggunakannya.
---

# My Skill

## Setup

\`\`\`bash
# Setup commands here
\`\`\`

## Usage

\`\`\`bash
# Usage commands here
\`\`\`
```

## Contoh Skill Sederhana

Berikut contoh skill untuk membuat file README:

```
readme-generator/
├── SKILL.md
└── templates/
    └── readme-template.md
```

**SKILL.md:**
```markdown
---
name: readme-generator
description: Menghasilkan file README.md untuk proyek. Gunakan ketika membuat atau memperbarui dokumentasi proyek.
---

# README Generator

## Penggunaan

Baca template dan sesuaikan dengan proyek:

\`\`\`bash
cat templates/readme-template.md
\`\`\`

Kemudian buat file README.md berdasarkan template.
```

## Tips

1. **Deskripsi yang baik**: Jelaskan APA yang dilakukan dan KAPAN harus digunakan
2. **Path relatif**: Gunakan path relatif dari direktori skill
3. **Progressive disclosure**: Letakkan instruksi utama di SKILL.md, detail di references/
4. **Script helper**: Buat script untuk tugas yang kompleks
5. **Contoh konkret**: Sertakan contoh penggunaan

## Referensi

- [Agent Skills Specification](https://agentskills.io/specification)
- [Pi Skills Repository](https://github.com/badlogic/pi-skills)
- [Anthropic Skills](https://github.com/anthropics/skills)
