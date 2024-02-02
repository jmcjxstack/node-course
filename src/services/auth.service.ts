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
	): Promise<Record<string, any>> {
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
			const users: Record<string, any>[] =
				await this.userRepository.getUsers();

			// Check if email is already in use(if an user already uses this email)
			if (users.some((user) => user.email === email)) {
				return {
					data: null,
					error: { message: "Email is not valid" },
					code: 400,
				};
			}

			// Generate new UUID
			const id: string = uuidv4();

			// Add the new user object to users array, using property shorthand({id: id} => {id})
			users.push({ id, email, role, password });

			// Save updated users array to file using saveUsers method from userRepository
			await this.userRepository.saveUsers(users);

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
	async loginUser(
		email: string,
		password: string
	): Promise<Record<string, any>> {
		try {
			// Get the array of users with getUsers method from userRepository
			const users: Record<string, any>[] =
				await this.userRepository.getUsers();

			// Find user with correct credentials
			const user: Record<string, any> | undefined = users.find(
				(user) => user.email === email && user.password === password
			);

			// Response if user with correct credentials is not found
			if (!user) {
				return {
					data: null,
					error: { message: "No user with such email or password" },
					code: 400,
				};
			}

			// Load secret key from environment variables
			const secretKey: string =
				process.env.JWT_SECRET || "default-secret-key";

			// Generate JWT token
			const token: string = jwt.sign(
				{ userId: user.id, email: user.email, role: user.role },
				secretKey,
				{
					expiresIn: "1h", // Token expiration time (adjust as needed)
				}
			);

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
