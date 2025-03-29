"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTutor = exports.getAllTutors = void 0;
const Tutor = require('../db/Tutor');
const getAllTutors = async (req, res) => {
    try {
        const tutors = await Tutor.find();
        res.json(tutors);
        return;
    }
    catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
};
exports.getAllTutors = getAllTutors;
const createTutor = async (req, res) => {
    const tutor = new Tutor(req.body);
    try {
        const newTutor = await tutor.save();
        res.status(201).json(newTutor);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createTutor = createTutor;
//# sourceMappingURL=tutorController.js.map