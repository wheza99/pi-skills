# Docker Best Practices

## Dockerfile Best Practices

### 1. Use Specific Base Image Tags

```dockerfile
# BAD - 'latest' can change unexpectedly
FROM node:latest

# GOOD - Pin to specific version
FROM node:20.10.0-alpine3.19

# GOOD - Use digest for immutability
FROM node@sha256:abc123...
```

### 2. Minimize Layers

```dockerfile
# BAD - Multiple RUN commands create multiple layers
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y git
RUN rm -rf /var/lib/apt/lists/*

# GOOD - Combine into one layer
RUN apt-get update \
    && apt-get install -y \
        curl \
        git \
    && rm -rf /var/lib/apt/lists/*
```

### 3. Order Instructions for Cache Efficiency

```dockerfile
# BAD - Source changes invalidate dependency installation
COPY . .
RUN npm install

# GOOD - Only reinstall if package files change
COPY package*.json ./
RUN npm install
COPY . .
```

### 4. Use Multi-Stage Builds

```dockerfile
# Build stage - large image with build tools
FROM node:20 AS builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

# Production stage - minimal image
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/server.js"]
```

### 5. Run as Non-Root User

```dockerfile
# Create user and switch to it
RUN addgroup -g 1001 -S appgroup \
    && adduser -u 1001 -S appuser -G appgroup

USER appuser

# Or use existing non-root user in alpine
USER node
```

### 6. Use .dockerignore

```text
# .dockerignore
node_modules
npm-debug.log
Dockerfile
.dockerignore
.git
.gitignore
.env
.env.*
*.md
coverage
.nyc_output
dist
build
*.log
```

### 7. Prefer COPY over ADD

```dockerfile
# BAD - ADD has extra features (auto-extract, URL download)
ADD file.tar.gz /app/
ADD https://example.com/file.txt /tmp/

# GOOD - Use COPY for local files
COPY file.tar.gz /app/

# GOOD - Use ADD only when you need its features
ADD --keep-git-dir=true https://github.com/user/repo.git /repo
```

### 8. Use Health Checks

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Or for Python
HEALTHCHECK --interval=30s --timeout=3s \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1
```

### 9. Set Proper ENTRYPOINT and CMD

```dockerfile
# Exec form (preferred) - uses JSON array syntax
ENTRYPOINT ["node"]
CMD ["server.js"]

# This allows overriding: docker run myimage debug.js
```

### 10. Use BuildKit Features

```dockerfile
# syntax=docker/dockerfile:1

# Cache mounts for package managers
RUN --mount=type=cache,target=/root/.npm \
    npm install

RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    apt-get update && apt-get install -y curl

# Build secrets
RUN --mount=type=secret,id=mysecret \
    cat /run/secrets/mysecret

# SSH mounts for private repos
RUN --mount=type=ssh \
    git clone git@github.com:user/repo.git
```

---

## Docker Compose Best Practices

### 1. Use Explicit Service Dependencies

```yaml
services:
  app:
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
```

### 2. Set Resource Limits

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

### 3. Use Named Volumes for Persistence

```yaml
services:
  db:
    volumes:
      - postgres_data:/var/lib/postgresql/data  # Named volume

volumes:
  postgres_data:  # Define it
```

### 4. Use Networks for Isolation

```yaml
services:
  app:
    networks:
      - frontend
      - backend
  db:
    networks:
      - backend  # Only accessible by app

networks:
  frontend:
  backend:
    internal: true  # No external access
```

### 5. Use Environment Files

```yaml
services:
  app:
    env_file:
      - .env
      - .env.${NODE_ENV}
```

### 6. Define Health Checks

```yaml
services:
  app:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### 7. Use Profiles for Different Environments

```yaml
services:
  app:
    # Always runs
    
  debug:
    profiles:
      - debug
    # Only with: docker compose --profile debug up
    
  test:
    profiles:
      - test
    # Only with: docker compose --profile test up
```

### 8. Restart Policies

```yaml
services:
  app:
    restart: unless-stopped  # Always restart unless manually stopped
    
  cron:
    restart: on-failure      # Only restart on failure
```

### 9. Use Development Overrides

```yaml
# docker-compose.yml (production)
services:
  app:
    image: myapp:latest
    restart: always

# docker-compose.override.yml (development - auto-loaded)
services:
  app:
    build: .
    volumes:
      - .:/app
    environment:
      - DEBUG=true
```

### 10. Logging Configuration

```yaml
services:
  app:
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
```

---

## Security Best Practices

### 1. Don't Run as Root

```dockerfile
# In Dockerfile
USER node
# or
USER appuser
```

### 2. Use Read-Only Filesystem

```yaml
services:
  app:
    read_only: true
    tmpfs:
      - /tmp
      - /var/cache
```

### 3. Drop Unnecessary Capabilities

```yaml
services:
  app:
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
```

### 4. Limit Resources

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

### 5. Use Secrets for Sensitive Data

```yaml
services:
  app:
    secrets:
      - db_password

secrets:
  db_password:
    file: ./secrets/db_password.txt
    # or external: true
```

### 6. Scan Images for Vulnerabilities

```bash
# Docker Scout
docker scout cves myimage:latest
docker scout quickview myimage:latest

# Docker Scout recommendations
docker scout recommendations myimage:latest
```

### 7. Use Trusted Base Images

```dockerfile
# Use official images
FROM node:20-alpine
FROM python:3.11-slim
FROM nginx:alpine

# Verify publisher
# Docker Official Images have "Docker Official Image" badge
# Docker Verified Publishers are vetted
```

### 8. Sign and Verify Images

```bash
# Sign image
docker trust sign myimage:latest

# Verify image
docker trust inspect --pretty myimage:latest
```

---

## Performance Best Practices

### 1. Use Small Base Images

```dockerfile
# Full image (~900MB)
FROM node:20

# Slim image (~200MB)
FROM node:20-slim

# Alpine image (~50MB)
FROM node:20-alpine

# Distroless (~20MB) - minimal attack surface
FROM gcr.io/distroless/nodejs20
```

### 2. Optimize Build Cache

```dockerfile
# Install dependencies first (changes less often)
COPY package*.json ./
RUN npm ci

# Then copy source (changes more often)
COPY . .
RUN npm run build
```

### 3. Use BuildKit Cache

```bash
# Enable BuildKit
DOCKER_BUILDKIT=1 docker build -t myapp .

# Use inline cache
docker build --cache-from myapp:latest -t myapp:v2 .
```

### 4. Minimize Final Image Size

```dockerfile
# Multi-stage build
FROM node:20 AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

# Production image
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
# No dev dependencies, no source, only what's needed
```

### 5. Clean Up in Same Layer

```dockerfile
RUN apt-get update \
    && apt-get install -y curl \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean
```

---

## Development Workflow

### 1. Use Docker Compose Override

```yaml
# docker-compose.yml
services:
  app:
    image: myapp:latest
    restart: always

# docker-compose.override.yml (auto-loaded in development)
services:
  app:
    build: .
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DEBUG=myapp:*
    command: npm run dev
```

### 2. Use Named Volumes for node_modules

```yaml
services:
  app:
    volumes:
      - .:/app
      - /app/node_modules  # Anonymous volume prevents overwrite
      # or
      - app_node_modules:/app/node_modules  # Named volume
```

### 3. Development vs Production Dockerfiles

```dockerfile
# Dockerfile with targets
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS development
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

FROM base AS builder
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/server.js"]
```

```bash
# Development
docker build --target development -t myapp:dev .

# Production
docker build --target production -t myapp:prod .
```

### 4. Hot Reload in Containers

```yaml
services:
  app:
    build:
      context: .
      target: development
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - CHOKIDAR_USEPOLLING=true  # For file watching
      - WATCHPACK_POLLING=true
    ports:
      - "3000:3000"
```

---

## CI/CD Best Practices

### 1. Layer Caching in CI

```yaml
# GitHub Actions
- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v3

- name: Build and push
  uses: docker/build-push-action@v5
  with:
    context: .
    push: true
    tags: myapp:${{ github.sha }}
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

### 2. Multi-Platform Builds

```bash
# Build for multiple platforms
docker buildx build --platform linux/amd64,linux/arm64 -t myapp:latest .
```

### 3. Test Before Push

```bash
# Build and test
docker build -t myapp:test .
docker run --rm myapp:test npm test

# Then push
docker tag myapp:test myapp:latest
docker push myapp:latest
```

### 4. Scan for Vulnerabilities in CI

```yaml
- name: Scan for vulnerabilities
  run: |
    docker scout cves myapp:latest --exit-code --severity critical
```

---

## Cleanup Commands

```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove unused networks
docker network prune

# Remove everything unused
docker system prune -a --volumes

# Show disk usage
docker system df

# Watch disk usage
docker system df -v
```
