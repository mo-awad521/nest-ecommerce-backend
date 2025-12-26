🛍️ E-commerce Backend API (NestJS + TypeORM)
A robust, scalable, and fully-featured E-commerce backend built with NestJS, TypeORM, and MySQL. This project follows a Modular Architecture, ensuring clean code, maintainability, and high performance. It supports complete shopping workflows, secure authentication, and a powerful administrative dashboard.

🚀 Features
👤 User Management & Security
JWT Authentication: Secure login and registration using Passport.js and JWT strategies.

RBAC (Role-Based Access Control): Granular access control for Customer and Admin roles via NestJS Guards.

Address Management: Support for multiple shipping addresses per user.

Password Security: Industry-standard hashing using bcrypt.

📦 Product & Catalog Management
Full CRUD: Complete management for products and categories.

SEO Optimization: Automatic slug generation for search-engine-friendly URLs.

Media Handling: Integrated file uploads (Multer) with Cloudinary for cloud-based image storage.

Advanced Querying: Built-in support for searching, filtering by category/price, and pagination.

🛒 Shopping Experience
Personal Cart: Manage cart items (add, update quantity, remove) linked to the user session.

Wishlist System: Allow users to save their favorite products for later.

📑 Order Workflow & Lifecycle
Order Creation: Seamless transition from shopping cart to checkout.

Status Tracking: Comprehensive lifecycle management: PENDING → PAID → SHIPPED → DELIVERED → COMPLETED

Cancellations & Returns: Built-in logic for CANCELED and RETURNED statuses.

Order History: Users can view their past orders and current statuses.

🛠️ Admin Dashboard & Analytics
User & Role Management: View all users, modify roles, or deactivate accounts.

Global Order Control: Update order statuses and manage global sales.

Reporting:

Total User Count.

Total Revenue calculation from successful payments.

Order breakdown by status.

Top-selling products analytics.

🛠️ Tech Stack
Framework: NestJS (Node.js)

Database: MySQL

ORM: TypeORM

Language: TypeScript

Auth: Passport.js & JWT

File Storage: Cloudinary

Validation: Class-validator & Class-transformer

📂 Project Structure
Plaintext

src/
├── modules/
│ ├── auth/ # Login, Signup, and JWT Strategies
│ ├── users/ # User profiles and Address Entities
│ ├── products/ # Product & Category management
│ ├── cart/ # Shopping cart business logic
│ ├── orders/ # Order processing and status management
│ ├── payments/ # Payment tracking and integration
│ └── admin/ # Statistics and administrative reports
├── common/ # Global Guards, Interceptors, and Middlewares
├── config/ # Configuration for DB, JWT, and Cloudinary
├── database/ # TypeORM Entities and Migrations
└── main.ts # Application entry point
⚡ Getting Started

1. Clone the Repository
   Bash

git clone https://github.com/mo-awad521/nest-ecommerce-backend
cd nest-ecommerce-backend Install Dependencies
Bash

Environment Setup
Create a .env file in the root directory and configure your variables:

# Database Configuration

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=ecommerce_db

# Security

JWT_SECRET=your_super_secret_key

# Cloudinary (Optional for Image Uploads)

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret 4. Database Migrations
Generate and run migrations to set up your MySQL schema:

Bash

npm run typeorm migration:run 5. Run the Application
Bash

# Development mode

npm run start:dev

# Production mode

npm run start:prod
📊 Example Admin Report Response
JSON

{
"users": { "total": 35 },
"orders": {
"total": 120,
"byStatus": [
{ "status": "PENDING", "count": 20 },
{ "status": "DELIVERED", "count": 70 }
]
},
"sales": {
"totalRevenue": "15500.00"
},
"topProducts": [
{ "id": 1, "title": "iPhone 15", "totalSold": 25 }
]
}
📌 Author
👤 Mohammad Alawad

GitHub: @mo-awad521
