# SynergyLearn: The Next-Generation University Management System

Welcome to the SynergyLearn monorepo. This project is an ambitious initiative to build a comprehensive, modern, and highly performant digital campus. It combines a full-featured University Management System (UMS) with a dynamic Learning Management System (LMS) and a marketplace for course creators.

This document serves as the central guide for setting up, running, and understanding the architecture of the entire project.

## Table of Contents
1. [Core Philosophy](#core-philosophy)
2. [Tech Stack](#tech-stack)
3. [Monorepo Structure](#monorepo-structure)
4. [Getting Started: A Step-by-Step Setup Guide](#getting-started-a-step-by-step-setup-guide)
5. [Running the Project for Development](#running-the-project-for-development)
6. [Key Architectural Decisions](#key-architectural-decisions)
7. [Troubleshooting the Setup Process](#troubleshooting-the-setup-process)

---

## 1. Core Philosophy

SynergyLearn is built on four key principles:
*   **Unified Experience:** All user-facing interactions, from a prospective student applying to a faculty member managing a course, should feel like they are part of a single, cohesive system—the "UI Marvel" concept.
*   **Extreme Modularity:** The system is composed of independent applications and shared packages. This allows for scalability, independent development, and easier maintenance.
*   **Performance First:** The application must be fast, responsive, and efficient, from API response times to frontend rendering.
*   **Developer Experience:** A clean, modern, and well-documented codebase makes development faster, more enjoyable, and less prone to errors.

---

## 2. Tech Stack

This project uses a modern, TypeScript-first tech stack.

*   **Monorepo Management:** [pnpm](https://pnpm.io/) + [Turborepo](https://turbo.build/repo)
*   **Backend (`apps/api`):**
    *   **Runtime:** Node.js
    *   **Framework:** Express.js
    *   **Database:** PostgreSQL
    *   **ORM:** Prisma
    *   **Security:** JWT for authentication, bcrypt for hashing
    *   **Validation:** Zod
*   **Frontend (`apps/portal`, `studio`, `admin`):**
    *   **Framework:** Next.js (with App Router)
    *   **Language:** TypeScript
    *   **Styling:** Tailwind CSS
    *   **State Management:** Zustand
    *   **Data Fetching:** TanStack Query (React Query)
    *   **Animation:** Framer Motion
    *   **3D/Labs:** Three.js / @react-three/fiber
*   **Shared Packages:**
    *   `packages/ui`: Shared React components
    *   `packages/db`: Prisma schema and client
    *   `packages/types`: Shared Zod schemas and TS types

---

## 3. Monorepo Structure

The project is organized into `apps` (deployable applications) and `packages` (shared code).
Use code with caution.
Markdown
synergylearn/
├── apps/
│ ├── api/ # The Backend API (Node.js/Express)
│ ├── admin/ # The UMS Admin Frontend (Next.js)
│ ├── portal/ # The Public & Student Frontend (Next.js)
│ └── studio/ # The Creator & Faculty Frontend (Next.js)
│
├── packages/
│ ├── db/ # Prisma schema, client, and migrations
│ ├── types/ # Shared types and validation logic (Zod)
│ ├── ui/ # Shared React component library ("UI Marvel")
│ └── ... # Other shared configs (ESLint, etc.)
│
├── pnpm-workspace.yaml # Defines the monorepo structure for pnpm
├── package.json # The root package configuration
└── turbo.json # Turborepo pipeline configuration
---

## 4. Getting Started: A Step-by-Step Setup Guide

This guide details the entire process of setting up the project from a fresh clone, including the critical database setup.

### **Prerequisites**
- [Node.js](https://nodejs.org/) (v18 or newer)
- [pnpm](https://pnpm.io/installation) (run `npm install -g pnpm` to install)
- [PostgreSQL](https://www.postgresql.org/download/) installed and running locally.

### **Step 1: Install Dependencies**
After cloning the repository, navigate to the root directory and install all dependencies for every app and package with a single command.

pnpm install

Step 2: Database and User Setup
This was a critical and challenging part of the initial setup. 
The following steps ensure a clean, permission-error-free 
environment.
Log in to PostgreSQL as a superuser (the default user is often 
postgres):
psql -U postgres

(You may be prompted for your superuser password if one is set).
Create the Database and User. We will create a dedicated user 
and database. Using underscores (_) instead of hyphens (-) in 
the database name is crucial to avoid SQL syntax errors.
Inside the psql prompt, run the following SQL commands one by 
one:
-- 1. Create the user with a password. It's vital to change 
'your_secure_password'!
CREATE USER synergylearn_user WITH PASSWORD 
'your_secure_password';

-- 2. Create the database and assign ownership to our new user.
CREATE DATABASE university_management_system OWNER 
synergylearn_user;

-- 3. Grant the user the ability to create databases. This is 
REQUIRED by `prisma migrate dev`.
ALTER USER synergylearn_user CREATEDB;

If you prefer a passwordless setup for local development, you 
can omit the WITH PASSWORD clause and ensure your pg_hba.conf 
is set to trust or peer for local connections.
Exit psql:
\q

Step 3: Configure Environment Variables
Navigate to apps/api/ in your code editor.
Create a file named .env if it doesn't already exist.
Add the DATABASE_URL variable to this file, matching the 
credentials you just created.
Example:
DATABASE_URL="postgresql://
synergylearn_user:your_secure_password@localhost:5432/
university_management_system?schema=public"

Step 4: Run the Database Migration
This final setup step applies our comprehensive Prisma schema 
to the database, creating all the tables, relations, and 
indexes.
From the root directory of the project, run:
pnpm --filter api prisma migrate dev

You will be prompted to give the migration a name. Something 
like initial_schema is a good choice. After this completes, 
your entire project is fully set up.
5. Running the Project for Development
To ensure stability and prevent system resource exhaustion, we 
run services in separate terminals. This is the recommended and 
most stable workflow.
Terminal 1: Start the Backend API
The API must always be running. In your project root, run:
pnpm dev:api

Terminal 2: Start a Frontend Application
In a new terminal (also in the project root), choose the 
frontend you want to work on.
# To work on the public and student portal (localhost:3000)
pnpm dev:portal

# To work on the creator/faculty studio (localhost:3001)
pnpm dev:studio

# To work on the UMS admin panel (localhost:3002)
pnpm dev:admin

6. Key Architectural Decisions
Monorepo: Chosen for code sharing (ui, types), unified tooling 
(pnpm, eslint), and simpler dependency management across 
multiple applications.
pnpm: Used over npm/yarn for its superior performance and disk 
space efficiency via a content-addressable store, which is 
critical in large monorepos.
Turborepo: Used for intelligent task orchestration (build, 
lint), where its caching provides significant speed 
improvements on subsequent runs.
Separate dev Scripts: The generic pnpm dev command that ran 
everything in parallel was abandoned. It proved unstable and 
resource-intensive on some systems. Explicit dev:* scripts for 
each service provide developers with full control and guarantee 
a stable, resource-friendly local environment.
Database User Permissions: The CREATEDB privilege was 
discovered to be a mandatory requirement for the Prisma 
development workflow (prisma migrate dev), as Prisma's engine 
may attempt to create a shadow database or ensure it has 
creation rights before proceeding.
7. Troubleshooting the Setup Process
The initial setup of this project encountered several common 
but critical configuration issues. This section documents the 
errors and their definitive solutions to aid future developers.
Error 1: recursive_turbo_invocations Loop
Symptom: Running a generic dev script in the root package.json 
immediately fails with an error message stating Your package.
json script looks like it invokes a Root Task.
Cause: The root package.json had a script like "dev": "turbo 
dev". This creates an infinite loop where Turbo tries to run a 
task that calls itself.
Solution: Do not use a generic dev script in the root package.
json to run other dev scripts. Instead, create explicit, 
separate scripts for each service (e.g., dev:api, dev:portal) 
that use the --filter flag to target specific workspaces, as 
outlined in the "Running the Project" section.
Error 2: None of the selected packages has a "prisma" script
Symptom: Running pnpm --filter api prisma ... fails because the 
script "prisma" is not found in the api workspace.
Cause: When running a command from the root via --filter, pnpm 
looks for a script defined in the target workspace's package.
json. It doesn't automatically find the executable in 
node_modules.
Solution: Add a "catch-all" proxy script to the target 
workspace's package.json (apps/api/package.json in this case):
"scripts": {
  "prisma": "prisma",
  "..."
}

Error 3: CLI Termination or stdin is not a tty
Symptom: Scripts that automate psql commands crash the MINGW64 
terminal on Windows.
Cause: The psql client on Windows often requires an interactive 
session. Piping commands non-interactively via a script can 
fail. More importantly, attempting to run all four Node.js 
development servers in parallel can exhaust system resources 
and lead to a crash.
Solution: Abandon complex setup automation scripts. Perform 
database setup with simple, direct psql commands in an 
interactive terminal. For local development, run services in 
separate terminals instead of all at once. This guarantees 
stability.
Error 4: PostgreSQL permission denied to create database
Symptom: prisma migrate dev fails with a PostgreSQL permission 
error, even when the user owns the target database.
Cause: The prisma migrate dev command's workflow includes a 
check that requires the database user to have permission to 
create databases in general, not just write to the existing one.
Solution: Explicitly grant the CREATEDB privilege to your 
development user via a superuser account: ALTER USER 
your_user_name CREATEDB;. This satisfies the Prisma engine's 
requirement and allows the migration to proceed.