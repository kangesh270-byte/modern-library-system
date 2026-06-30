# 📚 Modern Library System

A modern web-based library management system that simplifies book management, user authentication, and borrowing operations through an intuitive interface.

## 🚀 Features  

* 🔐 User Authentication & Authorization
* 👥 Admin & Member Roles
* 📖 Book Management System
* 🔄 Book Borrowing & Return Tracking
* 🛡️ JWT-Based Secure Authentication
* 🗄️ MongoDB Database Integration
* 📱 Responsive User Interface
* ⚡ RESTful API Architecture

## 🛠️ Tech Stack

* **Frontend:** React.js, Vite
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Authentication:** JWT

## 📂 Project Structure

```text 
modern-library-system/
├── backend/
├── frontend/
└── README.md
```

## ⚙️ Installation

```bash
git clone https://github.com/kangesh270-byte/modern-library-system.git
cd modern-library-system
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🔑 Environment Variables

Create a `.env` file inside the `backend` folder:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

## 👤 Default Credentials

**Admin**

* Email: [admin@library.com](mailto:admin@library.com)
* Password: admin123

**Member**

* Email: [member@library.com](mailto:member@library.com)
* Password: member123

## 🎯 Future Enhancements

* 📧 Email Verification
* 💰 Fine Management
* 📚 Book Reservation
* 🔳 QR Code Integration
* 📊 Analytics Dashboard
* 🔔 Notifications

## 📜 License

This project is developed for educational and learning purposes.

⭐ If you find this project useful, please consider giving it a star on GitHub.
