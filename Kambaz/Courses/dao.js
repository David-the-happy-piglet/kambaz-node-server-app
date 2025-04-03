import courses from "../Database/courses.js";
import { v4 as uuidv4 } from "uuid";
import Database from "../Database/index.js";

export const findAllCourses = () => courses;

export const findCourseById = (courseId) => {
    const course = courses.find(c => c._id === courseId);
    return course;
};

export const createCourse = (course) => {
    courses.push(course);
    return course;
};

export const updateCourse = (courseId, course) => {
    const index = courses.findIndex(c => c._id === courseId);
    if (index === -1) return null;
    courses[index] = { ...courses[index], ...course };
    return courses[index];
};

export const deleteCourse = (courseId) => {
    const index = courses.findIndex(c => c._id === courseId);
    if (index === -1) return false;
    courses.splice(index, 1);
    return true;
};

export const findCoursesForEnrolledUser = (userId) => {
    const { enrollments } = Database;
    const enrolledCourses = courses.filter((course) =>
        enrollments.some((enrollment) => enrollment.user === userId && enrollment.course === course._id));
    return enrolledCourses;
};

/* export function findCoursesForEnrolledUser(userId) {
    const { courses, enrollments } = Database;
    const enrolledCourses = courses.filter((course) =>
        enrollments.some((enrollment) => enrollment.user === userId && enrollment.course === course._id));
    return enrolledCourses;
}

export function deleteCourse(courseId) {
    const { courses, enrollments } = Database;
    Database.courses = courses.filter((course) => course._id !== courseId);
    Database.enrollments = enrollments.filter(
        (enrollment) => enrollment.course !== courseId
    );
}

export function updateCourse(courseId, courseUpdates) {
    const { courses } = Database;
    const course = courses.find((course) => course._id === courseId);
    Object.assign(course, courseUpdates);
    return course;
} */

