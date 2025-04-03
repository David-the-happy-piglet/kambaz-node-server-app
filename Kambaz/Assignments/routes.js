import express from "express";
import { v4 as uuidv4 } from "uuid";
import { findAllAssignments, findAssignmentById, findAssignmentsByCourse, createAssignment, updateAssignment, deleteAssignment } from "./dao.js";

const router = express.Router();

// Get all assignments
router.get("/assignments", (req, res) => {
    const assignments = findAllAssignments();
    res.json(assignments);
});

// Get assignments for a specific course
router.get("/courses/:cid/assignments", (req, res) => {
    const { cid } = req.params;
    const courseAssignments = findAssignmentsByCourse(cid);
    res.json(courseAssignments);
});

// Get a specific assignment
router.get("/assignments/:aid", (req, res) => {
    const { aid } = req.params;
    const assignment = findAssignmentById(aid);
    if (!assignment) {
        res.status(404).json({ message: "Assignment not found" });
        return;
    }
    res.json(assignment);
});

// Create a new assignment
router.post("/courses/:cid/assignments", (req, res) => {
    const { cid } = req.params;
    const newAssignment = {
        _id: uuidv4(),
        ...req.body,
        course: cid
    };
    const createdAssignment = createAssignment(newAssignment);
    res.json(createdAssignment);
});

// Update an assignment
router.put("/assignments/:aid", (req, res) => {
    const { aid } = req.params;
    const updatedAssignment = updateAssignment(aid, req.body);
    if (!updatedAssignment) {
        res.status(404).json({ message: "Assignment not found" });
        return;
    }
    res.json(updatedAssignment);
});

// Delete an assignment
router.delete("/assignments/:aid", (req, res) => {
    const { aid } = req.params;
    const success = deleteAssignment(aid);
    if (!success) {
        res.status(404).json({ message: "Assignment not found" });
        return;
    }
    res.json({ message: "Assignment deleted successfully" });
});

export default router;