/* import users from "../Database/users.js"; */
import { v4 as uuidv4 } from "uuid";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentDao from "../Enrollments/dao.js";
import model from "./model.js";
/* import users from "../Database/users.js"; */

// Sync user courses with enrollments
const syncUserCourses = async () => {
    const enrollments = await enrollmentDao.findAllEnrollments();
    const users = await model.find();

    // For each user, update their courses based on enrollments
    for (const user of users) {
        if (user.role !== "FACULTY") {
            // Get all enrollments for this user
            const userEnrollments = enrollments.filter(e => e.user === user._id && e.enrolled);

            // Extract course IDs from enrollments
            const courseIds = userEnrollments.map(e => e.course);

            // Update user's courses
            await model.updateOne({ _id: user._id }, { $set: { courses: courseIds } });
        }
    }
};

// Call sync function to ensure data consistency
syncUserCourses();

/* export const createUser = (user) => {
    const newUser = { ...user, _id: uuidv4() };
    users = [...users, newUser];
    return newUser;
}; */

export const createUser = (user) => {
    const newUser = { ...user, _id: uuidv4() };
    return model.create(newUser);
}

export const findAllUsers = () => model.find();

export const findUserById = (userId) => model.findById(userId);

export const findUserByUsername = (username) => model.findOne({ username: username });

export const findUserByCredentials = (username, password) => model.findOne({ username, password });

export const findUsersByRole = (role) => model.find({ role: role });

export const findUsersByCourse = (courseId) => model.find({ courses: courseId });

export const updateUser = (userId, user) => model.updateOne({ _id: userId }, { $set: user });

export const deleteUser = (userId) => model.deleteOne({ _id: userId });

export const findUsersByPartialName = (partialName) => {
    const regex = new RegExp(partialName, "i"); // 'i' makes it case-insensitive
    return model.find({
        $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
    });
};


export const enrollUserInCourse = async (userId, courseId) => {
    try {
        // Check if user exists
        const user = await model.findById(userId);
        if (!user) {
            return null;
        }

        // Add course to user's courses array
        const updatedUser = await model.findByIdAndUpdate(
            userId,
            { $addToSet: { courses: courseId } }, // $addToSet prevents duplicates
            { new: true }
        );

        // Update enrollment status
        await enrollmentDao.toggleEnrollment(userId, courseId);

        return updatedUser;
    } catch (error) {
        console.error("Error enrolling user in course:", error);
        return null;
    }
};

export const unenrollUserFromCourse = async (userId, courseId) => {
    try {
        // Update user's courses
        const user = await model.findById(userId);
        if (!user) {
            return null;
        }

        // Remove course from user's courses array
        const updatedUser = await model.findByIdAndUpdate(
            userId,
            { $pull: { courses: courseId } },
            { new: true }
        );

        // Update enrollment status
        await enrollmentDao.toggleEnrollment(userId, courseId);

        return updatedUser;
    } catch (error) {
        console.error("Error unenrolling user from course:", error);
        return null;
    }
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