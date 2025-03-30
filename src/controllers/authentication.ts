import express, { Request, Response } from 'express';
import { createUser, getUserByEmail } from '../db/users';
import { random, authentication } from '../helpers';

export const register: express.RequestHandler = async (req, res): Promise<void> => {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const salt = random();
        const newUser = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password),
            }
        });

        res.status(201).json(newUser);  // No return here, just response handling
    } catch (error: unknown) {
        console.error('Registration Error:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

export const login: express.RequestHandler = async (req, res): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required.' });
            return;
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');

        if (!user || !user.authentication) {
            res.status(400).json({ message: 'User not found or authentication details missing.' });
            return;
        }

        const { salt, password: hashedPassword } = user.authentication;

        if (!salt || !hashedPassword) {
            res.status(400).json({ message: 'Authentication details are incomplete.' });
            return;
        }

        const expectedHash = authentication(salt, password);
        if (expectedHash !== hashedPassword) {
            res.status(403).json({ message: 'Invalid credentials.' });
            return;
        }

        const sessionSalt = random();
        user.authentication.sessionToken = authentication(sessionSalt, user._id.toString());
        await user.save();

        res.cookie('TEMPO-AUTH', user.authentication.sessionToken, {
           
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        res.status(200).json(user);
    } catch (error: unknown) {
        console.error('Login Error:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};
