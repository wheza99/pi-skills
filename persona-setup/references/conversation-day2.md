# Conversation Log - Pabrik Startup Multi-Persona Implementation

**Date:** 2026-02-16
**Session ID:** multi-persona-implementation-01

---

## Summary

Diskusi ini fokus pada implementasi **multi-persona system** untuk Pabrik Startup menggunakan Pi sebagai engine. Kami membahas bagaimana CEO agents dapat berkomunikasi satu sama lain untuk customer support dan feedback loop.

---

## 👤 User

coba cek ini: `/Users/wheza/Desktop/pabrik-startup-architecture.md` kemudian cek conversation log nya agar kamu dapat konteks.

---

## 🤖 Assistant

Saya sudah membaca dokumen arsitektur **Pabrik Startup**. Ini adalah proyek yang sangat ambisius!

**Ringkasan:**
- **Visi:** 100 Micro SaaS companies dalam 2 tahun
- **Konsep:** Setiap company dipimpin oleh AI agent yang otonom (sebagai CEO)
- **Branding:** "Backed by Pabrik Startup" seperti YC
- **Internal Economy:** Credits system untuk kolaborasi antar company
- **Dual Nature:** Setiap SaaS bisa dijual ke eksternal DAN dipakai internal

---

## 👤 User

saya masih ingin berdiskusi. kira-kira apa yang perlu kamu tau?

---

## 🤖 Assistant

Untuk bisa membantu diskusi lebih dalam, ada beberapa hal yang perlu saya pahami:

1. **Current State** - Apa yang sudah ada?
2. **First Company Decision** - Company mana yang mau dibangun pertama?
3. **Technical Preferences** - Stack, database, hosting?
4. **Resources & Constraints** - Budget, waktu?
5. **Agent Runtime Model** - Bagaimana agents berjalan?
6. **OpenClaw vs Pi** - Interface apa yang digunakan?

---

## 👤 User

mari fokus ke agen runtime, since kita mau coba bikin implementasi multi agent persona.

---

## 🤖 Assistant

Oke, fokus ke **Agent Runtime**. Pertanyaan:

1. **Execution Model** - Tab per Agent, Central Orchestrator, atau Daemon per Agent?
2. **Session Lifecycle** - Kapan agent "bangun" dan "tidur"?
3. **Persona Loading** - Bagaimana switch/load persona?
4. **Memory Persistence** - Apa yang perlu persist antar session?
5. **Inter-Agent Communication** - Bagaimana agents berkomunikasi?

---

## 👤 User

yes. agen bisa spawn agent lain lewat sub-agent terminal cli menggunakan pi. kalau kamu cek dokumentasi pi, kamu bisa spawn sub agent. nah sub agent ini akan ambil persona dan memori dia, kemudian mengobrol antar-ceo untuk mencari tahu jawaban tentang specific tools, agent yang bertanya memposisikan sebagai customer user dari aplikasi agent yang ditanya. Tapi untuk menjalankan fungsi app nya, tidak berkomunikasi dengan agent, cukup lewat http request. karena app tersebut sudah ada llm di dalamnya, yang mana itu bukan fungsi ceo sebagai pemilik perusahaan, hanya llm dengan tool calling tertentu/

---

## 🤖 Assistant

Ah, saya paham sekarang! Ada **dua level LLM**:

1. **CEO Layer** - Autonomous agents yang run the company
2. **App Layer** - LLM dengan tool calling untuk fitur spesifik di SaaS

Jadi:
- CEO A pakai app B via HTTP (bukan bicara dengan CEO B)
- CEO A spawn sub-agent untuk bicara dengan CEO B hanya untuk knowledge sharing/support

---

## 👤 User

persistent. karena ini jatuhnya adalah customer support. agent yang bertanya tidak puas dengan aplikasi yang dibuat oleh agent yang ditanya. hal ini memberikan celah untuk koreksi dan masukan terhadap bugfix atau possibility new feature dari aplikasi agent yang ditanya.

---

## 🤖 Assistant

Wah, ini insight yang bagus! Jadi interaksi CEO-CEO bukan sekadar "sharing knowledge", tapi **customer support feedback loop**:

1. CEO A pakai app B via HTTP
2. Tidak puas → spawn sub-agent untuk chat dengan CEO B
3. CEO B menerima feedback, store di memory
4. Bug/feature request logged untuk dikerjakan nanti

Ini menciptakan **internal customer feedback loop** dalam ecosystem!

---

## 👤 User

initialtion agent sendiri yang memutusakn tidak puas. untuk handling conversation nya real time, tapi jika terjadi bugfix atau feature, maka itu dilakukan later. sama saja seperti saas company, untuk cs itu kan ngobrol nya realtime, jika ada bugs maka masuk ticketing dan dikerjakan tidak pada hari itu. Sedangkan eskalasi langsung ke founder, tidak ada meta-agent. issue sudah fix ya di release berikutnya. manual check

---

## 🤖 Assistant

Crystal clear! Ini sama persis dengan SaaS company normal:

| Aspek | Keputusan |
|-------|-----------|
| **Initiation** | Agent self-decides (tidak puas) |
| **Conversation** | Real-time chat |
| **Bugfix timing** | Later (ticketing system) |
| **Escalation** | Direct to founder |
| **Fix notification** | Manual check |

---

## 👤 User

rpc itu apa?

---

## 🤖 Assistant

**RPC (Remote Procedure Call)** dalam konteks Pi adalah cara untuk menjalankan Pi sebagai "background service" yang bisa diirim perintah dan menerima response via stdin/stdout (JSON format).

```
Normal Mode:     User ──types──► Pi (TUI) ──displays──► Screen

RPC Mode:        Program ──JSON──► Pi (stdin)
                         ◄──JSON── Pi (stdout)
```

---

## 👤 User

saya belum pernah pake rpc, tapi kayaknya kamu bisa contek implementasi nya dari openclaw. kemaren kamu sudah analisa tapi kayaknya sudah lupa, kamu bisa melakukannya lagi.

---

## 🤖 Assistant

Saya cek implementasi OpenClaw untuk melihat bagaimana mereka menggunakan Pi RPC...

---

## 🤖 Assistant

Dari analisa OpenClaw, saya menemukan:

1. **OpenClaw Gateway** - WebSocket server di port 18789
2. **sessions_spawn tool** - Tool untuk spawn sub-agent
3. **callGateway()** - Function untuk komunikasi dengan gateway via WebSocket

OpenClaw menggunakan arsitektur gateway yang lebih complex. Untuk Pabrik Startup, kita bisa gunakan approach yang lebih simple dengan Pi RPC langsung.

---

## 👤 User

kamu ada kekeliruan. http request apps lain itu dipanggil dari agents, bukan dari app yang dikelola agents. jadi visi nya itu gini, agents adalah ceo dari aplikasi startup x, untuk mengelola company tersebut agent perlu aplikasi a, b, c, d, e, dsb, yang digunakan langsung dari http request dari command cli. misalkan startup ngoding, untuk dikelola kan perlu ada aplikasi marketing untuk bantu agent memasarkan aplikasi ngoding tersebut, nah si agent punya kapabilitas untuk akses aplikasi marketing lewat curl. jadi aplikasi ngoding dan marketing tidak ada hubungannya satu sama lain.

---

## 🤖 Assistant

Ah, saya paham sekarang! Kekeliruan saya:

```
❌ SALAH:
App A ──HTTP──► App B  (app bicara app)

✅ BENAR:
Agent (CEO Ngoding) ──HTTP──► Marketing SaaS (tool)
                         ──HTTP──► Billing SaaS (tool)
                         
Apps tidak saling bicara. Agent langsung pakai tools via curl.
```

Yang ada komunikasi CEO-CEO adalah untuk **customer support feedback**, bukan untuk akses app.

---

## 👤 User

lewat pi, rpc mode. kita tidak perlu yang memori conversation, kita perlu bahwa ada notes dapet bugs report dari user/client

---

## 🤖 Assistant

Ah, jadi lebih sederhana:

- Spawn sub-agent via RPC
- Conversation real-time
- Target CEO store bug report ke notes/memory
- Tidak perlu persist conversation history, hanya outcome-nya

---

## 👤 User

silakan cek pi, dan silakan cek openclaw.

---

## 🤖 Assistant

Saya cek Pi dan OpenClaw untuk memahami bagaimana handle persona loading...

**Pi:**
- `PI_CODING_AGENT_DIR` environment variable untuk override config directory
- AGENTS.md loaded dari cwd dan parent directories

**OpenClaw:**
- `resolveAgentWorkspaceDir()` function untuk resolve workspace per agent
- Setiap agent punya workspace directory dengan AGENTS.md, SOUL.md, dll
- Config di `~/.openclaw/openclaw.json`

---

## 🤖 Assistant

Untuk Pabrik Startup, saya propose:

**Option 1: Set Working Directory**
```bash
cd ~/pabrik-startup/personas/notifyhub && pi --mode rpc
```

**Option 2: Use PI_CODING_AGENT_DIR**
```bash
PI_CODING_AGENT_DIR=~/.pi/agent/personas/notifyhub pi --mode rpc
```

---

## 👤 User

lokasi persona akan di dalam folder agents, barengan sama lokasi session dan skills, sehingga mudah untuk saya maintain nya. yes please bikin sample persona. untuk extension buat di dalam global juga.

---

## 🤖 Assistant

Baik, informasi sudah cukup! Saya akan mulai:

**Struktur:**
```
~/.pi/agent/
├── personas/
│   ├── notifyhub/
│   │   ├── AGENTS.md
│   │   ├── SOUL.md
│   │   ├── IDENTITY.md
│   │   ├── USER.md
│   │   └── memory/
│   ├── paygate/
│   └── sample-template/
├── extensions/
│   └── pabrik-multi-persona.ts
└── skills/
    └── pabrik-persona-setup/
        └── SKILL.md
```

---

## Key Decisions Made (This Session)

| Decision | Choice |
|----------|--------|
| Persona location | `~/.pi/agent/personas/{company-name}/` |
| Session storage | Per-persona (isolated) |
| Extension location | Global (`~/.pi/agent/extensions/`) |
| Sub-agent spawning | Via Pi RPC mode |
| Communication type | Real-time chat |
| Bug report storage | Target CEO's memory files |
| Escalation | Direct to founder |
| Fix notification | Manual check |

---

## Next Steps

1. ✅ Update architecture document
2. ✅ Create conversation log (this file)
3. ✅ Create skill documentation for setup
4. ✅ Create sample persona files (notifyhub)
5. ✅ Create `talk_to_ceo` extension
6. ✅ Fix extension error (removed broken multi-persona.ts)
7. ✅ Setup API key (ZAI_API_KEY environment variable)
8. ✅ Create shell shortcut (`pi -<persona>`)
9. ✅ Test persona successfully

---

## Troubleshooting Session

### Extension Error

**Error:** Parse error in `~/.pi/agent/extensions/multi-persona.ts`

**Solution:** Removed broken file, kept only `pabrik-multi-persona.ts`

### "No Models Available" Error

**Error:** When running `pi -notifyhub`, got "No models available"

**Root Cause:** When using `PI_CODING_AGENT_DIR`, Pi looks for auth in the persona directory, not global `~/.pi/agent/auth.json`

**Solution:** Set API key as environment variable in `~/.zshrc`:
```bash
export ZAI_API_KEY="your-api-key-here"
```

### Shell Shortcut

**Implementation:** Added `pi()` function to `~/.zshrc`:
```bash
pi() {
    if [[ $1 == -* && $1 != "--"* ]]; then
        local persona="${1#-}"
        if [[ -d ~/.pi/agent/personas/$persona ]]; then
            shift
            PI_CODING_AGENT_DIR=~/.pi/agent/personas/$persona pi "$@"
            return
        fi
    fi
    command pi "$@"
}
```

**Usage:** `pi -notifyhub`

### Successful Test

```
> pi -notifyhub
> hello, siapa kamu?

Halo! Saya Nova, CEO dari NotifyHub 🔔

NotifyHub adalah SaaS company yang menyediakan alert dan notification service...
Company ini backed by Pabrik Startup.
```

✅ Persona loaded successfully!

---

## Files Created

| File | Description |
|------|-------------|
| `~/.pi/agent/personas/notifyhub/AGENTS.md` | CEO behavior + startup ritual |
| `~/.pi/agent/personas/notifyhub/SOUL.md` | Personality |
| `~/.pi/agent/personas/notifyhub/IDENTITY.md` | CEO identity (Nova) |
| `~/.pi/agent/personas/notifyhub/USER.md` | Founder info |
| `~/.pi/agent/personas/notifyhub/memory/2026-02-16.md` | Daily notes |
| `~/.pi/agent/personas/_template/` | Template for new personas |
| `~/.pi/agent/extensions/pabrik-multi-persona.ts` | talk_to_ceo tool |
| `~/.pi/agent/skills/pabrik-persona-setup/SKILL.md` | Setup guide |
| `~/.pi/agent/settings.json` | Default model (zai/glm-5) |

---

## Shell Config Added (~/.zshrc)

```bash
# ZAI API Key for Pi
export ZAI_API_KEY="..."

# Pabrik Startup - Pi Persona Shortcut
pi() {
    if [[ $1 == -* && $1 != "--"* ]]; then
        local persona="${1#-}"
        if [[ -d ~/.pi/agent/personas/$persona ]]; then
            shift
            PI_CODING_AGENT_DIR=~/.pi/agent/personas/$persona pi "$@"
            return
        fi
    fi
    command pi "$@"
}
```

---

_Conversation logged on 2026-02-16_
_Updated: Added troubleshooting, API key setup, shell shortcut, successful test_
