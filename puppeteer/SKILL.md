---
name: puppeteer
description: Browser automation dengan Puppeteer. Gunakan untuk screenshot, PDF, web scraping, form filling, click otomatis, network monitoring, device emulation, cookie management, dan interaksi halaman web lainnya.
---

# Puppeteer Browser Automation

Skill ini menyediakan browser automation menggunakan Puppeteer untuk berbagai tugas web automation.

## Setup

Jalankan sekali sebelum menggunakan:

```bash
cd .pi/skills/puppeteer && npm install
```

## Script yang Tersedia

### 1. Screenshot

Ambil screenshot halaman web.

```bash
cd .pi/skills/puppeteer && node scripts/screenshot.js <url> [options]
```

**Options:**
- `--output=<path>`: Nama file output (default: screenshot.png)
- `--full-page`: Screenshot seluruh halaman
- `--width=<n>`: Lebar viewport (default: 1920)
- `--height=<n>`: Tinggi viewport (default: 1080)
- `--selector=<css>`: Screenshot elemen tertentu
- `--wait-for=<css>`: Tunggu elemen muncul

**Contoh:**
```bash
node scripts/screenshot.js https://example.com --output=page.png --full-page
node scripts/screenshot.js https://example.com --selector=".main-content" --output=content.png
```

---

### 2. PDF Generation

Konversi halaman web ke PDF.

```bash
cd .pi/skills/puppeteer && node scripts/pdf.js <url> [options]
```

**Options:**
- `--output=<path>`: Nama file output (default: output.pdf)
- `--format=<format>`: Ukuran kertas (A4, Letter, dll)
- `--landscape=true`: Orientasi landscape
- `--margin-top/bottom/left/right=<value>`: Margin (default: 1cm)

**Contoh:**
```bash
node scripts/pdf.js https://example.com --output=page.pdf
node scripts/pdf.js https://example.com --format=A4 --landscape=true
```

---

### 3. Web Scraping

Ekstrak konten dari halaman web.

```bash
cd .pi/skills/puppeteer && node scripts/scrape.js <url> [options]
```

**Options:**
- `--text=true`: Ekstrak teks halaman
- `--html=true`: Ekstrak HTML halaman
- `--links=true`: Ekstrak semua link
- `--images=true`: Ekstrak semua gambar
- `--tables=true`: Ekstrak semua tabel
- `--selectors=<css>`: Ekstrak elemen spesifik (comma-separated)

**Contoh:**
```bash
node scripts/scrape.js https://example.com --links=true --images=true
node scripts/scrape.js https://news.ycombinator.com --selectors="tr.athing .titleline > a"
```

---

### 4. Form Interaction

Interaksi dengan form dan elemen halaman.

```bash
cd .pi/skills/puppeteer && node scripts/interact.js <url> --actions='[...]' [options]
```

**Action types:**
- `type`: Ketik teks ke input `{"type":"type","selector":"input","value":"text"}`
- `click`: Klik elemen `{"type":"click","selector":"button"}`
- `select`: Pilih opsi `{"type":"select","selector":"select","value":"option"}`
- `check`: Centang checkbox `{"type":"check","selector":"input[type=checkbox]"}`
- `hover`: Hover elemen `{"type":"hover","selector":".element"}`
- `press`: Tekan tombol `{"type":"press","key":"Enter"}`
- `scroll`: Scroll halaman `{"type":"scroll","y":500}`
- `wait`: Tunggu `{"type":"wait","selector":".element"}`
- `goto`: Navigasi `{"type":"goto","url":"https://..."}`
- `evaluate`: Jalankan JS `{"type":"evaluate","script":"() => document.title"}`

**Contoh:**
```bash
node scripts/interact.js https://google.com --actions='[{"type":"type","selector":"input[name=q]","value":"puppeteer"},{"type":"press","key":"Enter"}]' --screenshot=result.png
```

---

### 5. Cookies Management

Kelola cookies browser.

```bash
cd .pi/skills/puppeteer && node scripts/cookies.js <url> --action=<action> [options]
```

**Actions:**
- `get`: Ambil semua cookies (default)
- `set`: Set cookie `--cookie='{"name":"test","value":"123"}'`
- `delete`: Hapus cookie `--cookie-name=xxx` atau `--delete-all=true`
- `save`: Simpan cookies ke file `--output=cookies.json`

**Contoh:**
```bash
node scripts/cookies.js https://google.com --action=get
node scripts/cookies.js https://example.com --action=save --output=my-cookies.json
```

---

### 6. Network Monitoring

Monitor request/response network.

```bash
cd .pi/skills/puppeteer && node scripts/network.js <url> [options]
```

**Options:**
- `--block=<pattern>`: Block request matching pattern (comma-separated)
- `--include-body=true`: Sertakan response body
- `--console=true`: Capture console messages
- `--group-by-type=true`: Group request by resource type
- `--verbose=true`: Tampilkan semua request

**Contoh:**
```bash
node scripts/network.js https://example.com --group-by-type=true
node scripts/network.js https://example.com --block=image,stylesheet
```

---

### 7. Device Emulation

Emulasi perangkat mobile atau custom viewport.

```bash
cd .pi/skills/puppeteer && node scripts/emulate.js <url> [options]
```

**Options:**
- `--device=<name>`: Nama device preset (iPhone 13, Galaxy S5, dll)
- `--width=<n>`: Lebar viewport
- `--height=<n>`: Tinggi viewport
- `--mobile=true`: Emulasi mobile
- `--touch=true`: Enable touch
- `--user-agent=<ua>`: Custom user agent
- `--list-devices`: Daftar device preset

**Contoh:**
```bash
node scripts/emulate.js --list-devices
node scripts/emulate.js https://example.com --device="iPhone 13" --screenshot=iphone.png
node scripts/emulate.js https://example.com --width=375 --height=667 --mobile=true
```

---

### 8. Wait Conditions

Tunggu kondisi tertentu pada halaman.

```bash
cd .pi/skills/puppeteer && node scripts/wait.js <url> --conditions='[...]' [options]
```

**Condition types:**
- `selector`: Tunggu elemen muncul
- `xpath`: Tunggu XPath
- `function`: Tunggu fungsi return true
- `timeout`: Tunggu dalam ms
- `navigation`: Tunggu navigasi
- `response`: Tunggu response dengan URL pattern
- `request`: Tunggu request dengan URL pattern

**Contoh:**
```bash
node scripts/wait.js https://example.com --conditions='[{"type":"selector","value":"h1"}]'
```

---

### 9. JavaScript Evaluation

Jalankan JavaScript di halaman.

```bash
cd .pi/skills/puppeteer && node scripts/evaluate.js <url> [options]
```

**Options:**
- `--script=<js>`: JavaScript code
- `--script-file=<path>`: File JavaScript
- `--title=true`: Ambil title
- `--text=true`: Ambil teks
- `--html=true`: Ambil HTML
- `--query-selector=<css>`: Query elemen pertama
- `--query-selector-all=<css>`: Query semua elemen

**Contoh:**
```bash
node scripts/evaluate.js https://example.com --title=true --text=true
node scripts/evaluate.js https://example.com --script="() => ({title: document.title, links: document.links.length})"
```

---

### 10. Context Settings

Set geolocation, timezone, locale.

```bash
cd .pi/skills/puppeteer && node scripts/context.js <url> [options]
```

**Options:**
- `--geolocation=<lat,lng>`: Set lokasi
- `--timezone=<tz>`: Set timezone (Asia/Jakarta, America/New_York, dll)
- `--locale=<lang>`: Set locale (id-ID, en-US, dll)
- `--offline=true`: Mode offline

**Contoh:**
```bash
node scripts/context.js https://example.com --timezone="Asia/Jakarta" --locale="id-ID"
node scripts/context.js https://maps.google.com --geolocation="-6.2088,106.8456"
```

---

### 11. Multiple Pages

Proses multiple halaman sekaligus.

```bash
cd .pi/skills/puppeteer && node scripts/pages.js '<urls-json>' [options]
```

**Options:**
- `--text=true`: Ekstrak teks dari semua halaman
- `--screenshot-dir=<dir>`: Direktori untuk screenshots

**Contoh:**
```bash
node scripts/pages.js '["https://example.com","https://example.org"]'
node scripts/pages.js '[{"url":"https://example.com","extract":{"title":"h1"}}]'
```

---

### 12. File Upload

Upload file ke form.

```bash
cd .pi/skills/puppeteer && node scripts/upload.js <url> --files=<path> [options]
```

**Options:**
- `--files=<path1,path2>`: Path file (comma-separated)
- `--selector=<css>`: Selector input file
- `--submit=<css>`: Klik tombol submit setelah upload

**Contoh:**
```bash
node scripts/upload.js https://upload-site.com --files="./test.txt"
node scripts/upload.js https://upload-site.com --files="./a.txt,./b.txt" --submit="button[type=submit]"
```

---

### 13. Dialog Handling

Handle alert, confirm, prompt.

```bash
cd .pi/skills/puppeteer && node scripts/dialog.js <url> [options]
```

**Options:**
- `--trigger=<css>`: Klik elemen untuk trigger dialog
- `--accept=<pattern>`: Accept dialog matching pattern
- `--dismiss=<pattern>`: Dismiss dialog matching pattern
- `--prompt-text=<text>`: Text untuk prompt

**Contoh:**
```bash
node scripts/dialog.js https://example.com --trigger=".alert-btn" --accept=alert
```

---

### 14. Mouse & Keyboard Input

Simulasi input mouse dan keyboard.

```bash
cd .pi/skills/puppeteer && node scripts/input.js <url> --actions='[...]' [options]
```

**Action types:**
- `click`, `dblclick`, `rightclick`, `hover`
- `mouse-move`, `mouse-down`, `mouse-up`, `drag`
- `type`, `press`, `keydown`, `keyup`, `send-char`
- `scroll`

**Contoh:**
```bash
node scripts/input.js https://example.com --actions='[{"type":"hover","selector":".menu"},{"type":"click","selector":".menu-item"}]'
```

---

### 15. HTML Rendering

Render HTML string/file ke gambar atau PDF.

```bash
cd .pi/skills/puppeteer && node scripts/html.js <html|file|url> --output=<path>
```

**Contoh:**
```bash
node scripts/html.js "<h1>Hello</h1>" --output=hello.png
node scripts/html.js ./page.html --output=page.pdf
```

## Tips

1. **Headless mode**: Semua script berjalan headless secara default
2. **Timeout**: Default 30 detik, bisa diubah dengan `--timeout=<ms>`
3. **Selectors**: Gunakan CSS selectors standar
4. **JSON di CLI**: Gunakan single quotes untuk JSON di command line
5. **Path**: Semua path relatif terhadap direktori `.pi/skills/puppeteer/`

## Troubleshooting

- Jika puppeteer crash, coba update: `npm update puppeteer`
- Untuk website dengan anti-bot, mungkin perlu stealth plugin
- Beberapa website membutuhkan `--wait-for` untuk menunggu konten dimuat
