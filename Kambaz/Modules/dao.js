/* import modules from "../Database/modules.js"; */
import model from "./model.js";
import { v4 as uuidv4 } from 'uuid';

export function findAllModules() {
    return model.find();
}

export function findModuleById(moduleId) {
    return model.findById(moduleId);
}

export function findModulesForCourse(courseId) {
    return model.find({ course: courseId });
}

export function createModule(module) {
    const newModule = { ...module, _id: uuidv4() };
    return model.create(newModule);
}

export function updateModule(moduleId, moduleUpdates) {
    return model.updateOne({ _id: moduleId }, moduleUpdates);
}
/* export function updateModule(moduleId, module) {
    return model.findOneAndUpdate(
        { _id: moduleId },
        { $set: module },
        { new: true }
    );
} */

export function deleteModule(moduleId) {
    return model.deleteOne({ _id: moduleId })
        .then(result => result.deletedCount > 0);
}

