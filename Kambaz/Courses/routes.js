import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";
import express from 'express';

const router = express.Router();

router.post("/courses", async (req, res) => {
    const course = await dao.createCourse(req.body);
    const currentUser = req.session["currentUser"];
    if (currentUser) {
        await enrollmentsDao.enrollUserInCourse(currentUser._id, course._id);
    }
    res.json(course);
});

router.get("/courses", async (req, res) => {
    try {
        const courses = await dao.findAllCourses();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/courses/:courseId", async (req, res) => {
    try {
        const { courseId } = req.params;
        const status = await dao.deleteCourse(courseId);
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/courses/:courseId", async (req, res) => {
    try {
        const { courseId } = req.params;
        const courseUpdates = req.body;
        const status = await dao.updateCourse(courseId, courseUpdates);
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/courses/:courseId/modules", async (req, res) => {
    try {
        const { courseId } = req.params;
        const module = {
            ...req.body,
            course: courseId,
        };
        const newModule = await modulesDao.createModule(module);
        res.json(newModule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/courses/:courseId/modules", async (req, res) => {
    try {
        const { courseId } = req.params;
        const modules = await modulesDao.findModulesForCourse(courseId);
        res.json(modules);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/courses/:cid/users", async (req, res) => {
    try {
        const { cid } = req.params;
        const users = await enrollmentsDao.findUsersForCourse(cid);
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
