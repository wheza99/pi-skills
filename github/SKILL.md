---
name: github
description: Skill untuk membantu development dengan GitHub - Git version control, repositories, pull requests, GitHub Actions CI/CD, GitHub CLI, REST API, dan GitHub Copilot. Gunakan ketika user ingin setup Git, membuat repository, workflow CI/CD, atau menggunakan fitur GitHub lainnya.
---

# GitHub Development

Skill ini membantu development dengan GitHub, platform untuk version control, collaboration, CI/CD, dan software development.

## Setup Git

### Install Git

Download dari: https://git-scm.com/downloads

```bash
# macOS (Homebrew)
brew install git

# Ubuntu/Debian
sudo apt install git

# Windows (winget)
winget install Git.Git
```

### Konfigurasi Git

```bash
# Set username
git config --global user.name "Your Name"

# Set email
git config --global user.email "your@email.com"

# Verifikasi konfigurasi
git config --list
```

## GitHub CLI

### Install GitHub CLI

```bash
# macOS
brew install gh

# Ubuntu/Debian
sudo apt install gh

# Windows
winget install GitHub.cli

# npm
npm install -g gh
```

### Autentikasi

```bash
# Login ke GitHub
gh auth login

# Cek status autentikasi
gh auth status

# Logout
gh auth logout
```

### Repository Operations

```bash
# Buat repository baru
gh repo create my-repo --public
gh repo create my-repo --private

# Clone repository
gh repo clone owner/repo
gh repo clone owner/repo my-folder

# Fork repository
gh repo fork owner/repo

# List repositories
gh repo list
gh repo list owner

# View repository
gh repo view owner/repo

# Delete repository
gh repo delete owner/repo --yes
```

### Pull Requests

```bash
# Buat pull request
gh pr create --title "My PR" --body "Description"
gh pr create --draft

# List PRs
gh pr list
gh pr list --state open

# Checkout PR
gh pr checkout 123

# View PR
gh pr view 123

# Merge PR
gh pr merge 123 --merge
gh pr merge 123 --squash

# Review PR
gh pr review 123 --approve
gh pr review 123 --request-changes
```

### Issues

```bash
# Buat issue
gh issue create --title "Bug found" --body "Description"

# List issues
gh issue list
gh issue list --state open --label bug

# View issue
gh issue view 123

# Close issue
gh issue close 123
```

### Gist

```bash
# Buat gist
gh gist create file.txt
gh gist create file.txt --public

# List gists
gh gist list
```

## SSH Setup

### Generate SSH Key

```bash
# Generate new SSH key (Ed25519 - recommended)
ssh-keygen -t ed25519 -C "your@email.com"

# Generate RSA key (alternative)
ssh-keygen -t rsa -b 4096 -C "your@email.com"

# Start SSH agent
eval "$(ssh-agent -s)"

# Add key to agent
ssh-add ~/.ssh/id_ed25519
```

### Add SSH Key ke GitHub

```bash
# Copy public key
cat ~/.ssh/id_ed25519.pub
# atau
gh ssh-key add ~/.ssh/id_ed25519.pub --title "My Laptop"

# Test koneksi SSH
ssh -T git@github.com
```

## Git Commands

### Basic Operations

```bash
# Initialize repository
git init

# Clone repository
git clone https://github.com/user/repo.git
git clone git@github.com:user/repo.git

# Add files
git add .
git add file.txt

# Commit
git commit -m "Initial commit"

# Push
git push origin main
git push -u origin main  # set upstream

# Pull
git pull origin main

# Status
git status

# Log
git log --oneline
git log --graph --oneline --all
```

### Branching

```bash
# Create branch
git branch feature-branch

# Switch branch
git checkout feature-branch
git switch feature-branch

# Create and switch
git checkout -b feature-branch
git switch -c feature-branch

# List branches
git branch
git branch -a  # include remote

# Merge branch
git merge feature-branch

# Delete branch
git branch -d feature-branch
git branch -D feature-branch  # force

# Push new branch to remote
git push -u origin feature-branch
```

### Remote Operations

```bash
# List remotes
git remote -v

# Add remote
git remote add origin https://github.com/user/repo.git

# Remove remote
git remote remove origin

# Fetch
git fetch origin

# Pull with rebase
git pull --rebase origin main
```

### Stash

```bash
# Stash changes
git stash

# Stash with message
git stash save "Work in progress"

# List stashes
git stash list

# Apply stash
git stash apply
git stash pop  # apply and remove

# Drop stash
git stash drop
```

### Undo Changes

```bash
# Discard changes in working directory
git checkout -- file.txt

# Unstage file
git reset HEAD file.txt

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Amend last commit
git commit --amend -m "New message"
```

## GitHub Actions (CI/CD)

### Struktur Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v5

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
```

### Trigger Events

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * *'  # daily at midnight
  workflow_dispatch:  # manual trigger
  release:
    types: [published]
```

### Matrix Builds

```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node: [18, 20, 22]
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
      - run: npm test
```

### Environment Variables & Secrets

```yaml
env:
  NODE_ENV: production

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        env:
          API_KEY: ${{ secrets.API_KEY }}
        run: |
          echo "Deploying with API key..."
```

### Cache Dependencies

```yaml
- name: Cache node modules
  uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

### Upload Artifacts

```yaml
- name: Upload coverage
  uses: actions/upload-artifact@v4
  with:
    name: coverage-report
    path: coverage/

- name: Download artifact
  uses: actions/download-artifact@v4
  with:
    name: coverage-report
```

### Conditional Steps

```yaml
steps:
  - name: Only on main branch
    if: github.ref == 'refs/heads/main'
    run: echo "This is main branch"

  - name: Only on success
    if: success()
    run: echo "Previous steps succeeded"

  - name: Always run
    if: always()
    run: echo "This runs regardless"
```

## GitHub REST API

### Authentication

```bash
# Personal Access Token
curl -H "Authorization: token YOUR_TOKEN" \
  https://api.github.com/user
```

### Using Octokit (JavaScript)

```bash
npm install octokit
```

```typescript
import { Octokit } from 'octokit';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// Get authenticated user
const { data: user } = await octokit.rest.users.getAuthenticated();
console.log(user.login);

// List repositories
const { data: repos } = await octokit.rest.repos.listForUser({
  username: 'username',
});

// Create issue
await octokit.rest.issues.create({
  owner: 'owner',
  repo: 'repo',
  title: 'Bug report',
  body: 'Description of the bug',
});

// Create pull request
await octokit.rest.pulls.create({
  owner: 'owner',
  repo: 'repo',
  title: 'New feature',
  head: 'feature-branch',
  base: 'main',
});
```

### Common API Endpoints

```bash
# Get repository
GET /repos/{owner}/{repo}

# List issues
GET /repos/{owner}/{repo}/issues

# Create issue
POST /repos/{owner}/{repo}/issues

# List pull requests
GET /repos/{owner}/{repo}/pulls

# Create PR
POST /repos/{owner}/{repo}/pulls

# Get user
GET /user

# List user repos
GET /user/repos
```

## GitHub Markdown

### Basic Formatting

```markdown
# Heading 1
## Heading 2
### Heading 3

**bold text**
*italic text*
~~strikethrough~~

> Quote text

`inline code`

```
code block
```
```

### Links & Images

```markdown
[Link text](https://example.com)
[Relative link](./other-file.md)

![Alt text](image.png)
```

### Lists

```markdown
- Item 1
- Item 2
  - Nested item

1. First
2. Second
3. Third

- [x] Completed task
- [ ] Incomplete task
```

### Alerts

```markdown
> [!NOTE]
> Useful information

> [!TIP]
> Helpful advice

> [!IMPORTANT]
> Key information

> [!WARNING]
> Urgent warning

> [!CAUTION]
> Risk advisory
```

### Tables

```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
```

## Repository Files

### README.md

```markdown
# Project Name

Brief description of the project.

## Installation

\`\`\`bash
npm install my-project
\`\`\`

## Usage

\`\`\`javascript
import { something } from 'my-project';
\`\`\`

## License

MIT
```

### .gitignore

```gitignore
# Dependencies
node_modules/

# Build output
dist/
build/

# Environment files
.env
.env.local

# IDE
.vscode/
.idea/

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
```

### CODEOWNERS

```
# These owners will be the default owners
* @org/team-name

# Backend code
/backend/ @org/backend-team

# Frontend code
/frontend/ @org/frontend-team
```

## Useful Links

- GitHub: https://github.com
- Docs: https://docs.github.com
- CLI Manual: https://cli.github.com/manual
- Actions: https://github.com/features/actions
- REST API: https://docs.github.com/rest
- GraphQL API: https://docs.github.com/graphql
- Status: https://www.githubstatus.com
- Community: https://github.community
