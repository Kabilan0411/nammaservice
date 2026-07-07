# NammaService 🛠️

NammaService is a premium, modern web application designed to connect customers with elite, verified local service professionals (e.g., plumbers, electricians, AC mechanics, tutors, house cleaners) for instant booking and service scheduling. 

## Features 🚀

- **Verification Gate (Email OTP)**: Secure, verification-based signup and login flows utilizing Gmail SMTP.
- **Service Listings & Search**: Customers can search and filter verified professionals based on service categories, location, and rates.
- **Interactive Booking Widget**: Responsive scheduling interface with hourly billing calculations and notes.
- **Reviews & Ratings**: Integrated review feedback form with star ratings to gauge service quality.
- **Client & Partner Dashboard**: Dual-purpose panels displaying booking histories, saved bookmarks, notifications, earnings graphs, and profile options.
- **Cloudinary Image Uploads**: Profile photo attachments uploaded directly to Cloudinary and securely stored as URLs in MySQL.
- **Database Resilience**: Auto-connection to MySQL, with automatic fallback to a local SQLite database (`db.sqlite`) if MySQL is offline.

---

## Tech Stack 💻

### Backend
- **Framework**: Express.js (Node.js)
- **Database Engine**: MySQL / SQLite via Sequelize ORM
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs hashing
- **File Uploads**: Multer & Cloudinary SDK
- **Mailing**: Nodemailer (Gmail SMTP)

### Frontend
- **Library**: React.js (Vite)
- **Styling**: Bootstrap 5 & Custom CSS / HSL Theme Tokens
- **Icons**: React Icons
- **HTTP Client**: Axios

---

## Environment Variables Configuration 🔐

Create a `.env` file inside the `backend/` folder and populate it based on the following template (see `backend/.env.example`):

```ini
# Environment
NODE_ENV=development
PORT=5000

# Database
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=nammaservice

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Cloudinary Setup
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Gmail SMTP Setup (App Password Required)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# Client URL
FRONTEND_URL=http://localhost:5173
```

---

## Getting Started ⚙️

### Prerequisites
- Node.js (version 18 or higher recommended)
- MySQL / XAMPP (Optional, database defaults to local SQLite if offline)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Kabilan0411/nammaservice.git
   cd nammaservice
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

---

## Running the Project Locally ⚡

### 1. Launch the Backend Server
From the `backend/` folder:
```bash
npm run dev
```
The server will boot and run on `http://localhost:5000`.

### 2. Launch the Frontend Dev Server
From the `frontend/` folder:
```bash
npm run dev
```
The development app will compile and load on `http://localhost:5173` (or fallback to `http://localhost:5174` if port 5173 is occupied).

---

## License 📄
Distributed under the ISC License. See `package.json` for details.
