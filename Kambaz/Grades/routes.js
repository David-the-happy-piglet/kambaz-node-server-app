import express from "express";
import { v4 as uuidv4 } from "uuid";
import * as gradeDao from "./dao.js";

const router = express.Router();

// Get all grades
router.get("/grades", (req, res) => {
    const grades = gradeDao.findAllGrades();
    res.json(grades);
});

// Get grades for a specific student
router.get("/students/:sid/grades", (req, res) => {
    const { sid } = req.params;
    const studentGrades = gradeDao.findGradesByStudent(sid);
    res.json(studentGrades);
});

// Get grades for a specific assignment
router.get("/assignments/:aid/grades", (req, res) => {
    const { aid } = req.params;
    const assignmentGrades = gradeDao.findGradesByAssignment(aid);
    res.json(assignmentGrades);
});

// Get a specific grade
router.get("/grades/:gid", (req, res) => {
    const { gid } = req.params;
    const grade = gradeDao.findGradeById(gid);
    if (!grade) {
        res.status(404).json({ message: "Grade not found" });
        return;
    }
    res.json(grade);
});

// Create a new grade
router.post("/assignments/:aid/students/:sid/grades", (req, res) => {
    const { aid, sid } = req.params;
    const newGrade = {
        _id: uuidv4(),
        ...req.body,
        assignment: aid,
        student: sid
    };
    const createdGrade = gradeDao.createGrade(newGrade);
    res.json(createdGrade);
});

// Update a grade
router.put("/grades/:gid", (req, res) => {
    const { gid } = req.params;
    const updatedGrade = gradeDao.updateGrade(gid, req.body);
    if (!updatedGrade) {
        res.status(404).json({ message: "Grade not found" });
        return;
    }
    res.json(updatedGrade);
});

// Delete a grade
router.delete("/grades/:gid", (req, res) => {
    const { gid } = req.params;
    const success = gradeDao.deleteGrade(gid);
    if (!success) {
        res.status(404).json({ message: "Grade not found" });
        return;
    }
    res.json({ message: "Grade deleted successfully" });
});

export default router; 