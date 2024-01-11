import fs from "fs/promises";
import path from "path";

export class UserRepository {
	private usersFilePath: string = path.join(__dirname, "../data/users.json");

	// Method to get list of users
	async getUsers(): Promise<Record<string, any>[]> {
		try {
			// Reads the contents of the file
			const content: string = await fs.readFile(
				this.usersFilePath,
				"utf-8"
			);

			// Returns the contents of the file parsed as an object
			return JSON.parse(content);
		} catch (error) {
			// Error handling
			console.log(`Error getting list of users: ${error}`);
			return [];
		}
	}

	// Method to save a new user
	async saveUsers(users: Record<string, any>[]): Promise<void> {
		try {
			// Stringifies array of users and saves it to file
			await fs.writeFile(
				this.usersFilePath,
				JSON.stringify(users, null, 2),
				"utf-8"
			);
		} catch (error) {
			// Error handling
			console.log(`Error writing to file: ${error}`);
		}
	}
}
