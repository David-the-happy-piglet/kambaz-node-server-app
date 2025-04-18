import express from "express";
import { v4 as uuidv4 } from "uuid";
import * as dao from "./dao.js";

const router = express.Router();

// Get all assignments
router.get("/assignments", async (req, res) => {
    try {
        const assignments = await dao.findAllAssignments();
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get assignments for a specific course
router.get("/courses/:courseId/assignments", async (req, res) => {
    try {
        const assignments = await dao.findAssignmentsForCourse(req.params.courseId);
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a specific assignment
router.get("/assignments/:assignmentId", async (req, res) => {
    try {
        const assignment = await dao.findAssignmentById(req.params.assignmentId);
        res.json(assignment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new assignment
router.post("/assignments", async (req, res) => {
    try {
        const assignment = await dao.createAssignment(req.body);
        res.json(assignment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update an assignment
router.put("/assignments/:assignmentId", async (req, res) => {
    try {
        const assignment = await dao.updateAssignment(req.params.assignmentId, req.body);
        res.json(assignment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete an assignment
router.delete("/assignments/:assignmentId", async (req, res) => {
    try {
        const status = await dao.deleteAssignment(req.params.assignmentId);
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;