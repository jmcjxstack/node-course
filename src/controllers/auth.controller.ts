import { Request, Response } from "express";

import { AuthService } from "../services/auth.service";
import { UserRepository } from "../repositories/user.repository";

export async function registerUser(req: Request, res: Response) {
    try {
        // Destructuring object from request body
        const { email, password, role } = req.body;

        // New instance of UserRepository
        const userRepository = new UserRepository();

        // New instance of AuthService with userRepository as argument for the constructor
        const authService = new AuthService(userRepository);

        // Wait for result of service to register user
        const result = await authService.registerUser(email, password, role);

        // Return both status code and response
        return res.status(result.code).json(result);
    } catch (error) {
        // Error handling
        console.error(error);
        return res.status(500).json({
            data: null,
            error: { message: "Internal Server error" },
        });
    }
}

export async function loginUser(req: Request, res: Response) {
    try {
        // Destructuring object from request body
        const { email, password } = req.body;

        // New instance of UserRepository
        const userRepository = new UserRepository();

        // New instance of AuthService with userRepository as argument for the constructor
        const authService = new AuthService(userRepository);

        // Wait for result of service to login user
        const result = await authService.loginUser(email, password);

        // Return both status code and response
        return res.status(result.code).json(result);
    } catch (error) {
        // Error handling
        console.error(error);
        return res.status(500).json({
            data: null,
            error: { message: "Internal Server error" },
        });
    }
}
