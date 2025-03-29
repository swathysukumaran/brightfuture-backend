const Tutor = require('../db/Tutor');// Use import instead of require
import { Request, Response } from 'express';

export const getAllTutors = async (req: Request, res: Response): Promise<void> => {
    try {
        const tutors = await Tutor.find();
        res.json(tutors);
    } catch (error: unknown) {
        console.error("Error fetching tutors:", error);
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred." });
        }
    }
};

export const createTutor = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            res.status(400).json({ message: "Request body is empty." });
             return;
        }

        const tutor = new Tutor(req.body);
        const newTutor = await tutor.save();
        res.status(201).json(newTutor);
    } catch (error: unknown) {
        console.error("Error creating tutor:", error);
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal server error." });
        }
    }
};
