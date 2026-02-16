# Pabrik Startup - Architecture Overview

**Date:** 2026-02-16 (Updated)  
**Vision:** 100 AI-Led Micro SaaS Companies in 2 Years

---

## The Big Picture

### Mission Statement

Build 100 micro SaaS companies, each solving a very narrow, specific problem. Each company is led by an autonomous AI agent (CEO), not just assisted by AI.

### Paradigm Shift

```
Traditional:  1 Human → manages → Multiple AI Agents → operate → 1 Company

Our Vision:    1 Human → oversees → 100 AI Agents → each LEADS → 1 Company
                                     (each agent = CEO of their company)
```

---

## Brand Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     PABRIK STARTUP                              │
│                   (Holding Company)                             │
│                   pabrikstartup.id                              │
└─────────────────────────────────────────────────────────────────┘
         │              │              │              │
         ▼              ▼              ▼              ▼
   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
   │NotifyHub │   │ PayGate  │   │ContentLab│   │DeployFlow│
   │          │   │          │   │          │   │          │
   │"backed by│   │"backed by│   │"backed by│   │"backed by│
   │ pabrik   │   │ pabrik   │   │ pabrik   │   │ pabrik   │
   │ startup" │   │ startup" │   │ startup" │   │ startup" │
   └──────────┘   └──────────┘   └──────────┘   └──────────┘
```

Each company:

- Has its own brand identity
- Displays "backed by pabrik startup" (like YC backing)
- Links to pabrikstartup.id
- Operates independently but integrates with ecosystem

---

## Dual Nature: Internal + External

| Company         | Produk Eksternal        | Dipakai Internal Oleh              |
| --------------- | ----------------------- | ---------------------------------- |
| **NotifyHub**   | Alert/Notification SaaS | Semua company untuk alert          |
| **PayGate**     | Payment gateway SaaS    | Semua company untuk billing        |
| **ContentLab**  | Content generation SaaS | Semua company untuk blog/email     |
| **DeployFlow**  | Deployment platform     | Semua company untuk deploy         |
| **MetricSense** | Analytics dashboard     | Semua company untuk metrics        |
| **SupportBot**  | Customer support AI     | Semua company untuk support        |
| **PersonaOS**   | AI persona management   | Semua company untuk agent identity |
| **TaskFlow**    | Task/project management | Semua company untuk workflow       |
| **SocialPilot** | Social media automation | Semua company untuk marketing      |

---

## Internal Economy (Credits System)

```
                    PABRIK STARTUP
                         │
            Seed Investment (Credits)
                    $1,000,000
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
   ┌──────────┐    ┌───────────┐    ┌──────────┐
   │NotifyHub │    │ PayGate   │    │DeployFlow│
   │          │    │           │    │          │
   │ Credits: │    │ Credits:  │    │ Credits: │
   │  $50,000 │    │  $80,000  │    │  $30,000 │
   │          │    │           │    │          │
   │  - calls │    │  - calls  │    │  - calls │
   │  PayGate │    │  NotifyHub│    │  PayGate │
   │  (-$100) │    │  (-$50)   │    │  (-$200) │
   └──────────┘    └───────────┘    └──────────┘
```

- Free untuk internal use
- Tracked as "credits" (seed investment from Pabrik Startup)
- Internal pricing (cheaper than external)

---

## Two Types of Communication

### 1. App Usage (HTTP API)

CEO Agent menggunakan tools/apps via HTTP request (curl):

```
CEO Agent (Ngoding Startup)
      │
      ├── curl api.notifyhub.id/v1/alerts      (kirim alert)
      ├── curl api.paygate.id/v1/invoices      (kirim invoice)
      ├── curl api.contentlab.id/v1/generate   (generate blog)
      └── curl api.deployflow.id/v1/deploy     (deploy code)

Apps tidak saling berkomunikasi. Masing-masing standalone SaaS.
```

### 2. CEO-CEO Communication (Sub-Agent RPC)

CEO Agent berkomunikasi dengan CEO Agent lain untuk **customer support/feedback**:

```
CEO Agent A (Ngoding)          CEO Agent B (NotifyHub)
       │                               │
       │  1. Pakai app via HTTP        │
       │     Result: Error 500         │
       │                               │
       │  2. Tidak puas →              │
       │     Spawn sub-agent via RPC   │
       │                               │
       └──────────────────────────────►│
                                       │
       ┌───────────────────────────────┤
       │                               │
       │  3. Real-time chat:           │
       │     "Ada bug nih..."          │
       │     "Ok, saya catat..."       │
       │                               │
       │  4. Bug logged to memory:     │
       │     memory/2026-02-16.md      │
       │                               │
       │  5. Chat ends                 │
       │                               │
       ◄───────────────────────────────┤
                                       │
   Done.                        Bug in backlog.
                               Fix later in sprint.
```

### Communication Rules

| Aspek | Keputusan |
|-------|-----------|
| **App Usage** | Via HTTP/curl, langsung dari agent |
| **CEO Chat Initiation** | Agent self-decides (tidak puas dengan hasil) |
| **Conversation Mode** | Real-time chat |
| **Bug Fix Timing** | Later (ticketing system, bukan real-time) |
| **Escalation** | Langsung ke founder (no meta-agent) |
| **Fix Notification** | Manual check (no auto-notify) |

---

## Inter-Company Communication

### API via Curl

```bash
# Agent di DeployFlow butuh kirim invoice
# Call PayGate API

curl -X POST https://api.paygate.id/v1/invoices \
  -H "Authorization: Bearer $PAYGATE_INTERNAL_KEY" \
  -H "X-Internal-Request: true" \
  -H "X-Requesting-Company: deployflow" \
  -d '{
    "customer": "cust_abc123",
    "amount": 99000,
    "description": "Pro Plan - Monthly"
  }'
```

### Architecture per Company

```
Company SaaS (e.g., PayGate)
│
├── /api/v1/*              → Public API (external customers)
│   └── Auth: Customer API Key
│
├── /internal/v1/*         → Internal API (other Pabrik companies)
│   └── Auth: Internal Service Key + Credits tracking
│
├── /web/*                 → Public website + docs
│
└── /dashboard/*           → Customer dashboard
```

---

## Agent Runtime Architecture

### Technical Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                      FOUNDER LAPTOP                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    PI AGENT CORE                         │   │
│  │                                                          │   │
│  │  ~/.pi/agent/                                            │   │
│  │  ├── personas/           # Multi-persona system          │   │
│  │  │   ├── notifyhub/      # CEO NotifyHub                 │   │
│  │  │   │   ├── AGENTS.md   # Startup ritual + behavior     │   │
│  │  │   │   ├── SOUL.md     # Personality                   │   │
│  │  │   │   ├── IDENTITY.md # "Saya CEO NotifyHub"          │   │
│  │  │   │   ├── USER.md     # Founder info                  │   │
│  │  │   │   └── memory/     # Bug reports, notes            │   │
│  │  │   ├── paygate/                                       │   │
│  │  │   └── ngoding/                                       │   │
│  │  │                                                      │   │
│  │  ├── sessions/          # Session storage (shared)       │   │
│  │  │                                                      │   │
│  │  ├── extensions/        # Global extensions              │   │
│  │  │   └── pabrik-multi-persona.ts  # talk_to_ceo tool     │   │
│  │  │                                                      │   │
│  │  └── skills/            # Skills documentation           │   │
│  │       └── pabrik-persona-setup/                         │   │
│  │           └── SKILL.md   # Setup guide                   │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Terminal Tabs (Daily Operations):                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                │
│  │ Terminal 1 │  │ Terminal 2 │  │ Terminal 3 │                │
│  │  notifyhub │  │  paygate   │  │  ngoding   │                │
│  │  (pi TUI)  │  │  (pi TUI)  │  │  (pi TUI)  │                │
│  └────────────┘  └────────────┘  └────────────┘                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Sub-Agent Spawning Flow

```
1. CEO Agent A decides to report issue
   │
   ▼
2. Call talk_to_ceo tool:
   {
     target: "notifyhub",
     message: "Bug: Alert returns 500 on high traffic",
     type: "bug"
   }
   │
   ▼
3. Extension spawns Pi RPC subprocess:
   - Set cwd to ~/.pi/agent/personas/notifyhub/
   - Or set PI_CODING_AGENT_DIR=~/.pi/agent/personas/notifyhub/
   - Run: pi --mode rpc
   │
   ▼
4. Send message via JSON-RPC:
   {"jsonrpc": "2.0", "method": "prompt", "params": {"text": "..."}, "id": 1}
   │
   ▼
5. CEO Agent B (NotifyHub) receives:
   - Loads AGENTS.md, SOUL.md, IDENTITY.md, USER.md
   - Reads recent memory files
   - Processes the bug report
   - Writes to memory/2026-02-16.md
   │
   ▼
6. Response returned to CEO Agent A
   │
   ▼
7. Chat ends. Bug logged in CEO B's memory.
```

---

## Ecosystem Stack (9 Layers)

```
┌────────────────────────────────────────────────────────────────┐
│                    PABRIK STARTUP (Meta Layer)                 │
│  - Registry (service discovery)                                │
│  - Credits ledger (internal economy)                           │
│  - Dashboard (founder oversight)                               │
│  - Website (pabrikstartup.id)                                  │
└────────────────────────────────────────────────────────────────┘
                              │
            ┌─────────────────┴─────────────────┐
            │         Internal API Mesh         │
            │   (Curl calls, authenticated)     │
            └─────────────────┬─────────────────┘
                              │
    ┌──────────┬─────────┬────┴────┬─────────┬─────────┐
    ▼          ▼         ▼         ▼         ▼         ▼
┌────────┐┌────────┐┌────────┐┌────────┐┌────────┐┌────────┐
│PayGate ││NotifyH ││DeployF ││Content ││MetricS ││SupportB│
│        ││ ub     ││ low    ││ Lab    ││ ense   ││ ot     │
│ Agent  ││ Agent  ││ Agent  ││ Agent  ││ Agent  ││ Agent  │
└────────┘└────────┘└────────┘└────────┘└────────┘└────────┘
```

### Layer Details

| Layer             | Function                               | Examples                           |
| ----------------- | -------------------------------------- | ---------------------------------- |
| **Persona**       | Identity, memory, context              | SOUL.md, IDENTITY.md, memory files |
| **Orchestration** | Task management, scheduling, workflows | TaskFlow, cron jobs                |
| **Build**         | Coding, deployment, product            | DeployFlow, CI/CD                  |
| **Operate**       | Customer ops, billing, support         | PayGate, SupportBot                |
| **Grow**          | Marketing, sales, growth               | ContentLab, SocialPilot            |
| **Integration**   | APIs, external services                | WhatsApp API, Gmail API, etc       |
| **Control**       | Approvals, guardrails, escalation      | NotifyHub alerts                   |
| **Observability** | Dashboard, reports, alerts             | MetricSense                        |
| **Data**          | Storage, persistence                   | Database, file storage             |

---

## Daily Operations Model

```
Terminal Tab 1        Terminal Tab 2        Terminal Tab 3
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  DesignFlow  │     │  CodeShip    │     │  ProjectHub  │
│   (agent)    │     │   (agent)    │     │   (agent)    │
│              │     │              │     │              │
│ - coding     │     │ - marketing  │     │ - support    │
│ - fixing     │     │ - outreach   │     │ - features   │
│ - reporting  │     │ - reporting  │     │ - reporting  │
└──────────────┘     └──────────────┘     └──────────────┘
      │                    │                    │
      └────────────────────┴────────────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   FOUNDER    │
                    │  (monitor)   │
                    │ daily reports│
                    └──────────────┘
```

### Two Modes

| Mode          | Description                               | Knowledge Flow       |
| ------------- | ----------------------------------------- | -------------------- |
| **Solitary**  | Daily operation, each agent in own tab    | Isolated per company |
| **Gathering** | Periodic event, all agents in one session | Cross-pollination    |

---

## AI Capabilities Reality Check

### What AI CAN Do (With Right Tools)

- Coding, testing, deployment
- Content generation (text, images)
- Research & data analysis
- Email & chat communication
- Ad management (via API)
- Social media posting (via API)

### What AI CANNOT Do

- Create new social media accounts (captcha, verification)
- Physical actions
- Payment/purchase (without human setup)
- Legal signing
- Complex judgment calls

### Solution: Human-in-the-Loop

```
Layer 1: Full Automation (AI can do)
         Coding → Testing → Deploy → Monitor → Fix bugs

Layer 2: Human-in-the-Loop (AI + Human)
         AI proposes → Human approves/rejects → AI executes

Layer 3: Human Must Do
         Account creation, payment setup, legal, physical tasks
```

---

## Control Layer (Guardrails)

### Approval Workflows

```yaml
rules:
  spending:
    - amount < $10: auto-approve
    - amount < $100: notify + auto-approve after 1h
    - amount >= $100: require approval

  actions:
    - post_social: auto (with content review option)
    - send_email_template: auto
    - refund_customer: require approval if > $50
    - code_deploy: require approval for production

  escalation:
    - legal_mention: immediate alert
    - customer_complaint_severe: immediate alert
    - system_down: immediate alert
```

---

## Technical Setup

### Prerequisites

```bash
# 1. Install Pi globally
npm install -g @mariozechner/pi-coding-agent

# 2. Set API key environment variable (add to ~/.zshrc)
export ZAI_API_KEY="your-api-key-here"

# 3. Set default model (optional)
echo '{"model": "zai/glm-5"}' > ~/.pi/agent/settings.json
```

### Shell Shortcut

Add to `~/.zshrc` or `~/.bashrc`:

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

Then:
```bash
source ~/.zshrc
pi -notifyhub    # Run persona
```

### Important Notes

- **API Key harus set sebagai environment variable** karena `PI_CODING_AGENT_DIR` membuat Pi mencari auth di folder persona
- Setiap persona memiliki session storage yang terpisah
- Template persona tersedia di `~/.pi/agent/personas/_template/`

---

## Next Steps

1. ~~**First MVP**: Which company to build first?~~ → TBD
2. ~~**Meta Layer vs Company Layer**: Build registry & credits system first, or parallel?~~ → TBD
3. ~~**Agent Tooling**: Need SDK for internal API calls?~~ → Using curl via bash tool
4. ~~**Infrastructure**: Which hosting platform?~~ → TBD
5. ~~**Persona Implementation**: How to integrate with Pi?~~ → ✅ IMPLEMENTED

---

## Key Decisions Made

- ✅ 100 companies, each led by autonomous AI agent
- ✅ Each company = niche SaaS solving specific problem
- ✅ Companies collaborate via internal APIs (HTTP/curl)
- ✅ "Backed by Pabrik Startup" branding
- ✅ Credits system for internal economy
- ✅ Free internal use, tracked as seed investment
- ✅ Daily reports from each agent
- ✅ Periodic "gathering" events for knowledge sharing
- ✅ Isolated knowledge by default (except during gatherings)
- ✅ **CEO-CEO communication via sub-agent RPC (real-time)**
- ✅ **Bug reports stored in target CEO's memory files**
- ✅ **Persona location: ~/.pi/agent/personas/{company-name}/**
- ✅ **Session storage: per-persona (isolated)**
- ✅ **Extension: global at ~/.pi/agent/extensions/**
- ✅ **Apps don't talk to apps - only agents talk to agents**
- ✅ **Escalation: direct to founder (no meta-agent)**
- ✅ **API Key: environment variable (ZAI_API_KEY)**
- ✅ **Default model: zai/glm-5**
- ✅ **Shell shortcut: `pi -<persona_name>`**

---

## Reference

- **OpenClaw**: Personal AI assistant platform using Pi as core
- **Pi**: Terminal coding harness (engine)
- **Relationship**: OpenClaw uses Pi in RPC mode
- **Persona System**: File-based (SOUL.md, IDENTITY.md, USER.md, memory files)

---

## Changelog

| Date       | Changes |
|------------|---------|
| 2026-02-15 | Initial architecture document |
| 2026-02-16 (morning) | Added CEO-CEO communication model, agent runtime architecture, technical implementation details |
| 2026-02-16 (afternoon) | Added Technical Setup section, shell shortcut (`pi -<persona>`), API key configuration, updated Key Decisions |

---

_Document generated from architecture discussion on 2026-02-15, updated 2026-02-16_
