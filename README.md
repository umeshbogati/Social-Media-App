# Social Media App

A modern, full-stack social media application built with a React frontend and an Express/Node.js backend. The platform allows users to sign up, create posts, interact with others through likes and comments, and manage their personal profiles.

## ✨ Features

- **User Authentication**: Secure registration and login flows.
- **Profile Management**: View and edit user profiles (Name, Username, Profile Picture).
- **Social Feed**: Browse posts from users on the platform.
- **Post Interactions**: Create new posts, like posts, and add comments.
- **Modern UI/UX**: Beautifully designed responsive interface utilizing Material-UI and modern design principles.

## 💻 Tech Stack

### Frontend
- **Framework**: React (Bootstrapped with Vite)
- **Language**: TypeScript
- **Styling/UI**: Material-UI (MUI), Emotion
- **Routing**: React Router DOM
- **State Management**: React Context API & React Hooks

### Backend
- **Environment**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (via Mongoose)
- **Validation**: Zod
- **Authentication**: JWT (JSON Web Tokens)

## 📁 Project Structure

```
Social-Media/
├── backend/       # Node.js/Express server and API routes
└── forntend/      # React frontend application
```

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Running locally or a MongoDB Atlas URI)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the `backend` directory.
   - Add your MongoDB connection string and JWT secret (e.g., `MONGO_URI`, `JWT_SECRET`, `PORT=5000`).
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd forntend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173` or `http://localhost:5174`).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
