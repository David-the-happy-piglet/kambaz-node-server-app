import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
    _id: String,
    title: String,
    description: String,
    course: String,
    dueDate: Date,
    points: Number,
    availableFromDate: Date,
    availableUntilDate: Date,
    type: {
        type: String,
        enum: ["QUIZ", "ASSIGNMENT", "EXAM"],
        default: "ASSIGNMENT"
    }
}, { collection: "assignments" });

export default assignmentSchema; 