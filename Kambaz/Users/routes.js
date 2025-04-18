import express from "express";
import * as userDao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentDao from "../Enrollments/dao.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Controller functions
const findCoursesForUser = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
        res.sendStatus(401);
        return;
    }
    if (currentUser.role === "ADMIN") {
        const courses = await courseDao.findAllCourses();
        res.json(courses);
        return;
    }
    let { uid } = req.params;
    if (uid === "current") {
        uid = currentUser._id;
    }
    const courses = await enrollmentDao.findCoursesForUser(uid);
    res.json(courses);
};

const signin = async (req, res) => {
    const { username, password } = req.body;
    const user = await userDao.findUserByCredentials(username, password);
    if (!user) {
        res.status(401).json({ message: "Invalid username or password" });
        return;
    }
    req.session["currentUser"] = user;
    res.json(user);
};

const signup = async (req, res) => {
    const user = await userDao.findUserByUsername(req.body.username);
    if (user) {
        res.status(400).json({ message: "Username already taken" });
        return;
    }
    const newUser = {
        _id: uuidv4(),
        ...req.body,
        courses: []
    };
    const createdUser = await userDao.createUser(newUser);
    req.session["currentUser"] = createdUser;
    res.json(createdUser);
};

const signout = (req, res) => {
    req.session.destroy();
    res.json({ message: "Signed out successfully" });
};

const profile = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
        res.status(401).json({ message: "Not authenticated" });
        return;
    }
    res.json(currentUser);
};

const getCurrentUserCourses = async (req, res) => {
    if (!req.session.user) {
        res.status(401).json({ message: "Not authenticated" });
        return;
    }
    if (req.session.user.role === "FACULTY") {
        const courses = await courseDao.findAllCourses();
        res.json(courses);
    } else {
        const courses = await userDao.findUserCourses(req.session.user._id);
        res.json(courses);
    }
};

const createCourse = async (req, res) => {
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
    const createdCourse = await courseDao.createCourse(newCourse);
    res.json(createdCourse);
};

const findAllUsers = async (req, res) => {
    const { role, name } = req.query;
    if (role) {
        const users = await userDao.findUsersByRole(role);
        res.json(users);
        return;
    }

    if (name) {
        const users = await userDao.findUsersByPartialName(name);
        res.json(users);
        return;
    }

    const users = await userDao.findAllUsers();
    res.json(users);
};

const findUsersByCourse = async (req, res) => {
    const { cid } = req.params;
    const users = await userDao.findUsersByCourse(cid);
    res.json(users);
};

const findUserById = async (req, res) => {
    const { uid } = req.params;
    const user = await userDao.findUserById(uid);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.json(user);
};

const createUser = async (req, res) => {
    const user = await userDao.createUser(req.body);
    res.json(user);
};


const updateUser = async (req, res) => {
    const { uid } = req.params;
    const updatedUser = await userDao.updateUser(uid, req.body);
    if (!updatedUser) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.json(updatedUser);
};

/* const updateUser = async (req, res) => {
    const { uid } = req.params;
    const userUpdates = req.body;
    await userDao.updateUser(uid, userUpdates);
    const currentUser = req.session["currentUser"];
    if (currentUser && currentUser._id === uid) {
        req.session["currentUser"] = { ...currentUser, ...userUpdates };
    }
    res.json(currentUser);
}; */

const deleteUser = async (req, res) => {
    const { uid } = req.params;
    const success = await userDao.deleteUser(uid);
    if (!success) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.json({ message: "User deleted successfully" });
};

const enrollUserInCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
        const currentUser = req.session["currentUser"];
        uid = currentUser._id;
    }
    const status = await enrollmentDao.enrollUserInCourse(uid, cid);
    res.send(status);
};
const unenrollUserFromCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
        const currentUser = req.session["currentUser"];
        uid = currentUser._id;
    }
    const status = await enrollmentDao.unenrollUserFromCourse(uid, cid);
    res.send(status);
};

/* const enrollUserInCourse = async (req, res) => {
    const { uid, cid } = req.params;
    const updatedUser = await userDao.enrollUserInCourse(uid, cid);
    if (!updatedUser) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.json(updatedUser);
};

const unenrollUserFromCourse = async (req, res) => {
    const { uid, cid } = req.params;
    const updatedUser = await userDao.unenrollUserFromCourse(uid, cid);
    if (!updatedUser) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.json(updatedUser);
}; */

// Routes
router.post("/users/signin", signin);
router.post("/users/signup", signup);
router.post("/users/signout", signout);
router.post("/users/profile", profile);
router.get("/users/current/courses", getCurrentUserCourses);
router.post("/users/current/courses", createCourse);
router.get("/users", findAllUsers);
router.get("/courses/:cid/users", findUsersByCourse);
router.get("/users/:uid/courses", findCoursesForUser);
router.get("/users/:uid", findUserById);
router.post("/users", createUser);
router.put("/users/:uid", updateUser);
router.delete("/users/:uid", deleteUser);
router.post("/users/:uid/courses/:cid", enrollUserInCourse);
router.delete("/users/:uid/courses/:cid", unenrollUserFromCourse);

export default router; 