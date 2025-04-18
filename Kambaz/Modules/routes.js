import * as modulesDao from "./dao.js";
import express from 'express';

const router = express.Router();

router.get("/courses/:courseId/modules", async (req, res) => {
    try {
        const { courseId } = req.params;
        const modules = await modulesDao.findModulesForCourse(courseId);
        res.json(modules);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/modules/:moduleId", async (req, res) => {
    try {
        const { moduleId } = req.params;
        const status = await modulesDao.deleteModule(moduleId);
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/modules/:moduleId", async (req, res) => {
    try {
        const { moduleId } = req.params;
        const moduleUpdates = req.body;
        const status = await modulesDao.updateModule(moduleId, moduleUpdates);
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;

