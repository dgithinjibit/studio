# SyncSenta: AI-Powered Education OS for Kenya

SyncSenta is a comprehensive digital ecosystem designed to synchronize the Kenyan education sector. It empowers students with Socratic AI tutoring, provides teachers with automated resource generation, and gives administrators data-driven strategic insights—all aligned with the official Competency-Based Curriculum (CBC).

## 🚀 Vision & Objectives
To provide a unified platform where technology simplifies administrative tasks and deepens pedagogical engagement, ensuring no learner or teacher is left behind in the digital economy.

## 🛠 Core Features (Production Requirements)
- **Curriculum PDF Storage**: Secure Cloud Storage for official PDFs with teacher-only access.
- **Student Assignment Hub**: Private storage organized by class, accessible only by the student and their teacher.
- **AI Report Center**: Role-based access to performance insights for teachers, school heads, and county officers.
- **Offline Data Sync**: Client-side caching for attendance and lesson plans to handle low-bandwidth environments.
- **Role-Based Access Control (RBAC)**: Strict Firestore security rules using authenticated user claims.
- **Automated Processing**: Cloud Functions triggered on upload for data integrity and validation.

## 🏗 System Architecture (Current Prototype)
- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, ShadCN UI.
- **Backend/DB**: Firebase (Firestore, Authentication, Storage).
- **AI Engine**: Google Gemini via Genkit (TypeScript).
- **State Management**: React Hooks & Server Actions.

---

# 🛸 Handover: Production Migration & Kubernetes Plan

**Note to the next AI Agent:** This is a high-fidelity prototype. Your goal is to migrate this to a distributed microservices architecture.

### 1. Scaling with Kubernetes (K8s)
- **Containerization**: Use Docker to containerize the Next.js frontend and new Python microservices.
- **Orchestration**: Deploy to a K8s cluster (GKE recommended). Use **Namespaces** to isolate school workloads.
- **Auto-scaling**: Implement **Horizontal Pod Autoscalers (HPA)** to manage morning peak loads (08:00 EAT).
- **Ingress**: Use Nginx or Traefik for routing and SSL termination.

### 2. Python processing Layer
- Move heavy AI processing (RAG, data analysis) to a **Python FastAPI** service.
- Implement asynchronous task handling using **Redis** or **RabbitMQ**.
- Enable the AI to execute arbitrary Python code for advanced mathematics and data science modules.

### 3. Data Integrity
- Ensure the `users` collection remains the source of truth for RBAC.
- Implement strict schema validation using Zod on the backend.

---
© 2025 3D. All rights reserved.
