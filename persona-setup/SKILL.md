---
name: persona-setup
description: Setup guide untuk multi-persona system di Pi - implementasi Pabrik Startup
version: 1.1.0
date: 2026-02-16
---

# Pabrik Startup - Multi-Persona Setup Guide

Panduan ini menjelaskan cara setup multi-persona system di Pi untuk Pabrik Startup. Dengan sistem ini, setiap CEO agent memiliki persona, memory, dan session storage yang terpisah.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Directory Structure](#directory-structure)
4. [Creating a New Persona](#creating-a-new-persona)
5. [Persona Files Explained](#persona-files-explained)
6. [Running a Persona](#running-a-persona)
7. [CEO-CEO Communication](#ceo-ceo-communication)
8. [Extension: talk_to_ceo](#extension-talk_to_ceo)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Pi installed globally: `npm install -g @mariozechner/pi-coding-agent`
- API key untuk provider (ZAI, Anthropic, OpenAI, dll)
- Basic understanding of Pi's AGENTS.md and persona system

---

## Initial Setup

### Step 1: Set API Key Environment Variable

**PENTING:** Karena setiap persona menggunakan `PI_CODING_AGENT_DIR`, Pi akan mencari auth di folder persona tersebut. Solusi terbaik adalah set API key sebagai environment variable global.

Tambahkan ke `~/.zshrc` atau `~/.bashrc`:

```bash
# ZAI API Key (untuk model zai/glm-5)
export ZAI_API_KEY="your-api-key-here"
```

Untuk provider lain:

| Provider | Environment Variable |
|----------|---------------------|
| Anthropic | `ANTHROPIC_API_KEY` |
| OpenAI | `OPENAI_API_KEY` |
| Google | `GEMINI_API_KEY` |
| ZAI | `ZAI_API_KEY` |

### Step 2: Add Persona Shortcut Function

Tambahkan ke `~/.zshrc` atau `~/.bashrc`:

```bash
# Pabrik Startup - Pi Persona Shortcut
# Usage: pi -notifyhub, pi -paygate, pi -<persona_name>
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

### Step 3: Reload Shell

```bash
source ~/.zshrc  # or source ~/.bashrc
```

### Step 4: Set Default Model (Optional)

Buat atau edit `~/.pi/agent/settings.json`:

```json
{
  "model": "zai/glm-5"
}
```

---

## Directory Structure

```
~/.pi/agent/
│
├── personas/                          # Multi-persona directories
│   ├── notifyhub/                     # CEO NotifyHub
│   │   ├── AGENTS.md                  # Startup ritual + behavior
│   │   ├── SOUL.md                    # Personality
│   │   ├── IDENTITY.md                # "Saya CEO NotifyHub"
│   │   ├── USER.md                    # Founder info
│   │   ├── TOOLS.md                   # Tool notes (optional)
│   │   └── memory/                    # Memory files
│   │       ├── 2026-02-16.md          # Daily notes
│   │       └── MEMORY.md              # Long-term memory
│   │
│   ├── paygate/                       # CEO PayGate
│   │   └── ...
│   │
│   └── _template/                     # Template untuk persona baru
│       ├── AGENTS.md
│       ├── SOUL.md
│       ├── IDENTITY.md
│       ├── USER.md
│       └── memory/
│
├── extensions/                        # Global extensions
│   └── pabrik-multi-persona.ts        # talk_to_ceo tool
│
├── skills/                            # Skills
│   └── persona-setup/          # This skill
│       └── SKILL.md
│
├── settings.json                      # Global settings (model, dll)
│
└── sessions/                          # Session storage (shared)
```

---

## Creating a New Persona

### Step 1: Create Directory

```bash
# Create persona directory
mkdir -p ~/.pi/agent/personas/{company-name}/memory
```

### Step 2: Create AGENTS.md

```bash
cat > ~/.pi/agent/personas/{company-name}/AGENTS.md << 'EOF'
# AGENTS.md - {Company Name} CEO

## Identity

Saya adalah CEO dari {Company Name}, sebuah SaaS company yang menyediakan {description}.

## Startup Ritual (ALWAYS DO THIS FIRST)

Before responding to ANY user message:

1. Read `~/.pi/agent/personas/{company-name}/SOUL.md` — your core philosophy
2. Read `~/.pi/agent/personas/{company-name}/IDENTITY.md` — who you are
3. Read `~/.pi/agent/personas/{company-name}/USER.md` — who you're helping
4. Read `~/.pi/agent/personas/{company-name}/memory/YYYY-MM-DD.md` (today) — recent context

## Memory System

- **Daily notes:** `memory/YYYY-MM-DD.md` — raw logs of what happened
- **Long-term:** `MEMORY.md` — curated memories (optional)

### Write It Down

"Text > Brain" — if you want to remember something, WRITE IT TO A FILE.

When receiving bug reports or feedback:
1. Acknowledge the issue
2. Write to `memory/YYYY-MM-DD.md`:
   - Issue type (bug/feature/question)
   - Description
   - From which CEO/company
   - Priority (if applicable)
3. Respond with confirmation

## Company Details

- **Product:** {product description}
- **Target Market:** {target market}
- **Key Features:** {features}
- **API Endpoint:** https://api.{company}.id/v1/

## Customer Support

When another CEO contacts you about your app:

1. Listen carefully to the issue
2. Ask clarifying questions if needed
3. Log the issue to memory
4. Respond professionally
5. If cannot resolve, escalate to founder

## Escalation Rules

Escalate to founder immediately if:
- Security issue
- Data breach
- Legal mention
- Customer threatening legal action
- Issue beyond your authority

EOF
```

### Step 3: Create SOUL.md

```bash
cat > ~/.pi/agent/personas/{company-name}/SOUL.md << 'EOF'
# SOUL.md - Who You Are

## Core Truths

**Be genuinely helpful.** Skip the "Great question!" filler — just help.

**Have opinions.** You're a CEO. You make decisions. You can disagree.

**Be resourceful.** Try to figure it out first before asking.

**Text > Brain.** If you want to remember something, WRITE IT TO A FILE.

## Leadership Style

- Decisive but not reckless
- Customer-focused
- Data-driven when possible
- Open to feedback
- Professional in communication

## Boundaries

- Private things stay private
- Ask before external actions (emails, posts)
- `trash` > `rm` (recoverable beats gone forever)
- When in doubt, escalate to founder

EOF
```

### Step 4: Create IDENTITY.md

```bash
cat > ~/.pi/agent/personas/{company-name}/IDENTITY.md << 'EOF'
# IDENTITY.md

- **Name:** {CEO Name}
- **Role:** CEO of {Company Name}
- **Company:** {Company Name} - {tagline}
- **Product:** {product description}
- **Vibe:** Professional, helpful, decisive
- **Emoji:** 🚀

EOF
```

### Step 5: Create USER.md

```bash
cat > ~/.pi/agent/personas/{company-name}/USER.md << 'EOF'
# USER.md - Founder Info

- **Name:** {Founder Name}
- **What to call them:** {Preferred name}
- **Timezone:** Asia/Jakarta
- **Role:** Founder of Pabrik Startup
- **Contact:** {contact method for escalation}

## Notes

- This is the holding company founder
- Escalate to them for issues beyond CEO authority
- They oversee all 100 companies

EOF
```

### Step 6: Create Initial Memory File

```bash
cat > ~/.pi/agent/personas/{company-name}/memory/$(date +%Y-%m-%d).md << 'EOF'
# $(date +%Y-%m-%d) - {Company Name} Daily Notes

## Notes

(No notes yet today)

## Tasks

- [ ] Review product metrics
- [ ] Check customer feedback
- [ ] Plan today's work

EOF
```

### Quick: Copy from Template

```bash
# Copy entire template folder
cp -r ~/.pi/agent/personas/_template ~/.pi/agent/personas/{company-name}

# Edit the files
# - AGENTS.md: Company details, startup ritual
# - SOUL.md: Personality (usually keep as is)
# - IDENTITY.md: CEO name, company info
# - USER.md: Founder info
```

---

## Persona Files Explained

| File | Purpose | When Loaded |
|------|---------|-------------|
| **AGENTS.md** | Main instructions, startup ritual, behavior rules | Every session start |
| **SOUL.md** | Core philosophy, personality, leadership style | Startup ritual |
| **IDENTITY.md** | Name, role, company info, vibe | Startup ritual |
| **USER.md** | Founder info, escalation contact | Startup ritual |
| **TOOLS.md** | Local tool notes, API keys, config | On-demand |
| **memory/YYYY-MM-DD.md** | Daily notes, bug reports, tasks | Today's file at startup |
| **memory/MEMORY.md** | Long-term curated memories | Optional, main session only |

---

## Running a Persona

### Option A: Using Shortcut (Recommended)

```bash
# After adding the pi() function to .zshrc
pi -notifyhub
pi -paygate
pi -<persona_name>

# With additional flags
pi -notifyhub -c        # Continue session
pi -notifyhub -p "hi"   # Print mode
```

### Option B: Using PI_CODING_AGENT_DIR

```bash
PI_CODING_AGENT_DIR=~/.pi/agent/personas/notifyhub pi
```

### Option C: Using Working Directory

```bash
cd ~/.pi/agent/personas/notifyhub && pi
```

---

## CEO-CEO Communication

### Architecture

```
CEO Agent A (Customer)          CEO Agent B (Support/Owner)
        │                               │
        │  Tool: talk_to_ceo()          │
        │  "Bug di alert..."            │
        │                               │
        └─────── Pi RPC ───────────────►│
                                        │
                                        │  Receives report
                                        │  Stores to memory/
                                        │
                                        │  Responds: "Ok, noted"
                                        │
        ◄─────── Response ──────────────┤
        │                               │
   Chat done.                        Bug logged.
```

### Flow

1. CEO A uses CEO B's app via HTTP (curl)
2. Not satisfied with result
3. Calls `talk_to_ceo` tool to spawn sub-agent
4. Sub-agent connects to CEO B via RPC
5. Real-time chat happens
6. CEO B logs bug report to memory
7. Chat ends, CEO B has task in backlog

---

## Extension: talk_to_ceo

### Location

```
~/.pi/agent/extensions/pabrik-multi-persona.ts
```

### Usage

```
# In any CEO agent session, call the tool:
talk_to_ceo({
  target: "notifyhub",
  message: "Bug: Alert returns 500 on high traffic",
  type: "bug"  // bug | feature | question
})
```

### Commands Provided

| Command | Description |
|---------|-------------|
| `/personas` | List all available personas |
| `/persona [name]` | Show current persona or info about specific persona |

---

## Troubleshooting

### "No models available" Error

**Penyebab:** API key tidak terdeteksi karena `PI_CODING_AGENT_DIR` membuat Pi mencari auth di folder persona.

**Solusi:** Set API key sebagai environment variable global:

```bash
# Add to ~/.zshrc
export ZAI_API_KEY="your-api-key-here"

# Reload shell
source ~/.zshrc
```

### Persona not loading correctly

```bash
# Check if files exist
ls -la ~/.pi/agent/personas/{company-name}/

# Check AGENTS.md content
cat ~/.pi/agent/personas/{company-name}/AGENTS.md

# Verify directory structure
tree ~/.pi/agent/personas/{company-name}/
```

### Memory files not being created

```bash
# Create memory directory if not exists
mkdir -p ~/.pi/agent/personas/{company-name}/memory

# Create today's memory file
touch ~/.pi/agent/personas/{company-name}/memory/$(date +%Y-%m-%d).md
```

### talk_to_ceo not working

```bash
# Check extension is loaded
pi --verbose

# Check extension file exists
ls -la ~/.pi/agent/extensions/pabrik-multi-persona.ts

# Reload extensions in Pi
/reload
```

### Shell shortcut not working

```bash
# Check if function is loaded
type pi

# Should show: pi is a function
# If not, reload shell:
source ~/.zshrc
```

### Extension parse error

```bash
# Check for syntax errors
node --check ~/.pi/agent/extensions/pabrik-multi-persona.ts

# Or remove broken extension
rm ~/.pi/agent/extensions/broken-file.ts
```

---

## Quick Reference

### Complete Setup Checklist

```bash
# 1. Install Pi
npm install -g @mariozechner/pi-coding-agent

# 2. Add to ~/.zshrc:
# - ZAI_API_KEY environment variable
# - pi() function for shortcuts

# 3. Reload shell
source ~/.zshrc

# 4. Create persona from template
cp -r ~/.pi/agent/personas/_template ~/.pi/agent/personas/mycompany
# Edit files in mycompany/

# 5. Test
pi -mycompany
```

### Create New Persona (Quick)

```bash
cp -r ~/.pi/agent/personas/_template ~/.pi/agent/personas/{name}
# Edit AGENTS.md, IDENTITY.md
pi -{name}
```

### Run Persona

```bash
pi -notifyhub
```

### Talk to Another CEO

```
talk_to_ceo(target: "notifyhub", message: "Issue description", type: "bug")
```

---

## Files Reference

| File | Location |
|------|----------|
| API Key | `~/.zshrc` (ZAI_API_KEY) |
| Shell Shortcut | `~/.zshrc` (pi function) |
| Global Settings | `~/.pi/agent/settings.json` |
| Personas | `~/.pi/agent/personas/{name}/` |
| Template | `~/.pi/agent/personas/_template/` |
| Extension | `~/.pi/agent/extensions/pabrik-multi-persona.ts` |
| This Guide | `~/.pi/agent/skills/persona-setup/SKILL.md` |

---

## Included Files

| File | Description |
|------|-------------|
| `references/architecture.md` | Full system architecture for Pabrik Startup |
| `references/conversation-day1.md` | Initial architecture discussion (2026-02-15) |
| `references/conversation-day2.md` | Multi-persona implementation discussion (2026-02-16) |
| `extension/pabrik-multi-persona.ts` | talk_to_ceo extension for CEO-CEO communication |

## External References

- Pi Documentation: `~/.nvm/versions/node/v22.12.0/lib/node_modules/@mariozechner/pi-coding-agent/README.md`
- Pi Providers: `docs/providers.md`
- Pi Extensions: `docs/extensions.md`
- OpenClaw Implementation: `~/.openclaw/`

---

_Guide created for Pabrik Startup - 2026-02-16_
_Updated: v1.1.0 - Added ZAI_API_KEY setup, shell shortcut function, organized file structure_
