# Security Audit Tracker

> **DevOps Exam 2025** - A comprehensive security audit management system

## Description

The Security Audit Tracker is a web-based application designed for managing security audits and findings across an organization's IT infrastructure. It helps security teams track vulnerability assessments, penetration tests, compliance checks, and remediation efforts.

## Application Overview

This application consists of three main services:

- **Frontend** (Port 8080): User interface built with HTML/CSS/JavaScript
- **Backend API** (Port 3000): RESTful API built with Node.js and Express
- **Database**: PostgreSQL database for data persistence

## Architecture
**Architecture Overview**

    Frontend Container
    
        │ HTTP/REST
        ▼
    Backend Container
    
        │ SQL
        ▼
    Database Container (with Persistent Volume)

    (Frontend sends requests to API (backend), backend's endpoints are triggered and perform SQL queries = CRUD operations in database container)

**Container Cross-Communication**

DOCKER-COMPOSE

- Docker network configured named "security-net".
- Containers use service names to bind IP address to constant value (automatic DNS resolution).
- Containers communicatie via stable service names.

KUBERNETES 
- Service.yaml => Configure DNS + Loadbalancing.
- The service files give a stable DNS name to the pods in kubernetes (making them accesible for other pods even if its IP address changes).
- The service files handle loadbalancing so that all pods of the same service are handles equally (no one pod has to work harder then others).

## Prerequisites

- Docker Desktop (version 28.4.0 or higher)
- Minikube (version 1.37.0 or higher)
- kubectl CLI (version 1.36.0 or higher)
- Git (version 2.47.0 or higher)
- Node.js (version 20.22.0 or higher)
- Npm (version 10.9.3 or higher)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/thomas-more-devops/devops-exam-2025-jamey-verlinden
```

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configure Environment Variables
**Frontend**


1. Use the designated "dist.env" file ./frontend
2. Define values:
```
PORT=8080
NODE_ENV=development
```

**Database**

1. Use the designated "dist.env" file in ./database
2. Define values:
```
POSTGRES_DB=${POSTGRES_DB} # Assign new database name
POSTGRES_USER=${POSTGRES_USER} # Assign new username
POSTGRES_PASSWORD=${POSTGRES_PASSWORD} # Assign new password
```


**Backend**

1. Use the designated "dist.env" file in ./backend
2. Define values:
>Postgress name, username and password must correspond to the given input of the database .env file!
```
PORT=3000
NODE_ENV=development

DB_HOST=${DB_HOST} #THIS MUST BE "Localhost" (local database)
                     #Change to "audit-database" of database later.
DB_PORT=5432
DB_NAME=${DB_NAME}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
```


### 4. Set Up Database

See "GETTING_STARTED.md" for more information on how to configure a local postgres database.

## 5. Start the Application

> **Note:** All commands must be executed from the **project root directory**, unless stated otherwise.  
> Each service has its own `.env` file located in the **same directory as its Dockerfile**.

### Backend

Navigate to the backend directory, and execute the following command (on a different terminal).

   ```bash
   npm start
   ```
To verify that it worked, visit "http://localhost:3000/api/health". You should see JSON with status: "healthy".

### Frontend

Navigate to the frontend directory, and execute the following command (on a different terminal).

   ```bash
   npm start
   ```

Now you can go to "http://localhost:8080/". If you have both services running, you should be able to use the application.

Afterwards, you can close the port exposure by clicking "ctrl + c" in the terminals.

>And don't forget to change set "DB_HOST=" of the .env of the backend to "audit-database"! This will be important for docker-compose and kubernetes.

## Docker Setup

**Using docker to run containers** 

All essential services (frontend, backend & database) have been built into functional containers. Docker compose is ideal for this as it allows cross communication between containers by creating a new network.

### Building Docker Images

### Backend

Within the backend folder, execute the following command:
```powershell
docker built -t security-backend .
```

### Frontend

Within the frontend folder, execute the following command:

```powershell
docker built -t security-frontend .
```
### Database

Within the database folder, execute the following command:

```powershell
docker built -t security-database .
```

### Running with Docker Compose

>Location: root folder.
```powershell
docker-compose up -d # => Run docker-compose and built containers.
                     
#Go to "localhost:8080" in your browser.

docker-compose down  # => Stop docker-compose and remove containers.
```

### Docker Image Optimization

**Image Sizes**
> Backend: 243.52 MB

> Frontend: 391.65 MB

> Database: 234.13 MB

Optimizations for the containers include:
- Usage of a alpine (very small base image).
- Multi-stage builds.
- prune --production (production dependencies removed for final image).
- npm ci (clean install of dependencies, more space efficent then npm install). 

## Kubernetes Deployment

### Prerequisites

#### 1. Installing minikube

- Install minikube on your localhost. Follow the offical Minikube installation instructions, as provided by the documentation: https://minikube.sigs.k8s.io/docs/start/?arch=%2Fwindows%2Fx86-64%2Fstable%2F.exe+download 

#### 2. Starting minikube

To start minikube, open a terminal and run the following command:
```powershell
minikube start --driver=docker
```

#### 3. Change docker context to your minikube environment

To built images within minikube, you must change your current docker context to that of minikube. This can be achieved with the following command.

If you're on windows:
```powershell
minikube -p minikube docker-env --shell powershell | Invoke-Expression
```

If you're on linux:
```bash
eval $(minikube -p minikube docker-env)
```

## Deploying to Kubernetes

### 1. Namespace

A namespace is a virtual cluster inside an already existing cluster. It's useful for separating dev, testing, debug environments from each other while being able to co-exist at the same time.

Create a new namespace with the following command.
```bash
kubectl create namespace security-tracker
```

Switch current context to the newly created namespace.
```bash
kubectl config set-context --current --namespace=security-tracker
```

### 2. Secret files

>location: k8s/Secrets/

All the current docker containers rely on variables. It is thus required to first configure and apply these variables before being able to apply and built the images.

1. In this folder, copy all the template files and name them:

- postgres-secrets-template.yaml => postgres-secrets.yaml
- backend-secrets-template.yaml => backend-secrets.yaml

2. Fill in all necessary fields in the newly created secrets.yaml file (**NOT in template files!**).

**! IMPORTANT !**

The parameters in the secret files must be encrypted with Base64! To do so, you can execute the following command on each variable.

(See the .env variables for database & backen for accurate information).

If you're on Windows:
```powershell
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("myuser"))
```

If you're on linux:
```bash
echo -n "myuser" | base64
```

### 3. Building docker images in Minikube

Now that all secret variables have been configured and applied, the images can be built within minikube.

Navigate to each folder (frontend, backend, database) before building its image.

For each folder, execute the following command.

**Backend**
```bash
docker built -t security-backend . # => In the backend folder!
```
**Frontend**
```bash
docker built -t security-frontend . # => In the frontend folder!
```
**Database**
```bash
docker built -t security-database . # => In the database folder!
```

Afterwards, confirm they are built:
```bash
docker images
```

(You should see: "security-frontend", "security-backend" and "security-database").

### 4. Applying YAML Files

> Location: /k8s/

Now that images are built, the Kubernetes deployment manifests can be applied to create pods and services for the application.

Apply the YAML files in the following order:

```bash
kubectl apply -f ConfigMaps/
kubectl apply -f Secrets/
kubectl apply -f Frontend/
kubectl apply -f Database/
kubectl apply -f Backend/
```

### Kubernetes Resources Created

- [x] Frontend Deployment
- [x] Backend Deployment
- [x] Database StatefulSet/Deployment
- [x] Services (ClusterIP, NodePort, LoadBalancer)
- [x] ConfigMaps for configuration
- [x] Secrets for sensitive data
- [x] PersistentVolumeClaims for database storage
- [ ] Ingress

### Accessing the Application

Since Ingress is not applied in minikube, the frontend and backend must be exposed to their correct ports manually.

To do so, open 2 new terminals. 

Execute this command in the first terminal:
```bash
kubectl port-forward -n security-tracker svc/frontend 8080:8080
```

In the second terminal, execute the following command.
```bash
kubectl port-forward -n security-tracker svc/backend 3000:3000
```

Now access the application by entering the "localhost:8080" in your browser. You should be able to see the frontend, all audits with the ability to add new audits.

## CI/CD Pipeline

### Automated Tests in CI/CD Pipeline

The GitHub Actions workflow performs automated validation whenever code is pushed or a pull request is created for the master branches. The CI job specifically runs the following tests:

1. **Checkout Code**  
   Pulls the latest repository code to the runner.

2. **Install Dependencies**  
   Installs backend dependencies using npm ci.

3. **Run Unit Tests**  
   Executes backend tests with npm test (Jest).
   
   => Run test files in test folder.

4. **Dockerfile Validation**  
   Performs a syntax check by building the backend and frontend Dockerfiles with docker build --no-cache.

5. **Kubernetes Manifest Validation**  
   Performs a dry-run kubectl apply to ensure all manifests in the k8s/ folder are valid.


### Built Process

The Docker images for the project are automatically built as part of the CI/CD pipeline. The process is as follows:

1. Backend, frontend, and database Docker images are built the dockerfiles in their own folder.
2. Each image is tagged with both the current commit SHA and latest.
3. Images are pushed to the GitHub Container Registry (GHCR) using credentials provided by GitHub Actions (GITHUB_TOKEN).
4. The workflow uses caching (cache-from and cache-to) to speed up subsequent builds.

---

### Deployment Automation

The workflow can automatically deploy the application to a Kubernetes cluster. The deployment steps include:

1. Validation of Kubernetes manifests using `kubectl apply --dry-run`.
2. (Optional) Applying manifests to the cluster to create/update pods, services, ConfigMaps, and Secrets.
3. Automatic rollback if tests fail or the workflow encounters an error.

---

## Testing

Automated tests are run as part of the CI/CD workflow, and can also be executed locally:

**Backend**
```bash
# Backend tests
cd backend
npm test
```

## Monitoring & Health Checks

### Health Check Endpoints

- Backend API: `http://localhost:3000/api/health`
- Backend Readiness: `http://localhost:3000/api/ready`
- Frontend: `http://localhost:8080/health`

**Backend**
- livenessProbe. Http request send to /api/health (=> Confirm the pod is "alive").
- readinessProbe. Http request send to /api/ready (=> Confirm the pod is "ready" = able to handle requests).

**Frontend**
- Both livenessProbe & readinessProbe are http requests to "/" (=> The only page) on port 8080.

## Environment Variables

### 1. Database

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| POSTGRES_DB | Name of the postgres database | — | Yes |
| POSTGRES_USER | Name of user (required for login in postgres) | — | Yes |
| POSTGRES_PASSWORD | Password of database | — | Yes |

### 2. Backend & Frontend

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| NODE_ENV | Environment the service is running in | — | No |
| PORT | Port the service is running on | — | Yes |
| DB_HOST | Password of database | — | Yes |
| DB_PORT | Port the database is currently listening on | — | Yes |
| DB_NAME | Name of the database | — | Yes |
| DB_USER | Name of the database username | — | Yes |
| DB_PASSWORD | Password of database | — | Yes |

## API Documentation

See [docs/API.md](docs/API.md) for detailed API documentation.

## Troubleshooting

### Common Issues

**Issue: Backend can't connect to database**

Confirm both backend and database are listening to the correct ports:

- Check backend: go to your browser and type "[http://localhost:3000/api/health]". You should see "Status healthy".

- Check database. Execute the following command:

    netstat -an | find "5432"

If there is still no connection between these 2 services: check the env variables! 
Remember: the username, password and databasename you define in the .env variables for your database must be the same as the .env variables in your backend!


**Issue: Frontend can't reach backend API**

Check if both services are running on the correct ports:

- Frontend: enter localhost:8080 in your browser.
- Backend: enter localhost:3000/api/health in your browser.


## Git Workflow & Branching Strategy

### Branch Protection

- Protection mainly for master branch.
- Master branch can only be updated via merging branches.
- Force pushes to master have been disabled.

### Pull Request Process

- Create a feature branch.
- Push branch to remote.
- Push updates to the correct branch.
- PR branch with master.
- Review, resolve conflicts and merge.

## Project Structure

```
security-audit-tracker/
├── frontend/           # Frontend service
│   ├── public/        # Static files (HTML, CSS, JS)
│   ├── server.js      # Express server for serving frontend
│   └── package.json
|   └── package-lock.json
|   └── Dockerfile # Dockerfile to build frontend image
|   └── Dockerignore
|
├── backend/           # Backend API service
│   ├── src/          # Source code
│   │   ├── server.js # Main API server
│   │   └── database.js # Database connection
│   ├── tests/        # Test files
│   └── Coverage/
│   └── package.json
│   └── package-lock.json
│   └── Dockerfile
│   └── Dockerignore
|
├── database/         # Database files
│   ├── migrations/   # Database schema
│   └── seeds/        # Sample data
│   └── Dockerfile
│   └── Dockerignore
│   └── init.sh
|
├── k8s/
|   └── ...
|
├── docs/            # Documentation
└── README
└── GETTING_STARTED.md # How to set up a local postgres database
└── docker-compose.yaml
```

## Security Considerations

- [x] No secrets in version control
- [x] Environment variables for configuration
- [ ] Least privilege access in Kubernetes
- [ ] Regular security updates
- [ ] Input validation in API
- [ ] HTTPS/TLS (if implemented)

## Performance Optimization

- Layer caching for docker images
- Very small base image for backend & frontend (alpine)
- ...

## Contributing

- Create a new feature branch from main (feature/...)
- Push changes to the branch
- Open a Pull Request for review
- Wait for approval before merging into main
- Keep commits clean and descriptive

## License

MIT License - See LICENSE file for details

## DevOps Exam Checklist

### Git & GitHub
- [x] Repository created with correct naming convention
- [x] .gitignore configured properly
- [x] Branch protection rules enabled on main/master
- [x] Meaningful commit messages throughout (more or less...)
- [x] README.md completed with all sections

### Docker
- [x] Dockerfile created for frontend
- [x] Dockerfile created for backend
- [x] Dockerfile created for database (or using official image)
- [x] Multi-stage builds implemented
- [x] Docker images optimized for size
- [x] .dockerignore files created
- [x] All services work in containers

### Docker Compose
- [x] docker-compose.yml created
- [x] All services defined
- [x] Networks configured
- [x] Volumes configured for persistence
- [x] Environment variables properly managed
- [x] Application starts with single command

### Kubernetes
- [x] Deployment manifests created
- [x] Service manifests created
- [x] ConfigMaps created
- [x] Secrets created
- [x] PersistentVolumeClaims created
- [x] Health checks (liveness probes) configured
- [x] Readiness probes configured
- [x] Resource limits set
- [x] Application accessible and working

### CI/CD
- [x] GitHub Actions workflow created
- [x] Tests run automatically on PR
- [x] Docker images built automatically
- [x] Images pushed to registry
- [x] Workflow succeeds on main branch

### Documentation
- [x] README.md complete
- [x] Architecture documented
- [x] API documented
- [x] Deployment process documented
- [x] Troubleshooting guide included

---

**Application Version:** 1.0.0
**Exam:** DevOps Final Exam 2025
**Course:** Data Science, Protection & Security
