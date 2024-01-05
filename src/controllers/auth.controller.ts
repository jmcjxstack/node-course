import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { UserRepository } from '../repositories/user.repository';

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { email, password, role } = req.body;

        //New instance of UserRepository
        const userRepository = new UserRepository();

        // Pass userRepository to AuthService
        const authService = new AuthService(userRepository);

        const result = await authService.registerUser(email, password, role);

        return res.status(result.code).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            data: null,
            error: { message: 'Internal Server error' },
        });
    }
};
