import enrollments from "../Database/enrollments.js";
import { v4 as uuidv4 } from "uuid";

// Initialize enrollments if empty
if (enrollments.length === 0) {
    // Add some default enrollments
    enrollments.push(
        {
            _id: "E1",
            user: "234", // dark_knight
            course: "RS101",
            enrolled: true
        },
        {
            _id: "E2",
            user: "234", // dark_knight
            course: "RS102",
            enrolled: true
        },
        {
            _id: "E3",
            user: "345", // black_widow
            course: "RS101",
            enrolled: true
        }
    );
}

export const findAllEnrollments = () => enrollments;

export const findEnrollmentById = (enrollmentId) => {
    const enrollment = enrollments.find(e => e._id === enrollmentId);
    return enrollment;
};

export const findEnrollmentsByUser = (userId) => {
    return enrollments.filter(e => e.user === userId);
};

export const findEnrollmentsByCourse = (courseId) => {
    return enrollments.filter(e => e.course === courseId);
};

export const createEnrollment = (enrollment) => {
    enrollments.push(enrollment);
    return enrollment;
};

export const updateEnrollment = (enrollmentId, enrollment) => {
    const index = enrollments.findIndex(e => e._id === enrollmentId);
    if (index === -1) return null;
    enrollments[index] = { ...enrollments[index], ...enrollment };
    return enrollments[index];
};

export const deleteEnrollment = (enrollmentId) => {
    const index = enrollments.findIndex(e => e._id === enrollmentId);
    if (index === -1) return false;
    enrollments.splice(index, 1);
    return true;
};

export const toggleEnrollment = (userId, courseId) => {
    const existingEnrollment = enrollments.find(
        e => e.user === userId && e.course === courseId
    );

    if (existingEnrollment) {
        existingEnrollment.enrolled = !existingEnrollment.enrolled;
        return existingEnrollment;
    }

    const newEnrollment = {
        _id: `E${enrollments.length + 1}`,
        user: userId,
        course: courseId,
        enrolled: true
    };
    enrollments.push(newEnrollment);
    return newEnrollment;
};
