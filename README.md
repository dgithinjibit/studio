# SyncSenta: An AI-Powered Education OS for Kenya (BGI25 Hackathon)

This project, built for the BGI25 Hackathon, is a prototype of **SyncSenta**, an integrated operating system designed to synchronize the Kenyan education ecosystem. It uses curriculum-aware AI to connect students, teachers, and administrators, fostering critical thinking and streamlining educational workflows.

## Core Features

- **Socratic AI Tutor (`Mwalimu AI`):** A Genkit-powered chatbot grounded in the official KICD curriculum to guide students through learning via questions, not just answers.
- **Teacher Co-Pilot (`Teacher Tools`):** A suite of AI tools that automate the creation of CBE-aligned resources like Lesson Plans, Schemes of Work, and Worksheets.
- **Learning Lab:** A feature allowing teachers to create their own private AI tutors using their lesson notes as the sole knowledge base.
- **Role-Based Dashboards:** Tailored interfaces for Teachers, School Heads, and County Officers, providing relevant tools and data insights.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Seeding Initial Data (Required)

To use the **Teacher Dashboard** and other features, you must first seed the Firestore database with mock data.

1.  Make sure your application is running (`npm run dev`).
2.  Visit the following URL in your browser:
    [http://localhost:3000/api/seed](http://localhost:3000/api/seed)

This will populate the necessary data for a mock teacher (`usr_3`). After seeding, you can sign up as a **Teacher** to see the dashboard in action, or sign up as a **Student** to begin the learning journey.
