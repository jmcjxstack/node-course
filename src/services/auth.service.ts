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
					response: {
						data: null,
						error: { message: "Email is not valid" },
					},
					code: 400,
				};
			}

			// Search for user with email in database
			const user = await this.userRepository.getUser(email);

			// Handle if email is already in use
			if (user) {
				return {
					response: {
						data: null,
						error: { message: "Email is not valid" },
					},
					code: 400,
				};
			}

			// Generate new UUID
			const id: string = uuidv4();

			// Insert user to database
			const insertResult = await this.userRepository.addUser({
				id,
				email,
				role,
				password,
			});

			return {
				response: {
					data: {
						id: insertResult.id,
						email: insertResult.email,
						role: insertResult.role,
					},
					error: null,
				},
				code: 200,
			};
		} catch (error) {
			// Error handling
			console.error(error);
			return {
				response: {
					data: null,
					error: { message: "Internal Server error" },
				},
				code: 500,
			};
		}
	}

	// Method to login user
	async loginUser(email: string, password: string): Promise<any> {
		try {
			// Search for user with credentials in database
			const user = await this.userRepository.checkCredentials(
				email,
				password
			);

			// Response if user with correct credentials is not found
			if (!user) {
				return {
					response: {
						data: null,
						error: {
							message: "No user with such email or password",
						},
					},
					code: 400,
				};
			}

			// Load secret key from environment variables
			const secretKey: string =
				process.env.JWT_SECRET || "default-secret-key";

			// Generate JWT token
			const token: string = jwt.sign(
				{ id: user.id, email: user.email, role: user.role },
				secretKey,
				{
					expiresIn: "1h", // Token expiration time (adjust as needed)
				}
			);

			return { response: { data: { token }, error: null }, code: 200 };
		} catch (error) {
			// Error handling
			console.error(error);
			return {
				response: {
					data: null,
					error: { message: "Internal Server error" },
				},
				code: 500,
			};
		}
	}
}
