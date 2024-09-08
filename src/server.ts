import { Server } from '@overnightjs/core';
import express from 'express';
import mongoose from 'mongoose';
import { AuthController } from './controllers/AuthController';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); 
class AppServer extends Server {
    constructor() {
        super();
        this.app.use(cors());
        this.app.use(express.json());
        this.setUpControllers();
        this.setupTestRoute(); // Ensure this method is called
        this.connectDB();
    }

    private setUpControllers(): void {
        const authController = new AuthController();
        super.addControllers([authController]);
    }
    private setupTestRoute(): void {
        this.app.get('/test', (req, res) => {
            res.send('Test route working');
        });
    }

    private async connectDB(): Promise<void> {
        try {
            const url: string | undefined = process.env.MONGO_URI;
    
            if (!url) {
                throw new Error('MONGO_URI is not defined in the environment variables.');
            }
    
            await mongoose.connect(url);
            console.log(`Database connected: ${url}`);
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            process.exit(1);
        }
    }
    

    public start(port: number, callback?: () => void): void {
        this.app.listen(port, callback);
    }
}

const appServer = new AppServer();
appServer.start(3000, () => {
    console.log('Server is running on port 3000');
});
