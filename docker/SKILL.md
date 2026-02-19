---
name: docker
description: Skill untuk development dengan Docker - containerization, Dockerfile, Docker Compose, Docker CLI commands, image management, container orchestration, networking, volumes, dan best practices. Gunakan ketika user ingin membuat Dockerfile, docker-compose.yml, menjalankan container, mengelola images, atau debugging Docker.
---

# Docker Containerization

Skill ini membantu development dengan Docker untuk containerization, multi-container applications, dan orchestration.

## Setup

Verifikasi Docker terinstall:

```bash
docker --version
docker compose version
```

## Docker CLI Commands

### Container Management

```bash
# List containers
docker ps                    # Running containers
docker ps -a                 # All containers (including stopped)

# Run container
docker run <image>                          # Run dan attach
docker run -d <image>                       # Run in background (detached)
docker run -it <image> /bin/bash           # Interactive terminal
docker run --name <name> <image>            # With custom name
docker run -p <host>:<container> <image>    # Port mapping
docker run -v <host>:<container> <image>    # Volume mount
docker run -e KEY=VALUE <image>             # Environment variable
docker run --rm <image>                     # Auto-remove when stopped
docker run --restart=always <image>         # Auto-restart policy

# Container operations
docker start <container>      # Start stopped container
docker stop <container>       # Stop running container
docker restart <container>    # Restart container
docker rm <container>         # Remove container
docker rm -f <container>      # Force remove running container

# Container inspection
docker logs <container>       # View logs
docker logs -f <container>    # Follow logs
docker inspect <container>    # Detailed info
docker exec -it <container> /bin/bash   # Execute command in container
docker cp <container>:<path> <local>    # Copy from container
docker cp <local> <container>:<path>    # Copy to container

# Container stats
docker stats                  # Resource usage
docker top <container>        # Running processes
```

### Image Management

```bash
# List images
docker images
docker image ls

# Pull image
docker pull <image>           # Pull from registry
docker pull <image>:<tag>     # Specific tag

# Build image
docker build -t <name> .                    # Build from Dockerfile
docker build -t <name>:<tag> .              # With tag
docker build -f <dockerfile> -t <name> .    # Custom Dockerfile
docker build --no-cache -t <name> .         # Without cache
docker build --build-arg KEY=VALUE -t <name> .  # With build args

# Remove images
docker rmi <image>            # Remove image
docker image rm <image>       # Remove image
docker image prune            # Remove unused images
docker image prune -a         # Remove all unused images

# Image inspection
docker inspect <image>        # Image details
docker history <image>        # Image layers
docker tag <src> <dst>        # Tag image

# Push to registry
docker login                  # Login to registry
docker push <image>           # Push image
```

### Network Management

```bash
# List networks
docker network ls

# Create network
docker network create <name>
docker network create --driver bridge <name>

# Connect container to network
docker network connect <network> <container>
docker network disconnect <network> <container>

# Remove network
docker network rm <network>
docker network prune          # Remove unused networks

# Inspect network
docker network inspect <network>
```

### Volume Management

```bash
# List volumes
docker volume ls

# Create volume
docker volume create <name>

# Remove volume
docker volume rm <name>
docker volume prune           # Remove unused volumes

# Inspect volume
docker volume inspect <name>
```

### System Commands

```bash
# System info
docker info                   # System information
docker version                # Docker version

# Cleanup
docker system prune           # Remove unused data
docker system prune -a        # Remove all unused (images, containers, volumes, networks)
docker system df              # Disk usage

# Events
docker events                 # Real-time events
```

### Docker Compose Commands

```bash
# Basic commands
docker compose up             # Create and start services
docker compose up -d          # Detached mode
docker compose up --build     # Rebuild images
docker compose down           # Stop and remove containers
docker compose down -v        # Also remove volumes

# Service management
docker compose start          # Start services
docker compose stop           # Stop services
docker compose restart        # Restart services
docker compose pause          # Pause services
docker compose unpause        # Unpause services

# Logs and monitoring
docker compose logs           # View logs
docker compose logs -f        # Follow logs
docker compose logs <service> # Logs for specific service
docker compose ps             # List containers
docker compose top            # Running processes

# Exec and run
docker compose exec <service> <command>   # Execute in running container
docker compose run <service> <command>    # Run one-off command

# Other
docker compose config         # Validate and view config
docker compose pull           # Pull images
docker compose push           # Push images
docker compose scale <service>=<n>        # Scale service
```

---

## Dockerfile Reference

### Basic Structure

```dockerfile
# Syntax directive (recommended)
# syntax=docker/dockerfile:1

# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build arguments
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Non-root user
USER node

# Default command
CMD ["node", "server.js"]
```

### Instructions Reference

#### FROM - Base Image
```dockerfile
FROM <image>
FROM <image>:<tag>
FROM <image>@<digest>
FROM <image> AS <stage>       # Multi-stage build

# Examples
FROM node:20-alpine
FROM python:3.11-slim AS builder
FROM nginx:alpine
```

#### RUN - Execute Commands
```dockerfile
# Shell form
RUN apt-get update && apt-get install -y curl

# Exec form (preferred)
RUN ["apt-get", "install", "-y", "curl"]

# Multi-line with cleanup
RUN apt-get update \
    && apt-get install -y \
        curl \
        git \
    && rm -rf /var/lib/apt/lists/*

# With mount (BuildKit)
RUN --mount=type=cache,target=/var/cache/apt \
    apt-get update && apt-get install -y curl
```

#### CMD - Default Command
```dockerfile
# Exec form (preferred)
CMD ["node", "server.js"]
CMD ["nginx", "-g", "daemon off;"]

# Shell form
CMD node server.js

# As parameters to ENTRYPOINT
CMD ["--port", "3000"]
```

#### ENTRYPOINT - Executable
```dockerfile
# Exec form (preferred)
ENTRYPOINT ["docker-entrypoint.sh"]
ENTRYPOINT ["node", "server.js"]

# Shell form
ENTRYPOINT node server.js

# Combined with CMD
ENTRYPOINT ["node"]
CMD ["server.js"]
```

#### COPY - Copy Files
```dockerfile
COPY <src> <dest>
COPY ["<src>", "<dest>"]      # Paths with spaces

# Options
COPY --from=<stage> <src> <dest>    # From build stage
COPY --chown=<user>:<group> <src> <dest>
COPY --chmod=<permissions> <src> <dest>
COPY --link <src> <dest>            # Create new layer
COPY --exclude=<pattern> <src> <dest>

# Examples
COPY . .
COPY package*.json ./
COPY --from=builder /app/dist ./dist
COPY --chown=node:node . .
```

#### ADD - Add Files (with auto-extract)
```dockerfile
ADD <src> <dest>
ADD ["<src>", "<dest>"]

# Options (same as COPY, plus)
ADD --keep-git-dir=<bool>       # For git repos
ADD --checksum=<checksum>       # For URLs

# Examples
ADD app.tar.gz /app/
ADD https://example.com/file.txt /tmp/
ADD --keep-git-dir=true https://github.com/user/repo.git /repo
```

#### WORKDIR - Working Directory
```dockerfile
WORKDIR /app                   # Absolute path
WORKDIR subdir                 # Relative to previous WORKDIR

# Can use environment variables
ENV BASE=/app
WORKDIR ${BASE}
```

#### ENV - Environment Variables
```dockerfile
ENV KEY=VALUE
ENV KEY="VALUE WITH SPACES"
ENV KEY1=VALUE1 KEY2=VALUE2

# Examples
ENV NODE_ENV=production
ENV PATH="/app/bin:${PATH}"
```

#### ARG - Build Arguments
```dockerfile
ARG <name>
ARG <name>=<default>

# Examples
ARG NODE_VERSION=20
FROM node:${NODE_VERSION}

ARG BUILD_VERSION
ENV VERSION=${BUILD_VERSION}

# Predefined ARGs
ARG TARGETPLATFORM
ARG BUILDPLATFORM
ARG TARGETOS
ARG TARGETARCH
```

#### EXPOSE - Document Ports
```dockerfile
EXPOSE <port>
EXPOSE <port>/<protocol>      # tcp or udp

# Examples
EXPOSE 3000
EXPOSE 80 443
EXPOSE 53/udp
```

#### VOLUME - Create Mount Point
```dockerfile
VOLUME ["/data"]
VOLUME /data /logs

# Examples
VOLUME ["/var/lib/mysql"]
VOLUME ["/app/data", "/app/logs"]
```

#### USER - Set User
```dockerfile
USER <user>
USER <user>:<group>
USER <uid>
USER <uid>:<gid>

# Examples
RUN adduser -D myuser
USER myuser
```

#### LABEL - Add Metadata
```dockerfile
LABEL <key>=<value>
LABEL version="1.0" description="My App"

# Examples
LABEL maintainer="user@example.com"
LABEL org.opencontainers.image.version="1.0"
```

#### HEALTHCHECK - Health Check
```dockerfile
HEALTHCHECK --interval=<duration> --timeout=<duration> --start-period=<duration> --retries=<count> CMD <command>
HEALTHCHECK NONE              # Disable

# Examples
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:3000/health || exit 1
HEALTHCHECK --interval=1m --timeout=3s CMD wget -q --spider http://localhost:80/ || exit 1
```

#### ONBUILD - Trigger on Child Images
```dockerfile
ONBUILD <instruction>

# Examples
ONBUILD COPY . /app
ONBUILD RUN npm install
```

#### STOPSIGNAL - Stop Signal
```dockerfile
STOPSIGNAL <signal>

# Examples
STOPSIGNAL SIGTERM
STOPSIGNAL 15
```

#### SHELL - Default Shell
```dockerfile
SHELL ["executable", "parameters"]

# Examples (Windows)
SHELL ["powershell", "-command"]

# Examples (Linux)
SHELL ["/bin/bash", "-c"]
```

### Multi-Stage Builds

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### Best Practices

1. **Use specific base image tags** - Avoid `latest`
2. **Minimize layers** - Combine RUN commands
3. **Use .dockerignore** - Exclude unnecessary files
4. **Leverage build cache** - Order instructions properly
5. **Use multi-stage builds** - Separate build from runtime
6. **Run as non-root** - Security best practice
7. **Scan for vulnerabilities** - Use `docker scout`
8. **Keep images small** - Use Alpine/slim images

---

## Docker Compose Reference

### Basic Structure

```yaml
# docker-compose.yml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        NODE_ENV: production
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://db:5432/mydb
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - ./data:/app/data
    networks:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 3s
      retries: 3

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - backend
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d mydb"]
      interval: 10s
      timeout: 3s
      retries: 3

networks:
  backend:
    driver: bridge

volumes:
  postgres_data:

```

### Service Configuration

#### Build Options
```yaml
services:
  app:
    build: .
    # or detailed:
    build:
      context: .
      dockerfile: Dockerfile.prod
      args:
        NODE_ENV: production
      target: production
      cache_from:
        - myimage:cache
      labels:
        - "description=My App"
```

#### Image
```yaml
services:
  app:
    image: node:20-alpine
    image: myregistry.com/myimage:v1.0
```

#### Ports
```yaml
services:
  app:
    ports:
      - "3000:3000"           # host:container
      - "8080:80"
      - "127.0.0.1:8000:8000"  # bind to specific IP
      - "53:53/udp"           # UDP port
```

#### Environment Variables
```yaml
services:
  app:
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgres://db:5432/mydb
    env_file:
      - .env
      - .env.production
```

#### Volumes
```yaml
services:
  app:
    volumes:
      - ./data:/app/data              # Bind mount
      - app_data:/var/lib/data        # Named volume
      - /app/node_modules             # Anonymous volume
      - type: bind
        source: ./config
        target: /app/config
        read_only: true
```

#### Networks
```yaml
services:
  app:
    networks:
      - frontend
      - backend

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true  # No external access
```

#### Depends On
```yaml
services:
  app:
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
```

#### Health Check
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

#### Resource Limits
```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

#### Restart Policy
```yaml
services:
  app:
    restart: no          # Don't restart (default)
    restart: always      # Always restart
    restart: on-failure  # Restart on failure
    restart: unless-stopped  # Restart unless stopped manually
```

### Profiles
```yaml
services:
  app:
    # Always included
    profiles: []
  
  debug:
    # Only with --profile debug
    profiles:
      - debug
  
  test:
    # Only with --profile test
    profiles:
      - test
```

```bash
docker compose --profile debug up
docker compose --profile test up
```

---

## Common Patterns

### Node.js Application

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### Python Application

```dockerfile
FROM python:3.11-slim AS builder
WORKDIR /app
RUN python -m venv /opt/venv
COPY requirements.txt .
RUN /opt/venv/bin/pip install --no-cache-dir -r requirements.txt

FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Nginx Reverse Proxy

```yaml
# docker-compose.yml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro
    depends_on:
      - app
    networks:
      - frontend

  app:
    build: .
    expose:
      - "3000"
    networks:
      - frontend
      - backend

networks:
  frontend:
  backend:
    internal: true
```

### Development with Hot Reload

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
      - NODE_ENV=development
    ports:
      - "3000:3000"
    command: npm run dev
```

---

## Troubleshooting

### Common Issues

```bash
# Container won't start
docker logs <container>
docker inspect <container>

# Permission denied
docker exec -it -u root <container> /bin/sh

# Space issues
docker system df
docker system prune -a

# Network issues
docker network inspect <network>
docker exec <container> ping <other-container>

# Volume issues
docker volume inspect <volume>
docker run --rm -v <volume>:/data alpine ls /data

# Build issues
docker build --no-cache -t myimage .
docker build --progress=plain -t myimage .
```

### Debug Commands

```bash
# Enter running container
docker exec -it <container> /bin/bash
docker exec -it <container> /bin/sh  # Alpine

# Check container processes
docker top <container>

# Resource usage
docker stats <container>

# Container events
docker events --filter container=<container>

# Export/Import container
docker export <container> > container.tar
docker import container.tar myimage:latest
```

---

## References

- [Docker CLI Reference](references/cli-reference.md)
- [Dockerfile Full Reference](references/dockerfile-reference.md)
- [Compose File Reference](references/compose-reference.md)
- [Best Practices](references/best-practices.md)

## Official Documentation

- [Docker Docs](https://docs.docker.com/)
- [Docker Hub](https://hub.docker.com/)
- [Dockerfile Reference](https://docs.docker.com/reference/dockerfile/)
- [Compose File Reference](https://docs.docker.com/reference/compose-file/)
- [Docker CLI Reference](https://docs.docker.com/reference/cli/docker/)
