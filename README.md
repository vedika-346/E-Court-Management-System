# ⚖️ E-Court Management System

A full-stack web application built using the **MERN stack** to digitize and simplify court case management, hearing scheduling, and evidence handling.

## Project Overview

The E-Court Management System is an educational web application designed to provide a centralized platform for managing court-related activities.

It enables citizens, lawyers, judges, and administrators to interact with court case records through role-specific interfaces.

The application supports case registration, case status tracking, hearing assignments, and document management.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, JavaScript, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | bcryptjs, JSON Web Tokens (JWT) |
| API Communication | Axios |
| File Uploads | Multer |

## Key Features

### User Authentication
- User registration and login
- Password hashing using bcryptjs
- JWT token generation
- Four selectable user roles: Admin, Judge, Lawyer, and Citizen

### Case Management
- Register new court cases
- View case details and current status
- Track cases through Pending, Hearing, and Closed stages
- Filter cases by status

### Hearing Management
- Assign judges and lawyers to cases
- Schedule hearing dates
- Update case status

### Evidence Management
- Upload evidence documents
- View uploaded document links
- Delete uploaded evidence
- Store evidence metadata in MongoDB

### Dashboard
- Total case count
- Pending cases
- Cases in hearing
- Closed cases
- Role-specific case views

## System Architecture

React.js Frontend  
↓ Axios HTTP Requests  
Node.js + Express.js Backend  
↓ Mongoose  
MongoDB Database

Uploaded documents are stored on the backend filesystem, while document metadata is associated with case records.

## Project Structure

```text
e-court-system/
├── backend/
│   ├── models/
│   │   ├── Case.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── caseRoutes.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.js
│   │   └── App.css
│   └── package.json
└── .gitignore
```

## Installation and Setup

### Prerequisites
- Node.js and npm
- MongoDB running locally
- Git

### Clone the Repository

```bash
git clone https://github.com/vedika-346/E-Court-Management-System.git
cd E-Court-Management-System
```

### Start the Backend

```bash
cd backend
npm install
node server.js
```

Backend URL: `http://localhost:5000`

Ensure MongoDB is running locally on port `27017`.

### Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm start
```

The React development server typically opens at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /auth/register | Register a user |
| POST | /auth/login | Login |
| POST | /cases/add | Create a case |
| GET | /cases | Retrieve cases |
| PUT | /cases/:id | Update a case |
| PUT | /cases/:id/upload-evidence | Upload a document |
| DELETE | /cases/:caseId/delete-evidence/:index | Delete a document |

## Future Improvements

- Server-side authentication and role-based authorization
- Secure document storage and access control
- Improved validation and error handling
- Email notifications for hearing updates
- Advanced case search and filtering
- Deployment to a cloud hosting platform

## Project Status

**Educational prototype — under development.**

This project demonstrates full-stack development concepts and is not intended for real court operations or storage of confidential legal documents.

## Author

GitHub: [vedika-346](https://github.com/vedika-346)
