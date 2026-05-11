# DevOps Final Exam 2025 - Instructions

## Exam Information

**Course:** DevOps
**Date:** 19/20 January 2026

## Overview

This exam assesses your ability to apply DevOps practices to a real-world application. You will containerize, orchestrate, and deploy the Security Audit Tracker application using the skills learned throughout the 11-week course.

**IMPORTANT:** You should NOT need to modify the application code (JavaScript, HTML, CSS, SQL). This exam tests your DevOps skills, not your programming skills.

## Exam Format

The exam consists of two parts:

1. **Practical Implementation (70%)** - Complete the tasks below
2. **Oral Examination (30%)** - Explain your implementation and answer questions

## What You're Given

You will receive:
- Complete, working application code (frontend, backend, database)
- Database schema and sample data
- README.md template with TODOs
- API documentation
- Architecture documentation template
- Test files ready to run

## What You Need to Create

You must create all DevOps infrastructure:
- Dockerfiles (not provided)
- docker-compose.yml (not provided)
- Kubernetes manifests (not provided)
- CI/CD pipeline (not provided)
- Complete documentation (partially provided - you must complete)

---

## Part 1: Practical Implementation Tasks

### Task 1: Git & GitHub Setup

**Objective:** Set up a professional Git repository with proper configuration.

#### Requirements:

1. **Create Repository**
   - In `thomas-more-devops` GitHub organization
   - Repository name: `devops-exam-2025-[your-firstname-lastname]`
   - Example: `devops-exam-2025-john-smith`
   - Make repository private
   - Initialize with the provided application code

2. **Configure .gitignore**

3. **Branch Protection**
   - Protect the `main` (or `master`) branch
   - Require pull request reviews before merging
   - Prevent force pushes
   - Prevent deletions

4. **Commit Quality**
   - Use meaningful commit messages
   - Make logical, atomic commits
   - Follow conventional commit format (recommended)

**Deliverables:**
- [ ] Private GitHub repository with correct name
- [ ] Proper .gitignore configuration
- [ ] Branch protection rules enabled
- [ ] Clean commit history

---

### Task 2: Docker Containerization

**Objective:** Containerize all three services with optimized Dockerfiles.

#### Requirements:

1. **Create Dockerfile for Frontend**
   - Use appropriate base image (Node.js)
   - Copy only necessary files
   - Install dependencies
   - Expose correct port
   - Set proper CMD

2. **Create Dockerfile for Backend**
   - Use appropriate base image (Node.js)
   - Copy only necessary files
   - Install dependencies
   - Expose correct port
   - Set proper CMD

3. **Database Setup**
   - Use official PostgreSQL image OR create custom Dockerfile
   - Ensure initialization scripts run on startup
   - Configure environment variables

4. **Optimization**
   - Use multi-stage builds to reduce image size
   - Leverage layer caching
   - Create .dockerignore files
   - Use non-root users (bonus)

5. **Environment Variables**
   - Use ENV instructions appropriately
   - Never hardcode secrets
   - Document required environment variables

**Deliverables:**
- [ ] `frontend/Dockerfile`
- [ ] `backend/Dockerfile`
- [ ] `database/Dockerfile` (if custom) or documentation of official image usage
- [ ] `.dockerignore` files
- [ ] All images build successfully
- [ ] Optimized image sizes

---

### Task 3: Docker Compose

**Objective:** Create a docker-compose.yml for local development and testing.

#### Requirements:

1. **Define All Services**

2. **Network Configuration**
   - Create custom network(s)
   - Configure service-to-service communication
   - Use service names for DNS resolution

3. **Volume Configuration**
   - Database data persistence
   - Any other necessary volumes

4. **Environment Variables**
   - Use environment variables for configuration
   - Using .env file

5. **Service Dependencies**
   - Configure depends_on appropriately
   - Ensure correct startup order

6. **Port Mapping**
   - Map services to appropriate host ports
   - Document which ports are exposed

**Deliverables:**
- [ ] `docker-compose.yml` in root directory
- [ ] Application starts with `docker-compose up`
- [ ] All services communicate correctly
- [ ] Database data persists across restarts

---

### Task 4: Kubernetes Deployment

**Objective:** Deploy the application to Kubernetes with proper configuration.

#### Requirements:

1. **Create Kubernetes Manifests**

   Create YAML files for:

   **Deployments:**
   - [ ] Frontend Deployment
   - [ ] Backend Deployment
   - [ ] Database Deployment or StatefulSet

   **Services:**
   - [ ] Frontend Service (NodePort or LoadBalancer)
   - [ ] Backend Service (ClusterIP)
   - [ ] Database Service (ClusterIP)

   **ConfigMaps:**
   - [ ] Configuration data for services

   **Secrets:**
   - [ ] Database credentials
   - [ ] Any other sensitive data

   **PersistentVolumeClaims:**
   - [ ] Database storage

2. **Health Checks**
   - Configure liveness probes
   - Configure readiness probes
   - Use the provided health endpoints:
     - Backend: `/api/health` and `/api/ready`
     - Frontend: `/health` and `/ready`

3. **Resource Management**
   - Set resource requests
   - Set resource limits
   - Ensure reasonable values

4. **Labels & Selectors**
   - Use consistent labeling
   - Proper selector configuration

5. **Environment Configuration**
   - Use ConfigMaps for non-sensitive config
   - Use Secrets for sensitive data
   - Reference them correctly in Deployments

**Deliverables:**
- [ ] All required Kubernetes manifests
- [ ] Application deploys successfully to Kubernetes
- [ ] All services are accessible
- [ ] Health checks working
- [ ] Database data persists
- [ ] Necessary documentation 

---

### Task 5: CI/CD Pipeline

**Objective:** Create a GitHub Actions workflow for automated testing and building.

#### Requirements:

1. **Workflow Triggers**
   - Trigger on pull requests to main branch
   - Trigger on pushes to main branch

2. **Pipeline Stages**

   **Minimum Required:**
   - [ ] Checkout code
   - [ ] Run backend tests
   - [ ] Build Docker images
   - [ ] (Optional) Push images to registry

3. **Testing**
   - Run the provided Jest tests for backend
   - Pipeline should fail if tests fail

4. **Docker Image Building**
   - Build frontend Docker image
   - Build backend Docker image
   - (Bonus) Push to Docker Hub or GitHub Container Registry

5. **Workflow File**
   - Create `.github/workflows/ci.yml` (or similar name)
   - Use appropriate GitHub Actions
   - Include proper job dependencies

**Deliverables:**
- [ ] `.github/workflows/ci.yml`
- [ ] Workflow runs on PR
- [ ] Tests execute successfully
- [ ] Docker images build successfully
- [ ] (Bonus) Images pushed to registry

**Testing:**
- Create a pull request and verify workflow runs
- Check GitHub Actions tab for results

---

### Task 6: Documentation

**Objective:** Complete comprehensive documentation for your implementation.

#### Requirements:

1. **Complete README.md**
   - Fill in all TODO sections
   - Document all commands needed to run the application
   - Include troubleshooting section

3. **Environment Variables Documentation**
   - List all environment variables
   - Explain their purpose
   - Provide example values

4. **Deployment Instructions**
   - Step-by-step guide to deploy to Docker
   - Step-by-step guide to deploy to Kubernetes
   - Prerequisites clearly listed

**Deliverables:**
- [ ] Completed README.md
- [ ] Clear, professional documentation
- [ ] No TODO sections remaining

---

## Part 2: Oral Examination

After completing the practical tasks, you will have a 15-20 minute oral examination where you will:

### Topics Covered:

1. **Architecture Explanation (10 points)**
   - Explain your architecture choices
   - Describe how services communicate
   - Explain your containerization strategy

2. **Technical Deep Dive (10 points)**
   - Explain your Dockerfile choices
   - Explain Kubernetes resource configuration
   - Describe your CI/CD pipeline

3. **Troubleshooting & Problem Solving (10 points)**
   - Debug issues if something isn't working
   - Answer "what if" scenarios
   - Explain how you would handle specific problems

### Example Questions:

- "Why did you choose this base image for your Dockerfile?"
- "How do the frontend and backend communicate in Kubernetes?"
- "What happens if the database pod crashes?"
- "How would you scale the backend to handle more traffic?"
- "Walk me through what happens when you push code to main branch"
- "How are secrets managed in your Kubernetes deployment?"
- "What would you do if the health check keeps failing?"

---

## Evaluation Criteria

### Working DevOps Pipeline (40%)

- [ ] All Docker containers build and run
- [ ] Docker Compose brings up the full application
- [ ] Kubernetes deployment successful
- [ ] Application is accessible and functional
- [ ] Tests pass in CI/CD pipeline

### Process & Documentation (30%)

- [ ] Professional Git workflow
- [ ] Meaningful commits
- [ ] Branch protection configured
- [ ] Complete, clear documentation
- [ ] README helps others understand the project

### Oral Examination (30%)

- [ ] Can explain architecture decisions
- [ ] Understands DevOps concepts
- [ ] Can troubleshoot issues
- [ ] Demonstrates learning from course

---

## Submission Instructions

1. **Repository Submission**
   - Ensure all code is pushed to your GitHub repository
   - Submit repository URL via Canvas

2. **Submission Checklist**
   - [ ] All Dockerfiles created
   - [ ] docker-compose.yml working
   - [ ] All Kubernetes manifests created
   - [ ] CI/CD pipeline configured
   - [ ] Documentation completed
   - [ ] Repository access granted to instructors

3. **Deadline**
   - Code submission: 07/01/2026 23:59
   - Oral examination: 19/01/2026 or 20/01/2026

---

## Allowed Resources

During the exam, you MAY use:
- ✅ Your course notes
- ✅ Previous lab exercises

You may NOT:
- ❌ Copy entire solutions from others
- ❌ Share your solution with other students
- ❌ Collaborate with other students during the exam

---

## Getting Help

- I can help with exam requirements interpretation
- I cannot debug your code or configuration
- I cannot tell you if your solution is correct

**Technical issues** (e.g., GitHub access, local environment):
- Report immediately to instructors
- Document the issue and your attempted solutions

---

## Questions?

If you have questions about the exam 19-20/01/2026:
- Email: yorick.horrie@thomasmore.be
- Through Canvas

---

**Exam Version:** 1.0
**Last Updated:** November 2025
