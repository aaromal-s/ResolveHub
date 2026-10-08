# ResolveHub: Complaint Management Portal

ResolveHub is a production-ready, full-stack web application designed to digitize, route, track, and resolve citizen grievances. It replaces manual paperwork with a centralized, transparent, and accountable digital system featuring automated department routing, real-time tracking timelines, and Service Level Agreement (SLA) alerts.

---

## 🛠️ Technology Stack

- **Frontend**: React (Vite), Tailwind CSS (SaaS theme), React Router DOM, Framer Motion (Transitions), Recharts (Analytics), React Icons, and Context-based session/toast states.
- **Backend**: Node.js, Express.js (REST API), JWT & bcrypt (Authentication), Multer (Local File Uploads), and Joi input validation.
- **Database**: MongoDB (Mongoose ODM).

---

## 📁 Project Structure

```
complaint-management-portal/
├── backend/                  # Express REST API Server
│   ├── src/
│   │   ├── config/           # Database config
│   │   ├── controllers/      # Route actions (Auth, Complaints, Depts, Reports)
│   │   ├── middleware/       # JWT auth, upload parser, error handler
│   │   ├── models/           # Mongoose schemas (User, Complaint, Dept, etc.)
│   │   ├── routes/           # Routing links
│   │   └── server.js         # Backend entrypoint
│   ├── .env                  # Port, JWT keys, and DB URIs
│   └── package.json
├── frontend/                 # React client built with Vite
│   ├── src/
│   │   ├── components/       # Layout widgets (Sidebar, Header, Protection Guards)
│   │   ├── context/          # State managers (Auth & Alerts)
│   │   ├── pages/            # Public & Protected views (Landing, Admin, Citizen)
│   │   ├── services/         # Axios/Fetch API wrapper client
│   │   ├── App.jsx           # Core Router configuration
│   │   ├── index.css         # Tailwind and Outfit Typography configurations
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── index.html            # Main markup template
│   └── package.json
├── package.json              # Monorepo task runner
└── README.md
```

---

## 🚀 Setup & Launch Instructions

All dependencies for both the frontend and backend have already been pre-installed in this workspace. Follow these steps to seed the database and launch the development servers.

### Prerequisites

Ensure you have **Node.js (v18+)** and a **MongoDB** database instance running locally at `mongodb://127.0.0.1:27017/complaint_management` (or configure a remote MongoDB Atlas URI in the `backend/.env` file).

### Step 1: Seed the Database

Before launching, populate the database with departments, user accounts (admin, citizen, officer), and sample tickets:

```bash
# From the root directory, run:
npm run seed
```

This clean-wipes and populates the database. If MongoDB is running correctly, you will see a success message in the console.

### Step 2: Launch Development Servers

Start both the backend API server (port 5000) and the frontend Vite server (port 5173) concurrently using:

```bash
# From the root directory, run:
npm run dev
```

Your browser will expose the application at: **`http://localhost:5173`**

---

## 🔑 Demo Access Credentials

Use the following pre-seeded credentials to explore the different dashboards:

| Account Role | Email Address | Password | Capability |
| :--- | :--- | :--- | :--- |
| **Citizen (Complainant)** | `aromal@gmail.com` | `UserPassword123` | File new complaints, upload files, track timeline, leave ratings. |
| **Super Admin** | `admin@portal.gov.in` | `AdminPassword123` | View analytics, assign departments, toggle user status. |
| **Electricity Officer** | `officer.power@portal.gov.in` | `OfficerPassword123` | Advance complaint status steps, add resolution notes. |

---

## 📈 SLA Priority Timelines

Resolved status deadlines are computed automatically based on the priority value assigned to the complaint:

- **Critical**: 24 Hours (Immediate safety threats)
- **High**: 3 Days (Major localized outages)
- **Medium**: 7 Days (Standard maintenance)
- **Low**: 14 Days (Cosmetic repairs)
