import grades from "../Database/grades.js";

export const findAllGrades = () => grades;

export const findGradeById = (gradeId) => {
    const grade = grades.find(g => g._id === gradeId);
    return grade;
};

export const findGradesByStudent = (studentId) => {
    return grades.filter(g => g.student === studentId);
};

export const findGradesByAssignment = (assignmentId) => {
    return grades.filter(g => g.assignment === assignmentId);
};

export const createGrade = (grade) => {
    grades.push(grade);
    return grade;
};

export const updateGrade = (gradeId, grade) => {
    const index = grades.findIndex(g => g._id === gradeId);
    if (index === -1) return null;
    grades[index] = { ...grades[index], ...grade };
    return grades[index];
};

export const deleteGrade = (gradeId) => {
    const index = grades.findIndex(g => g._id === gradeId);
    if (index === -1) return false;
    grades.splice(index, 1);
    return true;
}; 