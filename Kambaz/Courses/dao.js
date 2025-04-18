/* import courses from "../Database/courses.js"; */
import { v4 as uuidv4 } from "uuid";
/* import Database from "../Database/index.js"; */
import model from "./model.js";

export function findAllCourses() {
    return model.find();
}

export function findCourseById(courseId) {
    return model.findById(courseId);
}

export function createCourse(course) {
    const newCourse = { ...course, _id: uuidv4() };
    return model.create(newCourse);
}

/* export function updateCourse(courseId, course) {
    return model.findOneAndUpdate(
        { _id: courseId },
        { $set: course },
        { new: true }
    );
} */

export function updateCourse(courseId, courseUpdates) {
    return model.updateOne({ _id: courseId }, { $set: courseUpdates });
}

export function deleteCourse(courseId) {
    return model.deleteOne({ _id: courseId })
        .then(result => result.deletedCount > 0);
}

export function findCoursesForEnrolledUser(userId) {
    // This function should be implemented in the Enrollments module
    // as it requires access to enrollment data
    throw new Error("This function should be implemented in the Enrollments module");
}

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

