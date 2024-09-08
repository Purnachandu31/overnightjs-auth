import { Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';  // Import bcrypt for hashing
import * as jwt from 'jsonwebtoken';
import { User } from '../models/User';

@Controller('auth')
export class AuthController {
    @Post('signup')
    async signup(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;

            // Ensure required fields are present
            if (!name || !email || !password) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            // Check if the user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already exists' });
            }

            // Hash the password using bcrypt
            const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

            // Create a new user with the hashed password
            const newUser = new User({
                username: name,
                email,
                password: hashedPassword
            });

            await newUser.save();

            return res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            console.error('Error in signup:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    @Post('login')
private async login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        res.json({ token, username: user.username }); // Include username in response
    } catch (err) {
        console.error('Error in login:', err);
        res.status(500).json({ error: 'Login error' });
    }
}

    
}
