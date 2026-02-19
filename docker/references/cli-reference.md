# Docker CLI Commands Full Reference

## Container Commands

### docker run
Run a container from an image.

```bash
docker run [OPTIONS] IMAGE [COMMAND] [ARG...]

# Common options
-d, --detach              Run in background
-i, --interactive         Keep STDIN open
-t, --tty                 Allocate pseudo-TTY
--name NAME               Container name
-p, --publish PORT        Publish port (host:container)
-P, --publish-all         Publish all exposed ports
-v, --volume VOLUME       Bind mount volume
-e, --env ENV             Set environment variables
--env-file FILE           Read env from file
-w, --workdir DIR         Working directory
-u, --user USER           Username or UID
--rm                      Auto-remove on exit
--restart POLICY          Restart policy
--memory BYTES            Memory limit
--cpus NUMBER             CPU limit
--network NETWORK         Connect to network
--add-host HOST           Add custom host-to-IP mapping
--dns IP                  DNS server
--hostname HOST           Container hostname
--label LABEL             Set metadata
--mount MOUNT             Attach filesystem mount
--platform PLATFORM       Platform (linux/amd64, linux/arm64)
--pull POLICY             Pull image policy (missing, never, always)
--security-opt OPTION     Security options
--cap-add CAPABILITY      Add Linux capabilities
--cap-drop CAPABILITY     Drop Linux capabilities
--privileged              Give extended privileges
--read-only               Mount root as read-only
--tmpfs FS                Mount tmpfs
--ulimit ULIMIT           Ulimit options
--init                    Run init process
--entrypoint CMD          Overwrite ENTRYPOINT
--health-cmd CMD          Health check command
--health-interval DUR     Time between checks
--health-timeout DUR      Maximum time for check
--health-retries N        Consecutive failures needed
--health-start-period DUR Start period for bootstrap

# Examples
docker run -d -p 80:80 --name web nginx:alpine
docker run -it --rm python:3.11 python
docker run -v $(pwd):/app -w /app node:20 npm test
docker run -e DATABASE_URL=postgres://... myapp
docker run --memory=512m --cpus=0.5 myapp
```

### docker ps
List containers.

```bash
docker ps [OPTIONS]

# Options
-a, --all                 Show all containers (default running)
-f, --filter FILTER       Filter output
--format FORMAT           Format output
-n, --last N              Show n last created containers
-l, --latest              Show latest created container
-q, --quiet               Only display IDs
-s, --size                Display total file sizes

# Filter options
-f status=running
-f status=exited
-f name=web
-f ancestor=nginx
-f label=app=web

# Format
--format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
--format "{{.ID}}"

# Examples
docker ps
docker ps -a
docker ps -f status=running
docker ps -q
```

### docker exec
Execute command in running container.

```bash
docker exec [OPTIONS] CONTAINER COMMAND [ARG...]

# Options
-d, --detach              Detached mode
-e, --env ENV             Set environment variables
-i, --interactive         Keep STDIN open
-t, --tty                 Allocate pseudo-TTY
-u, --user USER           Username or UID
-w, --workdir DIR         Working directory
--privileged              Give extended privileges

# Examples
docker exec -it web /bin/bash
docker exec web ls /app
docker exec -u root web apt-get update
docker exec -e DEBUG=true web node script.js
```

### docker logs
View container logs.

```bash
docker logs [OPTIONS] CONTAINER

# Options
-f, --follow              Follow log output
--since TIME              Show logs since timestamp
--until TIME              Show logs before timestamp
-t, --timestamps          Show timestamps
--tail N                  Number of lines from end
--details                 Extra details

# Examples
docker logs web
docker logs -f web
docker logs --tail 100 web
docker logs --since 2h web
docker logs web 2>&1  # Include stderr
```

### docker inspect
Detailed information on objects.

```bash
docker inspect [OPTIONS] NAME|ID [NAME|ID...]

# Options
-f, --format FORMAT       Format output
-s, --size                Display total file sizes
--type TYPE               Return JSON for type

# Examples
docker inspect web
docker inspect --format '{{.State.Status}}' web
docker inspect --format '{{.NetworkSettings.IPAddress}}' web
docker inspect --format '{{json .Config.Env}}' web
```

### docker cp
Copy files between container and local.

```bash
docker cp [OPTIONS] CONTAINER:SRC_PATH DEST_PATH
docker cp [OPTIONS] SRC_PATH CONTAINER:DEST_PATH

# Options
-a, --archive             Archive mode (preserve permissions)
-L, --follow-link         Always follow symbol links

# Examples
docker cp web:/app/logs ./logs
docker cp ./config.json web:/app/config.json
docker cp web:/app/data ./backup
```

### docker stats
Container resource usage statistics.

```bash
docker stats [OPTIONS] [CONTAINER...]

# Options
-a, --all                 All containers (default running)
--format FORMAT           Format output
--no-stream               Disable streaming stats
--no-trunc                Don't truncate output

# Examples
docker stats
docker stats web db
docker stats --no-stream
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```

---

## Image Commands

### docker build
Build image from Dockerfile.

```bash
docker build [OPTIONS] PATH | URL | -

# Options
-t, --tag TAG             Name and tag
-f, --file FILE           Dockerfile name
--build-arg ARG           Build-time variables
--no-cache                Don't use cache
--pull                    Always pull base image
--platform PLATFORM       Target platform
--target STAGE            Target build stage
--progress STYLE          Output type (auto, plain)
--secret SECRET           Secret file to expose
--ssh SSH                 SSH agent socket
--cache-from IMAGE        Cache source images
--label LABEL             Set metadata
--network NETWORK         Network for RUN instructions
--squash                  Squash layers
-q, --quiet               Suppress output
--rm                      Remove intermediate containers (default)

# Examples
docker build -t myapp .
docker build -t myapp:v1.0 -f Dockerfile.prod .
docker build --build-arg VERSION=1.0 -t myapp .
docker build --no-cache -t myapp .
docker build --target builder -t myapp:builder .
docker build --platform linux/amd64,linux/arm64 -t myapp .
```

### docker pull
Pull image from registry.

```bash
docker pull [OPTIONS] NAME[:TAG|@DIGEST]

# Options
-a, --all-tags            Download all tags
--platform PLATFORM       Platform
-q, --quiet               Suppress output

# Examples
docker pull nginx
docker pull nginx:alpine
docker pull nginx@sha256:abc123...
docker pull --platform linux/arm64 nginx
```

### docker push
Push image to registry.

```bash
docker push [OPTIONS] NAME[:TAG]

# Options
-a, --all-tags            Push all tags
--platform PLATFORM       Platform
-q, --quiet               Suppress output

# Examples
docker push myapp:v1.0
docker push myregistry.com/myapp:v1.0
docker push --all-tags myapp
```

### docker tag
Create tag for image.

```bash
docker tag SOURCE_IMAGE[:TAG] TARGET_IMAGE[:TAG]

# Examples
docker tag myapp myapp:v1.0
docker tag myapp myregistry.com/myapp:latest
```

### docker images / docker image ls
List images.

```bash
docker images [OPTIONS] [REPOSITORY[:TAG]]

# Options
-a, --all                 Show all images
-f, --filter FILTER       Filter output
--format FORMAT           Format output
--no-trunc                Don't truncate output
-q, --quiet               Only image IDs

# Filter options
-f dangling=true          Unused images
-f reference=nginx        Match reference
-f label=app=web         Match label
-f since=abc123          Images created after
-f before=abc123         Images created before

# Examples
docker images
docker images nginx
docker images -f dangling=true -q
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
```

### docker rmi / docker image rm
Remove images.

```bash
docker rmi [OPTIONS] IMAGE [IMAGE...]
docker image rm [OPTIONS] IMAGE [IMAGE...]

# Options
-f, --force               Force removal
--no-prune                Don't delete untagged parents

# Examples
docker rmi nginx
docker rmi -f nginx:latest
docker rmi $(docker images -q)
```

### docker image prune
Remove unused images.

```bash
docker image prune [OPTIONS]

# Options
-a, --all                 Remove all unused images
-f, --force               Don't prompt for confirmation
--filter FILTER           Filter output

# Examples
docker image prune
docker image prune -a
docker image prune -a -f
```

---

## Network Commands

### docker network create
Create network.

```bash
docker network create [OPTIONS] NETWORK

# Options
-d, --driver DRIVER       Driver (bridge, overlay, macvlan, none)
--subnet SUBNET           Subnet in CIDR format
--gateway GATEWAY         Gateway for subnet
--ip-range RANGE          Container IP range
--ipv6                    Enable IPv6
--label LABEL             Set metadata
--attachable              Allow manual container attachment
--internal                Restrict external access
--ingress                 Create routing-mesh network

# Examples
docker network create mynetwork
docker network create --driver bridge mynetwork
docker network create --subnet=192.168.0.0/16 mynetwork
docker network create --driver overlay myoverlay
```

### docker network ls
List networks.

```bash
docker network ls [OPTIONS]

# Options
-f, --filter FILTER       Filter output
--no-trunc                Don't truncate output
-q, --quiet               Only display IDs

# Examples
docker network ls
docker network ls -f driver=bridge
```

### docker network inspect
Network details.

```bash
docker network inspect [OPTIONS] NETWORK [NETWORK...]

# Options
-f, --format FORMAT       Format output
-v, --verbose             Verbose output

# Examples
docker network inspect bridge
docker network inspect --format '{{.Driver}}' mynetwork
```

---

## Volume Commands

### docker volume create
Create volume.

```bash
docker volume create [OPTIONS] [VOLUME]

# Options
-d, --driver DRIVER       Driver (local default)
--opt OPTION              Driver options
--label LABEL             Set metadata

# Examples
docker volume create mydata
docker volume create --driver local mydata
docker volume create --opt type=tmpfs --opt device=tmpfs mytmpfs
```

### docker volume ls
List volumes.

```bash
docker volume ls [OPTIONS]

# Options
-f, --filter FILTER       Filter output
--format FORMAT           Format output
-q, --quiet               Only display names

# Examples
docker volume ls
docker volume ls -f dangling=true
```

### docker volume rm
Remove volume.

```bash
docker volume rm [OPTIONS] VOLUME [VOLUME...]

# Options
-f, --force               Force removal

# Examples
docker volume rm mydata
docker volume rm $(docker volume ls -q)
```

---

## System Commands

### docker system prune
Remove unused data.

```bash
docker system prune [OPTIONS]

# Options
-a, --all                 Remove all unused images
-f, --force               Don't prompt
--volumes                 Prune volumes
--filter FILTER           Filter output

# Examples
docker system prune
docker system prune -a
docker system prune -a --volumes -f
```

### docker system df
Disk usage.

```bash
docker system df [OPTIONS]

# Options
-v, --verbose             Show detailed information

# Examples
docker system df
docker system df -v
```

---

## Docker Compose Commands

### docker compose up
Create and start services.

```bash
docker compose up [OPTIONS] [SERVICE...]

# Options
-d, --detach              Detached mode
--build                   Build images before starting
--no-build                Don't build images
--pull                    Pull images before running
--no-deps                 Don't start linked services
--force-recreate          Recreate containers
--no-recreate             Don't recreate containers
--no-start                Create but don't start
--scale SERVICE=NUM       Scale service
-V, --renew-anon-volumes  Refresh anonymous volumes
--remove-orphans          Remove orphan containers
-t, --timeout TIMEOUT     Shutdown timeout
--exit-code-from SERVICE  Return exit code from service
--abort-on-container-exit Stop on any container exit
--profile PROFILE         Enable profile
--env-file FILE           Specify env file
-f, --file FILE           Compose file
-p, --project-name NAME   Project name

# Examples
docker compose up
docker compose up -d
docker compose up --build
docker compose up -d --scale web=3
docker compose --profile dev up
docker compose -f docker-compose.prod.yml up -d
```

### docker compose down
Stop and remove containers.

```bash
docker compose down [OPTIONS]

# Options
--rmi TYPE                Remove images (all, local)
-v, --volumes             Remove named volumes
--remove-orphans          Remove orphan containers
-t, --timeout TIMEOUT     Shutdown timeout
--timeout TIMEOUT         Shutdown timeout

# Examples
docker compose down
docker compose down -v
docker compose down --rmi all
docker compose down --remove-orphans
```

### docker compose logs
View logs.

```bash
docker compose logs [OPTIONS] [SERVICE...]

# Options
-f, --follow              Follow output
--no-color                Monochrome output
--no-log-prefix           Don't print prefix
--since TIME              Show logs since
--until TIME              Show logs until
-t, --timestamps          Show timestamps
--tail N                  Lines from end

# Examples
docker compose logs
docker compose logs -f web
docker compose logs --tail 100 web db
```

### docker compose exec
Execute command in container.

```bash
docker compose exec [OPTIONS] SERVICE COMMAND [ARG...]

# Options
-d, --detach              Detached mode
-e, --env ENV             Set environment
-i, --interactive         Keep STDIN open
-t, --tty                 Allocate pseudo-TTY
-u, --user USER           Username or UID
-w, --workdir DIR         Working directory
--index INDEX             Container index if multiple

# Examples
docker compose exec web /bin/bash
docker compose exec db psql -U user
docker compose exec -u root web apt-get update
```

### docker compose run
Run one-off command.

```bash
docker compose run [OPTIONS] SERVICE [COMMAND] [ARG...]

# Options
-d, --detach              Detached mode
-e, --env ENV             Set environment
--entrypoint CMD          Override entrypoint
--name NAME               Container name
--no-deps                 Don't start linked services
-p, --publish PORT        Publish port
--rm                      Remove on exit
--use-aliases             Use network aliases
-v, --volume VOLUME       Bind mount
-w, --workdir DIR         Working directory
-T, --no-tty              Disable pseudo-TTY
-u, --user USER           Username or UID

# Examples
docker compose run web npm test
docker compose run --rm web python manage.py migrate
docker compose run db psql -h db -U user
```

### docker compose ps
List containers.

```bash
docker compose ps [OPTIONS] [SERVICE...]

# Options
-a, --all                 Show all containers
--filter FILTER           Filter output
--format FORMAT           Format output
--services                Display services
-q, --quiet               Only display IDs
--status STATUS           Filter by status

# Examples
docker compose ps
docker compose ps -a
docker compose ps --format json
```

### docker compose config
Validate and view config.

```bash
docker compose config [OPTIONS]

# Options
--resolve-image-digests   Pin image digests
--no-interpolate          Don't interpolate
--no-normalize            Don't normalize
--profiles                Show profiles
--quiet                   Quiet mode
--services                Display services
--volumes                 Display volumes
--hash SERVICE            Print service hash

# Examples
docker compose config
docker compose config --services
docker compose config --quiet
```

### docker compose scale
Scale services.

```bash
docker compose scale [OPTIONS] SERVICE=NUM [SERVICE=NUM...]

# Examples
docker compose scale web=3 worker=2
```

---

## Swarm Commands

### docker swarm init
Initialize swarm.

```bash
docker swarm init [OPTIONS]

# Options
--advertise-addr ADDR     Advertised address
--availability AVAIL      Node availability
--listen-addr ADDR        Listen address
--autolock                Enable manager autolocking

# Examples
docker swarm init
docker swarm init --advertise-addr 192.168.1.100
```

### docker swarm join
Join swarm.

```bash
docker swarm join [OPTIONS] HOST:PORT

# Options
--token TOKEN             Join token
--advertise-addr ADDR     Advertised address
--listen-addr ADDR        Listen address
--availability AVAIL      Node availability

# Examples
docker swarm join --token TOKEN HOST:2377
```

### docker service create
Create service.

```bash
docker service create [OPTIONS] IMAGE [COMMAND] [ARG...]

# Options
--name NAME               Service name
--replicas N              Number of replicas
--network NETWORK         Network
--publish PORT            Port mapping
--env ENV                 Environment
--mount MOUNT             Mount
--constraint CONSTRAINT   Placement constraints
--limit-cpu CPU           CPU limit
--limit-memory MEMORY     Memory limit
--update-delay DUR        Update delay
--update-parallelism N    Update parallelism
--rollback-delay DUR      Rollback delay
--health-cmd CMD          Health check command
--health-interval DUR     Health check interval
--health-retries N        Health check retries

# Examples
docker service create --name web --replicas 3 --publish 80:80 nginx
docker service create --name app --network backend --env NODE_ENV=prod myapp
```

### docker service scale
Scale service.

```bash
docker service scale SERVICE=REPLICAS [SERVICE=REPLICAS...]

# Examples
docker service scale web=5
docker service scale web=5 worker=3
```

### docker stack deploy
Deploy stack.

```bash
docker stack deploy [OPTIONS] STACK

# Options
-c, --compose-file FILE   Compose file
--prune                   Prune orphan services
--resolve-image OPTION    Image resolution
--with-registry-auth      Send registry auth

# Examples
docker stack deploy -c docker-compose.yml mystack
docker stack deploy -c compose.yml --with-registry-auth mystack
```
