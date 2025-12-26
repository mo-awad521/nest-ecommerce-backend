---
🛍️ E-commerce Backend API (NestJS + TypeORM)
A robust, scalable, and fully-featured E-commerce backend built with NestJS, TypeORM, and MySQL. This project follows a Modular Architecture, ensuring clean code, maintainability, and high performance. It supports complete shopping workflows, secure authentication, and a powerful administrative dashboard.
---

🚀 Features

👤 User & Authentication

User registration & login with JWT.

Role-based authorization (Customer, Admin).

Manage multiple shipping addresses per user.

Password hashing with bcrypt.

📦 Product & Category Management

Full CRUD operations for products & categories.

Automatic slug generation for SEO-friendly URLs.

Multiple product images (Multer + Cloudinary).

Filtering, searching, and pagination.

Admin-only access for managing products.

🛒 Cart & Wishlist

Personal cart for each user (add, update, remove items).

Wishlist system to save favorite products.

📑 Orders & Workflow

Create orders directly from cart.

Track order lifecycle:

PENDING → PAID → SHIPPED → DELIVERED → COMPLETED

Support for CANCELED / RETURNED.

Order history per user.

💳 Payments

Payments linked to orders.

Track payment status:

PENDING, SUCCESS, FAILED, REFUNDED, DISPUTED.

Admin can view & filter payments.

🛠️ Admin Dashboard

User Management: View users, change roles, delete users.

Product Management: Add/edit/delete products & categories.

Order Management: Update order statuses.

Payments Management: View all payments by status.

Reports Dashboard:

Total users.

Total orders + breakdown by status.

Total revenue from successful payments.

Top-selling products.

---

🛠️ Tech Stack

Node.js + Nest.js

MySQL + TypeORM

JWT Authentication

Multer + Cloudinary (file uploads)

bcrypt (password hashing)

---

⚡ Getting Started

1. Clone repository

git clone https://github.com/mo-awad521/nest-ecommerce-backend
cd nest-ecommerce-backend

2. Install dependencies

```
npm install

```

3. Setup environment

Create .env file:

DATABASE_URL="mysql://user:password@localhost:3306/ecommerce"
JWT_SECRET="your_jwt_secret"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
FRONTEND_URL= Frontend_Url
EMAIL_USER=-----
EMAIL_PASS=----

4. Run server

```
npm run start:dev

```
