import express from 'express';
import http from 'http';
import bodyparser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';
import dotenv from 'dotenv';
import { SpeechClient } from '@google-cloud/speech';
require('dotenv').config();
const app=express();

app.use(cors({
  origin: ['http://localhost:5173', 'https://fancy-cassata-2e8dda.netlify.app'],
  credentials: true
}));
app.use(compression());
app.use(cookieParser());

const client = new SpeechClient();
const server=http.createServer(app);

const PORT = process.env.PORT || 8081;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
dotenv.config();
const MONGO_URL=process.env.MONGO_URL;
if (!MONGO_URL) {
    console.error('MongoDB URL is not defined in environment variables.');
    process.exit(1);  // Exit the process if MONGO_URL is not set
} else {
    console.log('Mongo URL:', MONGO_URL);
    mongoose.Promise = Promise;
    mongoose.connect(MONGO_URL)
        .then(() => {
            console.log('Successfully connected to MongoDB');
        })
        .catch((error: Error) => {
            console.error('Error connecting to MongoDB:', error.message);
            process.exit(1);  // Exit the process on connection failure
        });
}


mongoose.connection.on('error',(error:Error)=>{console.log(error);});

app.use(bodyparser.json({ limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

// Increase URL-encoded payload size limit
app.use(bodyparser.urlencoded({ 
  limit: '50mb', 
  extended: true 
}));
app.use('/',router())