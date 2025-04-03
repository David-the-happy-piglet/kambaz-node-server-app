import express from "express";
import * as enrollmentDao from "./dao.js";

const router = express.Router();

// Get all enrollments
router.get("/enrollments", (req, res) => {
    const enrollments = enrollmentDao.findAllEnrollments();
    res.json(enrollments);
});

// Get enrollments for a specific user
router.get("/users/:uid/enrollments", (req, res) => {
    const { uid } = req.params;
    const userEnrollments = enrollmentDao.findEnrollmentsByUser(uid);
    res.json(userEnrollments);
});

// Get enrollments for a specific course
router.get("/courses/:cid/enrollments", (req, res) => {
    const { cid } = req.params;
    const courseEnrollments = enrollmentDao.findEnrollmentsByCourse(cid);
    res.json(courseEnrollments);
});

// Get a specific enrollment
router.get("/enrollments/:eid", (req, res) => {
    const { eid } = req.params;
    const enrollment = enrollmentDao.findEnrollmentById(eid);
    if (!enrollment) {
        res.status(404).json({ message: "Enrollment not found" });
        return;
    }
    res.json(enrollment);
});

// Toggle enrollment status (enroll/unenroll)
router.post("/users/:uid/courses/:cid/enroll", (req, res) => {
    const { uid, cid } = req.params;
    const enrollment = enrollmentDao.toggleEnrollment(uid, cid);
    res.json(enrollment);
});

// Update an enrollment
router.put("/enrollments/:eid", (req, res) => {
    const { eid } = req.params;
    const updatedEnrollment = enrollmentDao.updateEnrollment(eid, req.body);
    if (!updatedEnrollment) {
        res.status(404).json({ message: "Enrollment not found" });
        return;
    }
    res.json(updatedEnrollment);
});

// Delete an enrollment
router.delete("/enrollments/:eid", (req, res) => {
    const { eid } = req.params;
    const success = enrollmentDao.deleteEnrollment(eid);
    if (!success) {
        res.status(404).json({ message: "Enrollment not found" });
        return;
    }
    res.json({ message: "Enrollment deleted successfully" });
});

export default router; 