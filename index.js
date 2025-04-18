import express from 'express';
import mongoose from "mongoose";
import Hello from './Hello.js';
import Lab5 from './Lab5/index.js';
import UserRoutes from "./Kambaz/Users/routes.js";
import cors from "cors";
import session from "express-session";
import "dotenv/config";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModuleRoutes from "./Kambaz/Modules/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";
import EnrollmentRoutes from "./Kambaz/Enrollments/routes.js";
import GradeRoutes from "./Kambaz/Grades/routes.js";

const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kanbas"
mongoose.connect(CONNECTION_STRING);
mongoose.connect(CONNECTION_STRING);
const app = express();

// Configure CORS first
app.use(cors({
    credentials: true,
    origin: process.env.NETLIFY_URL || "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Configure session
const sessionOptions = {
    secret: process.env.SESSION_SECRET || "kambaz",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV !== "development",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
};

if (process.env.NODE_ENV !== "development") {
    sessionOptions.proxy = true;
    sessionOptions.cookie = {
        ...sessionOptions.cookie,
        sameSite: "none",
        domain: process.env.NODE_SERVER_DOMAIN,
    };
}

// Add security headers
app.use((req, res, next) => {
    res.header('Content-Security-Policy', "default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;");
    next();
});

// Apply middleware
app.use(express.json());
app.use(session(sessionOptions));

// Routes
app.use('/api', CourseRoutes);
app.use('/api', ModuleRoutes);
app.use('/api', UserRoutes);
app.use('/api', AssignmentRoutes);
app.use('/api', EnrollmentRoutes);
app.use('/api', GradeRoutes);

console.log("app type:", typeof app);
console.log("app.get type:", typeof app.get);
Hello(app);
Lab5(app);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
