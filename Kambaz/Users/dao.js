/* import users from "../Database/users.js"; */
/* import { v4 as uuidv4 } from "uuid"; */
import * as courseDao from "../Courses/dao.js";
import * as enrollmentDao from "../Enrollments/dao.js";
import model from "./model.js";
import users from "../Database/users.js";

// Sync user courses with enrollments
const syncUserCourses = () => {
    const enrollments = enrollmentDao.findAllEnrollments();

    // For each user, update their courses based on enrollments
    users.forEach(user => {
        if (user.role !== "FACULTY") {
            // Get all enrollments for this user
            const userEnrollments = enrollments.filter(e => e.user === user._id && e.enrolled);

            // Extract course IDs from enrollments
            const courseIds = userEnrollments.map(e => e.course);

            // Update user's courses
            user.courses = courseIds;
        }
    });
};

// Call sync function to ensure data consistency
syncUserCourses();

/* export const createUser = (user) => {
    const newUser = { ...user, _id: uuidv4() };
    users = [...users, newUser];
    return newUser;
}; */

export const createUser = (user) => {
    const newUser = { ...user, _id: new Date().getTime().toString() };
    users.push(newUser);
    return newUser;
};

export const findAllUsers = () => model.find();

export const findUserById = (userId) => model.findById(userId);

export const findUserByUsername = (username) => model.findOne({ username: username });

export const findUserByCredentials = (username, password) => model.findOne({ username, password });

export const findUsersByRole = (role) => model.find({ role: role });

export const findUsersByCourse = (courseId) => model.find({ courses: courseId });

export const updateUser = (userId, user) => model.updateOne({ _id: userId }, { $set: user });

export const deleteUser = (userId) => model.deleteOne({ _id: userId });

export const enrollUserInCourse = (userId, courseId) => {
    // Update user's courses
    const user = findUserById(userId);
    if (!user) {
        return null;
    }
    if (!user.courses) {
        user.courses = [];
    }
    if (!user.courses.includes(courseId)) {
        user.courses.push(courseId);
    }

    // Create or update enrollment
    enrollmentDao.toggleEnrollment(userId, courseId);

    return user;
};

export const unenrollUserFromCourse = (userId, courseId) => {
    // Update user's courses
    const user = findUserById(userId);
    if (!user || !user.courses) {
        return null;
    }
    user.courses = user.courses.filter(cid => cid !== courseId);

    // Update enrollment
    enrollmentDao.toggleEnrollment(userId, courseId);

    return user;
};

// Get courses for a specific user
export const findUserCourses = (userId) => {
    const user = findUserById(userId);
    if (!user || !user.courses) {
        return [];
    }

    // Get all courses
    const allCourses = courseDao.findAllCourses();

    // Filter courses based on user enrollment
    return allCourses.filter(course => user.courses.includes(course._id));
};

// Re-export the findAllCourses function from the course DAO
export const findAllCourses = () => courseDao.findAllCourses();