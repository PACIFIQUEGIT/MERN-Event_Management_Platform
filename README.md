# 🎟️ MERN-Event_Management_Platform

A full-stack web application for browsing, managing, and booking tickets for events. Built with the MERN stack (MongoDB, Express, React, Node.js), it supports both user and admin roles, secure authentication, and real-time ticket management.

---

## 🔧 Features

### 🧑‍💼 For Users
- View upcoming events
- Book tickets (with availability check)
- View and cancel personal bookings
- Secure login and signup

### 🛠️ For Admins
- Create, edit, and delete events
- View all bookings
- Cancel any booking
- Protected admin routes

---

## 🗂️ Project Structure


├── frontend/ # React frontend
│ ├── public/ 
│ └──src/
│    ├── components/
│    ├── contexts/
│    ├── pages/
│    ├── .env
│    ├── package-lock.json
│    ├── package.json
│    ├── App.jsx
│    └── index.js
├── backend/ # Node.js backend
│ ├── node_modules/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── .env
│ ├── package-lock.json
│ ├── package.json
│ ├── seedAdmin.js
│ ├── app.js
│ └── server.js
└── README.md


---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/PACIFIQUEGIT/MERN-Event_Management_Platform.git
cd MERN-Event_Management_Platform.git

🖥️ Backend Setup (Express + MongoDB)
2. Install Dependencies

cd server
npm install

3. Set Up Environment Variables
Create a .env file in the server directory:

PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

4. Start the Server

npm run dev

🌐 Frontend Setup (React)
5. Install Frontend Dependencies

cd client
npm install

6. Create React Environment File
Create .env in client:

REACT_APP_API_BASE_URL=http://localhost:4000/api

7. Start the Client
npm start

🔐 Authentication & Roles
JWT-based authentication

Role-based access for admin and regular users

Protected routes using middleware

📦 API Endpoints
Events
GET /api/events - List all events

POST /api/events - Create event (admin)

GET /api/events/:id - Get event by ID

PUT /api/events/:id - Update event (admin)

DELETE /api/events/:id - Delete event (admin)

Bookings
POST /api/bookings - Book tickets (user)

GET /api/bookings - Get user's bookings

GET /api/bookings/:id - Get specific booking (admin)

DELETE /api/bookings/:id - Cancel user's booking

GET /api/admin/bookings - Get all bookings (admin)

Auth
POST /api/auth/register - Register

POST /api/auth/login - Login

## 🌱 Seeding an Admin User

To create an admin user for testing or initial setup:

1. Run the seed script
Make sure your MongoDB server is running, and then run:

node seedAdmin.js

You should see:

MongoDB connected
Admin user created

Now you can log in with:

Email: admin@example.com

Password: admin123

💡 You can customize the email/password as needed in the script.

