# 📚 Examlyx

**Examlyx** is a full‑stack online examination platform built with **Django (backend API)** and **React (frontend)**. It allows instructors to create and manage exams and students to take exams with real‑time evaluations.

---

## 🧠 Table of Contents

- [🚀 Project Overview](#🚀-project-overview)
- [✨ Features](#✨-features)
- [🛠️ Tech Stack](#🛠️-tech-stack)
- [📁 Project Structure](#📁-project-structure)
- [📥 Requirements](#📥-requirements)
- [⚙️ Installation (Local Dev)](#⚙️-installation-local-dev)
- [📌 Environment Setup](#📌-environment-setup)
- [📦 Running the App](#📦-running-the-app)
- [📊 API Endpoints](#📊-api-endpoints)
- [🧪 Testing](#🧪-testing)
- [🚀 Deployment](#🚀-deployment)
- [💡 Contributing](#💡-contributing)
- [📄 License](#📄-license)

---

## 🚀 Project Overview

Examlyx is designed to be an easy‑to‑use online examination system with a REST API backend in Django and a modern React frontend. Users can log in as instructors or students, create exams, schedule them, answer questions, and see results in real time.

---

## ✨ Features

- 🧑‍🏫 Instructor dashboard for creating and managing exams  
- 🧑‍🎓 Student interface for taking scheduled exams  
- 📄 Multiple question types  
- 🕒 Timer for exam sessions  
- 📊 Real‑time scoring and results

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Django + Django REST Framework |
| Frontend | React |
| Database | SQLite (default) / PostgreSQL (optional) |
| Deployment | Render / Netlify / Vercel |

---

## 📁 Project Structure

examlyx/
├── examlyx_backend/ # Django backend
│ ├── exam_module/ # Core exam logic
│ ├── accounts/ # Authentication + roles
│ ├── manage.py
│ └── requirements.txt
├── examlyx-frontend/ # React frontend
│ ├── public/
│ └── src/
├── .github/
│ └── workflows/ # CI/CD workflows
└── README.md


---

## 📥 Requirements

### Backend (Python)

- Python 3.9+
- pip

### Frontend (Node)

- Node.js 16+
- npm

---

## ⚙️ Installation (Local Dev)

### 🐍 Clone the Repo

```
git clone https://github.com/<your-username>/examlyx.git
cd examlyx

# Create & activate venv
python -m venv env
source env/bin/activate   # Linux / macOS
env\Scripts\activate      # Windows

# Install dependencies
pip install -r examlyx_backend/requirements.txt

cd examlyx-frontend
npm install

cd examlyx_backend
python manage.py migrate
python manage.py runserver

cd examlyx-frontend
npm start
```

