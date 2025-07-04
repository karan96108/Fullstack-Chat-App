import express from 'express';
import dotenv from 'dotenv';
import {connectDB} from './lib/db.js';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { app, server } from './lib/socket.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

// CORS configuration - allow all origins in production for now
app.use(cors({
    origin: true, // Allow all origins
    credentials: true,
}));

// Add error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Production static files
if (process.env.NODE_ENV === "production") {
  // Serve static files from the frontend dist directory
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // Use a regex to only match non-API routes
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// Start server
server.listen(PORT, () => {
    console.log("Server is running on PORT: " + PORT);
    console.log("Environment: " + (process.env.NODE_ENV || "development"));
    connectDB();
});