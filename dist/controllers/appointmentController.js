"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAppointment = exports.getAppointmentsByStudent = void 0;
const Appointment = require('../db/Appointment');
const lodash_1 = require("lodash");
const mongoose_1 = __importDefault(require("mongoose"));
const getAppointmentsByStudent = async (req, res) => {
    try {
        const studentId = new mongoose_1.default.Types.ObjectId((0, lodash_1.get)(req, 'identity._id'));
        console.log("studentId", studentId);
        const appointments = await Appointment.find({ studentId }).populate('tutorId', 'name'); // Populate tutor name
        console.log("appointments", appointments);
        res.json(appointments);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAppointmentsByStudent = getAppointmentsByStudent;
const createAppointment = async (req, res) => {
    console.log("Creating appointment");
    try {
        const userId = new mongoose_1.default.Types.ObjectId((0, lodash_1.get)(req, 'identity._id')); // Ensure ObjectId
        console.log("userId", userId);
        if (!userId) {
            res.status(401).json({ message: 'User not authenticated.' });
            return;
        }
        const { tutorId, start, end, title } = req.body;
        console.log("req", req.body);
        if (!tutorId || !start || !end || !title) {
            res.status(400).json({ message: 'Missing required fields.' });
            return;
        }
        const newAppointment = new Appointment({
            tutorId: new mongoose_1.default.Types.ObjectId(tutorId),
            studentId: userId, // Use userId
            start: new Date(start),
            end: new Date(end),
            title,
        });
        const savedAppointment = await newAppointment.save();
        console.log("savedAppointment", savedAppointment);
        res.status(201).json(savedAppointment);
    }
    catch (error) {
        console.error('Error creating appointment:', error);
        console.error('Request body:', req.body); // Log request body
        if (error.name === 'ValidationError') {
            res.status(400).json({ message: error.message });
            return;
        }
        if (error.name === 'CastError') {
            res.status(400).json({ message: "Invalid tutorId or studentId" });
            return;
        }
        res.status(500).json({ message: 'Internal server error.' });
    }
};
exports.createAppointment = createAppointment;
//# sourceMappingURL=appointmentController.js.map