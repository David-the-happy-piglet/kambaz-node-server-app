import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export function findAllAssignments() {
    return model.find();
}

export function findAssignmentById(assignmentId) {
    return model.findById(assignmentId);
}

export function findAssignmentsForCourse(courseId) {
    return model.find({ course: courseId });
}

export function createAssignment(assignment) {
    const newAssignment = { ...assignment, _id: uuidv4() };
    return model.create(newAssignment);
}

export function updateAssignment(assignmentId, assignment) {
    return model.findOneAndUpdate(
        { _id: assignmentId },
        { $set: assignment },
        { new: true }
    );
}

export function deleteAssignment(assignmentId) {
    return model.deleteOne({ _id: assignmentId })
        .then(result => result.deletedCount > 0);
} 