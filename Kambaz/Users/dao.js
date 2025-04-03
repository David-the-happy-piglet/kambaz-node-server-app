import users from "../Database/users.js";
import { v4 as uuidv4 } from "uuid";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentDao from "../Enrollments/dao.js";

// Initialize users if empty
if (users.length === 0) {
    // Add some default users
    users.push(
        {
            "_id": "234",
            "username": "dark_knight",
            "password": "wayne123",
            "firstName": "Bruce",
            "lastName": "Wayne",
            "email": "bruce@wayne.com",
            "dob": "1972-02-19",
            "role": "STUDENT",
            "loginId": "001234562S",
            "section": "S101",
            "lastActivity": "2020-11-02",
            "totalActivity": "15:32:43",
            "courses": []
        },
        {
            "_id": "345",
            "username": "black_widow",
            "password": "romanoff123",
            "firstName": "Natasha",
            "lastName": "Romanoff",
            "email": "natasha@avengers.com",
            "dob": "1984-11-22",
            "role": "TA",
            "loginId": "001234564S",
            "section": "S101",
            "lastActivity": "2020-11-05",
            "totalActivity": "13:23:34",
            "courses": []
        },
        {
            "_id": "123",
            "username": "iron_man",
            "password": "stark123",
            "firstName": "Tony",
            "lastName": "Stark",
            "email": "tony@stark.com",
            "dob": "1970-05-29T00:00:00.000Z",
            "role": "FACULTY",
            "loginId": "001234561S",
            "section": "S101",
            "lastActivity": "2020-10-01",
            "totalActivity": "10:21:32",
            "courses": []
        }
    );
}

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
    users.push(user);
    return user;
};

export const findAllUsers = () => users;

export const findUserById = (userId) => {
    const user = users.find(u => u._id === userId);
    return user;
};

export const findUserByUsername = (username) => users.find((user) => user.username === username);

export const findUserByCredentials = (username, password) =>
    users.find((user) => user.username === username && user.password === password);

export const findUsersByRole = (role) => {
    return users.filter(u => u.role === role);
};

export const findUsersByCourse = (courseId) => {
    return users.filter(user => user.courses?.includes(courseId));
};

export const updateUser = (userId, user) => {
    const index = users.findIndex(u => u._id === userId);
    if (index === -1) return null;
    users[index] = { ...users[index], ...user };
    return users[index];
};

export const deleteUser = (userId) => {
    const index = users.findIndex(u => u._id === userId);
    if (index === -1) return false;
    users.splice(index, 1);
    return true;
};

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