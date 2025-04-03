import modules from "../Database/modules.js";
import { v4 as uuidv4 } from 'uuid';

export const findAllModules = () => modules;

export const findModuleById = (moduleId) => {
    const module = modules.find(m => m._id === moduleId);
    return module;
};

export const findModulesForCourse = (courseId) => {
    return modules.filter(m => m.course === courseId);
};

export const createModule = (module) => {
    modules.push(module);
    return module;
};

export const updateModule = (moduleId, module) => {
    const index = modules.findIndex(m => m._id === moduleId);
    if (index === -1) return null;
    modules[index] = { ...modules[index], ...module };
    return modules[index];
};

export const deleteModule = (moduleId) => {
    const index = modules.findIndex(m => m._id === moduleId);
    if (index === -1) return false;
    modules.splice(index, 1);
    return true;
};

