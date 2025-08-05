# Packaging Supply System

A comprehensive full-stack web application that connects customers with suppliers for packaging needs. Built with NestJS, Next.js, and PostgreSQL, it provides a robust platform for managing order requests and supplier interests.

## Architecture

### Backend (NestJS)

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT-based auth with role-based access control
- **API**: RESTful API with comprehensive endpoints

### Frontend (Next.js)

- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with custom components
- **State Management**: Redux Toolkit
- **UI Components**: Radix UI with custom styling
- **Form Handling**: React Hook Form with Zod validation

## Backend Setup

### Quick Start with Docker

### Prerequisites

- Docker and Docker Compose installed

1. Clone the repository:

   ```bash
   git clone https://github.com/ilhanozkan/packaging_supply_system.git
   cd packaging_supply_system
   ```

2. Start the backend services:

   ```bash
   cd backend
   docker-compose up -d
   ```

3. The backend will be available at `http://localhost:8080`
   - API endpoints: `http://localhost:8080/api/v1`
   - Database: PostgreSQL on port 5432 (in docker network)

### Docker Services

- **app**: NestJS backend application
- **db**: PostgreSQL database
- **volumes**: Persistent data storage

### Frontend Setup

1. Navigate to frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` in your browser

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login

### Order Requests

- `GET /api/v1/order-requests` - List all order requests
- `POST /api/v1/order-requests` - Create new order request
- `GET /api/v1/order-requests/my-orders` - Get user's orders
- `GET /api/v1/order-requests/:id` - Get specific order request

### Supplier Interests

- `POST /api/v1/supplier-interests` - Express interest/submit offer
- `GET /api/v1/supplier-interests/my-interests` - Get supplier's interests
- `GET /api/v1/supplier-interests/order-request/:id` - Get interests for order

### Product Types

- `GET /api/v1/product-types` - List active product types
- `GET /api/v1/product-types/all` - List all product types (admin)

### Admin Endpoints

- `GET /api/v1/admin/users` - List all users
- `GET /api/v1/admin/product-types` - List all product types

## User Roles

- **CUSTOMER**: Create order requests, view offers
- **SUPPLIER**: Browse orders, submit interests and offers
- **ADMIN**: Full system access and management

## Database Schema

- **Users**: Customer, supplier, and admin accounts
- **Order Requests**: Packaging requirements from customers
- **Order Items**: Specific products within an order
- **Supplier Interests**: Supplier responses and offers
- **Product Types**: Available packaging categories

### Environment Variables

Create `.env` files in both backend and frontend directories with appropriate configuration for your environment.

## License

This project is licensed under the MIT license.
