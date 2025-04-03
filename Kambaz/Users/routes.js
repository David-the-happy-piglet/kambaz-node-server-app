import express from "express";
import * as userDao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Authentication endpoints
router.post("/users/signin", (req, res) => {
    const { username, password } = req.body;
    const user = userDao.findUserByCredentials(username, password);
    if (!user) {
        res.status(401).json({ message: "Invalid username or password" });
        return;
    }
    req.session.user = user;
    res.json(user);
});

router.post("/users/signup", (req, res) => {
    const newUser = {
        _id: uuidv4(),
        ...req.body,
        courses: []
    };
    const createdUser = userDao.createUser(newUser);
    req.session.user = createdUser;
    res.json(createdUser);
});

router.post("/users/signout", (req, res) => {
    req.session.destroy();
    res.json({ message: "Signed out successfully" });
});

router.post("/users/profile", (req, res) => {
    if (!req.session.user) {
        res.status(401).json({ message: "Not authenticated" });
        return;
    }
    res.json(req.session.user);
});

// Get current user's courses
router.get("/users/current/courses", (req, res) => {
    if (!req.session.user) {
        res.status(401).json({ message: "Not authenticated" });
        return;
    }

    // If user is faculty, return all courses
    if (req.session.user.role === "FACULTY") {
        const courses = userDao.findAllCourses();
        res.json(courses);
    } else {
        // For students, return only enrolled courses
        const courses = userDao.findUserCourses(req.session.user._id);
        res.json(courses);
    }
});

// Create a course for the current user (faculty only)
router.post("/users/current/courses", (req, res) => {
    if (!req.session.user) {
        res.status(401).json({ message: "Not authenticated" });
        return;
    }

    if (req.session.user.role !== "FACULTY") {
        res.status(403).json({ message: "Only faculty can create courses" });
        return;
    }

    const newCourse = {
        _id: uuidv4(),
        ...req.body,
        faculty: req.session.user._id
    };

    const createdCourse = courseDao.createCourse(newCourse);
    res.json(createdCourse);
});

// Get all users
router.get("/users", (req, res) => {
    const users = userDao.findAllUsers();
    res.json(users);
});

// Get users by role
router.get("/users/role/:role", (req, res) => {
    const { role } = req.params;
    const users = userDao.findUsersByRole(role);
    res.json(users);
});

// Get users enrolled in a course
router.get("/courses/:cid/users", (req, res) => {
    const { cid } = req.params;
    const users = userDao.findUsersByCourse(cid);
    res.json(users);
});

// Get a specific user
router.get("/users/:uid", (req, res) => {
    const { uid } = req.params;
    const user = userDao.findUserById(uid);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.json(user);
});

// Create a new user (faculty only)
router.post("/users", (req, res) => {
    const newUser = {
        _id: uuidv4(),
        ...req.body,
        courses: []
    };
    const createdUser = userDao.createUser(newUser);
    res.json(createdUser);
});

// Update a user (faculty only)
router.put("/users/:uid", (req, res) => {
    const { uid } = req.params;
    const updatedUser = userDao.updateUser(uid, req.body);
    if (!updatedUser) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.json(updatedUser);
});

// Delete a user (faculty only)
router.delete("/users/:uid", (req, res) => {
    const { uid } = req.params;
    const success = userDao.deleteUser(uid);
    if (!success) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.json({ message: "User deleted successfully" });
});

// Enroll a user in a course
router.post("/users/:uid/courses/:cid/enroll", (req, res) => {
    const { uid, cid } = req.params;
    const updatedUser = userDao.enrollUserInCourse(uid, cid);
    if (!updatedUser) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.json(updatedUser);
});

// Unenroll a user from a course
router.post("/users/:uid/courses/:cid/unenroll", (req, res) => {
    const { uid, cid } = req.params;
    const updatedUser = userDao.unenrollUserFromCourse(uid, cid);
    if (!updatedUser) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.json(updatedUser);
});

export default router; 