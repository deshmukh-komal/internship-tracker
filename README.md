# 🚀 Internship Tracker with Gmail Automation

A  web application to manage and track internship applications with **automatic status detection using Gmail API**.

---

## 📌 Overview

This project helps students track their internship applications efficiently.
It allows users to manage applications, monitor progress, and automatically update statuses based on received emails.

---

## 🔥 Key Features

* 📋 Add, edit, and delete internship applications
* 📊 Dashboard with real-time statistics
* 📌 Kanban board (Applied → Interview → Offer → Rejected)
* 📩 Gmail integration for automatic status detection
* 🔄 Auto-update application status from emails
* 📈 Analytics using charts
* 🔐 User authentication (Login / Signup)

---

## 🛠️ Tech Stack

### 💻 Frontend

* HTML5
* CSS3
* JavaScript (Vanilla JS)

### ⚙️ Backend

* Node.js
* Express.js

### 🗄️ Database

* MySQL

### 🔗 API Integration

* Gmail API (Google APIs)
* OAuth 2.0 Authentication

### 📦 Libraries & Packages

* googleapis
* mysql / mysql2
* dotenv

### 🎨 UI & Visualization

* Chart.js
* Font Awesome

### 🛠️ Tools Used

* Visual Studio Code
* MySQL Workbench
* Git & GitHub
* Google Cloud Console

---

## 🧠 System Architecture

```text
Frontend (HTML/CSS/JS)
        ↓
Backend (Node.js + Express)
        ↓
MySQL Database
        ↓
Gmail API (Email Automation)
```

---

## ⚙️ How to Run the Project

### 🔹 1. Clone Repository

```bash
git clone https://github.com/your-username/internship-tracker.git
cd internship-tracker
```

---

### 🔹 2. Install Dependencies

```bash
npm install
```

---

### 🔹 3. Setup Environment Variables

Create `.env` file:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your password
DB_NAME=internship_db
```

---

### 🔹 4. Run Backend

```bash
node server.js
```

---

### 🔹 5. Run Frontend

Open `index.html` using Live Server or browser

---

## 📩 Gmail Automation Flow

1. System fetches latest emails using Gmail API
2. Detects keywords (Interview / Offer / Rejected)
3. Identifies company name
4. Updates correct application in database
5. Reflects changes in frontend automatically

---

## 🗂️ Database Design

* Users
* Companies
* Roles
* Status
* Applications (central table)
* Email Logs

✔ Normalized (3NF) database design
✔ Foreign key relationships implemented

---

## 📸 Screenshots (Add Here)

* Dashboard
* Kanban Board
* ER Diagram

---

## 🎯 Future Enhancements

* 🔍 AI-based company detection
* 🌐 Deployment (Cloud hosting)
* 📱 Mobile responsive UI
* 🔔 Real-time notifications

---

## 👩‍💻 Author

**Komal Deshmukh**

---

## ⭐ Conclusion

This project demonstrates a real-world full-stack application integrating:

* Web development
* Database design
* API integration
* Automation using Gmail

It improves efficiency in tracking internship applications and reduces manual effort.

---
