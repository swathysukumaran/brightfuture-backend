const Appointment = require('../db/Appointment');
import { Request, Response } from 'express';
import { get } from 'lodash';
import mongoose from 'mongoose';

export const getAppointmentsByStudent = async (req: Request, res: Response): Promise<void> => {
    try {
        const studentIdStr = get(req, 'identity._id');
        if (!studentIdStr || !mongoose.Types.ObjectId.isValid(studentIdStr)) {
            res.status(400).json({ message: "Invalid student ID." });
             return;
        }
        const studentId = new mongoose.Types.ObjectId(studentIdStr);
        console.log("studentId", studentId);

        const appointments = await Appointment.find({ studentId }).populate('tutorId', 'name'); // Populate tutor name
        console.log("appointments", appointments);
        res.json(appointments);
    } catch (error: unknown) {
        console.error("Error fetching appointments:", error);
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred." });
        }
    }
};

export const createAppointment = async (req: Request, res: Response): Promise<void> => {
    console.log("Creating appointment");
    try {
        const userIdStr = get(req, 'identity._id');
        if (!userIdStr || !mongoose.Types.ObjectId.isValid(userIdStr)) {
             res.status(401).json({ message: 'User not authenticated.' });
             return;
        }
        const userId = new mongoose.Types.ObjectId(userIdStr);
        console.log("userId", userId);

        const { tutorId, start, end, title } = req.body;
        console.log("req", req.body);

        if (!tutorId || !start || !end || !title) {
             res.status(400).json({ message: 'Missing required fields.' });
             return;
        }
        if (!mongoose.Types.ObjectId.isValid(tutorId)) {
             res.status(400).json({ message: "Invalid tutorId." });
             return;
        }

        const newAppointment = new Appointment({
            tutorId: new mongoose.Types.ObjectId(tutorId),
            studentId: userId,
            start: new Date(start),
            end: new Date(end),
            title,
        });

        const savedAppointment = await newAppointment.save();
        console.log("savedAppointment", savedAppointment);
        res.status(201).json(savedAppointment);
    } catch (error: unknown) {
        console.error('Error creating appointment:', error);
        console.error('Request body:', req.body);

        if (error instanceof Error) {
            if (error.name === 'ValidationError') {
                res.status(400).json({ message: error.message });
                return ;
            }
            if (error.name === 'CastError') {
                res.status(400).json({ message: "Invalid tutorId or studentId" });
                return ;
            }
            res.status(500).json({ message: error.message });
             return;
        }
        res.status(500).json({ message: "Internal server error." });
    }
};
