/* import enrollments from "../Database/enrollments.js"; */
import model from "./model.js";
/* import { v4 as uuidv4 } from "uuid"; */

export async function findAllEnrollments() {
    return model.find();
}

export async function findCoursesForUser(userId) {
    const enrollments = await model.find({ user: userId }).populate("course");
    return enrollments.map((enrollment) => enrollment.course);
}

export async function findUsersForCourse(courseId) {
    const enrollments = await model.find({ course: courseId }).populate("user");
    return enrollments.map((enrollment) => enrollment.user);
}

export async function enrollUserInCourse(user, course) {
    const newEnrollment = { user, course, _id: `${user}-${course}` };
    return model.create(newEnrollment);
}
export async function unenrollUserFromCourse(user, course) {
    return model.deleteOne({ user, course });
}


export async function toggleEnrollment(userId, courseId) {
    try {
        // Check if enrollment exists
        const existingEnrollment = await model.findOne({ user: userId, course: courseId });

        if (existingEnrollment) {
            // If enrollment exists, delete it (unenroll)
            await model.deleteOne({ user: userId, course: courseId });
            return { enrolled: false };
        } else {
            // If enrollment doesn't exist, create it (enroll)
            const newEnrollment = await model.create({
                user: userId,
                course: courseId,
                enrolled: true
            });
            return { enrolled: true, enrollment: newEnrollment };
        }
    } catch (error) {
        console.error("Error toggling enrollment:", error);
        throw error;
    }
}






// Initialize enrollments if empty
/* if (enrollments.length === 0) {
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
 */