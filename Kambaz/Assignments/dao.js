import assignments from "../Database/assignments.js";

export const findAllAssignments = () => assignments;

export const findAssignmentById = (assignmentId) => {
    const assignment = assignments.find(a => a._id === assignmentId);
    return assignment;
};

export const findAssignmentsForModule = (moduleId) => {
    return assignments.filter(a => a.module === moduleId);
};

export const findAssignmentsByCourse = (courseId) => {
    return assignments.filter(a => a.course === courseId);
};

export const createAssignment = (assignment) => {
    assignments.push(assignment);
    return assignment;
};

export const updateAssignment = (assignmentId, assignment) => {
    const index = assignments.findIndex(a => a._id === assignmentId);
    if (index === -1) return null;
    assignments[index] = { ...assignments[index], ...assignment };
    return assignments[index];
};

export const deleteAssignment = (assignmentId) => {
    const index = assignments.findIndex(a => a._id === assignmentId);
    if (index === -1) return false;
    assignments.splice(index, 1);
    return true;
}; 