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


