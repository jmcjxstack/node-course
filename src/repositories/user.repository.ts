import fs from "fs/promises";
import path from "path";

export class UserRepository {
	private usersFilePath = path.join(__dirname, "../data/users.json");

	async getUsers(): Promise<Record<string, any>[]> {
		try {
			// Reads the contents of the file
			const content = await fs.readFile(this.usersFilePath, "utf-8");

			// Returns the contents of the file parsed as an object
			return JSON.parse(content);
		} catch (error) {
			// Error handling
			return [];
		}
	}

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
