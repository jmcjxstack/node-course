import { Users } from "../entity/Users";
import { AppDataSource } from "../data-source";

export class UserRepository {
	// Method to get user by its email
	async getUserByEmail(email: string): Promise<Users | null> {
		try {
			const user: Users | null = await AppDataSource.getRepository(
				Users
			).findOneBy({
				email: email,
			});

			return user;
		} catch (error) {
			// Error handling
			console.error(`Error getting user from database: ${error}`);
			return null;
		}
	}

	// Method to add a new user to database
	async addUser(newUser: Record<string, any>): Promise<Users | null> {
		try {
			const user: Users = await AppDataSource.getRepository(Users).create(
				newUser
			);

			const result: Users = await AppDataSource.getRepository(Users).save(
				user
			);

			return result;
		} catch (error) {
			// Error handling
			console.error(`Error adding user to database: ${error}`);
			return null;
		}
	}

	// Method to check if user with credentials exists
	async checkCredentials(
		email: string,
		password: string
	): Promise<Users | null> {
		try {
			const user: Users | null = await AppDataSource.getRepository(Users)
				.createQueryBuilder("user")
				.where("user.email = :email", { email: email })
				.andWhere("user.password = :password", { password: password })
				.getOne();

			return user;
		} catch (error) {
			// Error handling
			console.error(`Error checking credentials: ${error}`);
			return null;
		}
	}

	// Method to get user by its id
	async getUserById(id: string): Promise<Users | null> {
		try {
			const user: Users | null = await AppDataSource.getRepository(
				Users
			).findOneBy({
				id: id,
			});

			return user;
		} catch (error) {
			// Error handling
			console.error(`Error getting user from database: ${error}`);
			return null;
		}
	}
}
