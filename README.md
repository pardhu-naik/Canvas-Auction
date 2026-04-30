# Art Gallery & Auction Platform (MERN)

A professional, secure, and real-time art marketplace and auction system built with React, Node.js, and Socket.io.

## Features

- **Real-time Bidding**: Instant bid updates without page refreshes using Socket.io.
- **Secure Authentication**: JWT-based auth with HTTP-only cookies and bcrypt hashing.
- **Advanced Security**: CSRF protection (csurf), Helmet, CORS, and Express Rate Limit.
- **Premium UI**: Modern Glassmorphism design with Framer Motion animations and Dark Mode support.
- **Artist Marketplace**: Artists can upload and manage their artworks.
- **Live Auctions**: Dynamic countdown timers and highest bid tracking.
- **Responsive Design**: Fully optimized for mobile and desktop.

## Tech Stack

- **Frontend**: React.js, Vite, Axios, Socket.io Client, Framer Motion, React Icons.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, Socket.io, JWT, Cloudinary, Stripe.

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB Atlas account
- Cloudinary account (for image uploads)
- Stripe account (for payments)

### Setup

1. **Clone the repository**
2. **Backend Setup**
   - `cd backend`
   - `npm install`
   - Create a `.env` file with your credentials (see `.env.example`)
   - `npm start` (or `npm run dev` with nodemon)
3. **Frontend Setup**
   - `cd frontend`
   - `npm install`
   - Create a `.env` file with `VITE_API_URL=http://localhost:5000/api`
   - `npm run dev`

## Deployment

- **Frontend**: Ready for deployment on **Netlify** (includes `netlify.toml`).
- **Backend**: Ready for deployment on **Render**, **Railway**, or **AWS**.
