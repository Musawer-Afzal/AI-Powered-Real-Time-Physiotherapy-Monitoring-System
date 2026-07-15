# AI Physiotherapy Assistant

An AI-powered web-based physiotherapy rehabilitation system that provides real-time exercise monitoring, posture analysis, repetition counting, and therapist-assisted rehabilitation using computer vision.

The system leverages MediaPipe Pose Estimation to track human body landmarks, calculate joint angles, evaluate exercise performance, and provide instant feedback while allowing therapists to monitor patient progress through a secure role-based platform.

---

## Features

### Patient Portal

* Secure JWT authentication
* Patient profile management
* Exercise categorization

  * Upper Body
  * Mid Body
  * Lower Body
* Real-time pose estimation using MediaPipe
* Automatic joint angle calculation
* Live repetition counting
* Good repetition evaluation
* Form score estimation
* Session timer
* Session history
* Progress tracking

### Therapist Portal

* Secure therapist login
* Therapist approval workflow
* View assigned patients
* Review patient exercise sessions
* Monitor rehabilitation progress
* Add therapist notes
* Manage patient information

### Admin Portal

* Dashboard with system statistics
* Therapist approval requests
* User management
* Search users
* Filter users by role
* Enable or disable users
* Delete users
* Pagination support

---

# Project Architecture

```
React + Vite
        │
        │ REST API
        ▼
FastAPI Backend
        │
        ├──────── JWT Authentication
        ├──────── Role Based Access Control
        ├──────── Session Management
        ├──────── Exercise APIs
        ├──────── Patient APIs
        ├──────── Therapist APIs
        └──────── Admin APIs
                 │
                 ▼
          PostgreSQL Database
```

Real-time pose estimation is performed entirely on the client using MediaPipe.

The frontend computes body landmarks and joint angles, while the backend manages authentication, users, patient records, exercise sessions, and analytics.

---

# Tech Stack

## Frontend

* React
* Vite
* React Router
* Axios
* CSS
* Lucide Icons
* MediaPipe Pose

## Backend

* FastAPI
* SQLAlchemy
* Alembic
* Pydantic
* Python-JOSE (JWT)
* Passlib
* Uvicorn

## Database

* PostgreSQL

## AI / Computer Vision

* MediaPipe Pose
* Pose Landmark Detection
* Joint Angle Estimation
* Rule-based Exercise Analysis

---

# System Modules

## Authentication

* User Registration
* Login
* Password Hashing
* JWT Authentication
* Automatic Logout
* Protected Routes

---

## Role Based Access Control

Three system roles are implemented:

### Admin

* Approve therapists
* Manage users
* Delete users
* Disable users
* View dashboard statistics

### Therapist

* View assigned patients
* Monitor rehabilitation
* Review session history
* Manage patient records

### Patient

* Perform rehabilitation exercises
* View progress
* Track completed sessions

---

# Exercise Analysis Pipeline

```
Camera
      │
      ▼
MediaPipe Pose Detection
      │
      ▼
33 Body Landmarks
      │
      ▼
Joint Angle Calculation
      │
      ▼
Exercise Analyzer
      │
      ▼
State Machine
      │
      ▼
Rep Counting
      │
      ▼
Session Statistics
```

---

# Supported Exercises

## Upper Body

* Shoulder Abduction
* Shoulder Flexion
* Shoulder External Rotation
* Elbow Flexion

## Mid Body

* Pelvic Tilt
* Bridge
* Straight Leg Raise

## Lower Body

* Hip Abduction
* Knee Extension
* Mini Squat

---

# Pose Estimation

MediaPipe Pose detects 33 human body landmarks in real time.

The system calculates joint angles including:

* Shoulder
* Elbow
* Hip
* Knee
* Hip Abduction

Only the joints relevant to the currently selected exercise are used for repetition counting, reducing false positives while still displaying the complete skeleton for visual feedback.

---

# Joint Angle Calculation

Joint angles are calculated using three body landmarks.

For example:

```
Shoulder
      ●
      |
      |
      ● Elbow
       \
        \
         ● Wrist
```

The angle at the elbow is computed using the orientation of two vectors with the `atan2()` trigonometric function.

Hip abduction is calculated using the dot product between the torso vector and the leg vector.

---

# Exercise Analysis

Each exercise has its own configuration consisting of:

* Primary joint
* Target angle
* Optimal angle range
* Movement direction
* Difficulty
* Rehabilitation category

The analyzer follows a finite state machine:

```
Resting

↓

Moving

↓

Peak

↓

Returning

↓

Rep Completed
```

Only when the movement passes through every state correctly is a repetition counted.

---

# Good Repetition Evaluation

Every repetition is evaluated using:

* Peak Range of Motion
* Form Score

Final Quality Score

```
Rep Quality =
0.6 × Peak Score
+
0.4 × Form Score
```

If the quality score is at least 70%, the repetition is classified as a Good Rep.

---

# Session Tracking

Each exercise session records:

* Exercise performed
* Duration
* Total repetitions
* Good repetitions
* Form score
* Accuracy
* Completion time

Sessions are stored in PostgreSQL for long-term progress tracking.

---

# Database Design

Main entities include:

* Users
* Patients
* Therapists
* Exercise Sessions

Relationships:

```
User
 │
 ├── Patient
 │        │
 │        └── Exercise Sessions
 │
 └── Therapist
```

---

# Backend Features

* RESTful API
* Dependency Injection
* SQLAlchemy ORM
* Pydantic Validation
* Automatic Request Validation
* Password Hashing
* JWT Authentication
* Role Based Authorization
* Modular Service Layer

---

# Frontend Features

* Component-based architecture
* Context API
* Protected Routes
* Custom Hooks
* Real-time pose rendering
* Live exercise feedback
* Session controls
* Responsive interface

---

# Project Structure

```
frontend/
│
├── components/
├── contexts/
├── hooks/
├── pages/
├── services/
├── config/
├── styles/
└── App.jsx

backend/
│
├── app/
│   ├── api/
│   ├── core/
│   ├── database/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   └── utils/
│
├── alembic/
├── main.py
└── requirements.txt
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/ai-physiotherapy-assistant.git
cd ai-physiotherapy-assistant
```

---

## Backend Setup

```bash
cd backend

python -m venv venv

source venv/bin/activate
```

Windows

```bash
venv\Scripts\activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Configure environment variables

```
DATABASE_URL=
SECRET_KEY=
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Run migrations

```bash
alembic upgrade head
```

Start backend

```bash
uvicorn app.main:app --reload
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# API Documentation

FastAPI automatically generates interactive documentation.

Swagger UI

```
http://localhost:8000/docs
```

ReDoc

```
http://localhost:8000/redoc
```

---

# Future Improvements

* Deep learning based exercise quality assessment
* Multi-person pose estimation
* Exercise recommendation engine
* Therapist dashboard analytics
* Progress visualization
* Cloud deployment
* Mobile application
* Voice-guided rehabilitation
* Wearable sensor integration

---

# Learning Outcomes

This project demonstrates practical implementation of:

* Artificial Intelligence
* Computer Vision
* Pose Estimation
* Human Motion Analysis
* Full Stack Development
* FastAPI
* React
* PostgreSQL
* Authentication and Authorization
* REST API Development
* Software Architecture
* State Machine Design

---

# Acknowledgements

* Google MediaPipe
* FastAPI
* React
* PostgreSQL
* SQLAlchemy
* Open Source Community

---

# Author

**Musawer Afzal**

Bachelor of Computer Science

Final Year Project

AI-Powered Physiotherapy Rehabilitation System

GitHub: https://github.com/yourusername

LinkedIn: https://linkedin.com/in/yourprofile

---

# License

This project was developed as a Final Year Project for academic purposes.

It may be used for learning, research, and educational purposes with proper attribution.
