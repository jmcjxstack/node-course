import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

import { UserRepository } from "../repositories/user.repository";

dotenv.config();
export class AuthService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    // Method to register user
    async registerUser(
        email: string,
        password: string,
        role: string
    ): Promise<any> {
        try {
            // Simple validation of email
            if (!email.includes("@")) {
                return {
                    data: null,
                    error: { message: "Email is not valid" },
                    code: 400,
                };
            }

            // Get the array of users with getUsers method from userRepository
            const users = await this.userRepository.getUsers();

            // Check if email is already in use(if an user already uses this email)
            if (users.some((user) => user.email === email)) {
                return {
                    data: null,
                    error: { message: "Email is not valid" },
                    code: 400,
                };
            }

            // Generate new UUID
            const id = uuidv4();

            // Add the new user object to users array, using property shorthand({id: id} => {id})
            users.push({ id, email, role, password });

            // Save updated users array to file using saveUsers method from userRepository
            await this.userRepository.saveUsers(users);

            // Return successful response, again, using property shorthand({id: id} => {id})
            return { data: { id, email, role }, error: null, code: 200 };
        } catch (error) {
            // Error handling
            console.error(error);
            return {
                data: null,
                error: { message: "Internal Server error" },
                code: 500,
            };
        }
    }

    // Method to login user
    async loginUser(email: string, password: string): Promise<any> {
        try {
            // Get the array of users with getUsers method from userRepository
            const users = await this.userRepository.getUsers();

            // Find user with correct credentials
            const user = users.find(
                (u) => u.email === email && u.password === password
            );

            // Error handling
            if (!user) {
                return {
                    data: null,
                    error: { message: "No user with such email or password" },
                    code: 400,
                };
            }

            // Load secret key from environment variables
            const secretKey = process.env.JWT_SECRET || "default-secret-key";

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id, email: user.email, role: user.role },
                secretKey,
                {
                    expiresIn: "1h", // Token expiration time (adjust as needed)
                }
            );

            // Return successful response, using property shorthand({token: token} => {token})
            return { data: { token }, error: null, code: 200 };
        } catch (error) {
            // Error handling
            console.error(error);
            return {
                data: null,
                error: { message: "Internal Server error" },
                code: 500,
            };
        }
    }
}
