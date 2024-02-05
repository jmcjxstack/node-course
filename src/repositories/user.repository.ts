import { Users } from "../entity/Users";
import { AppDataSource } from "../data-source";

export class UserRepository {
	// Method to get user
	async getUser(email: string): Promise<any> {
		try {
			const user = await AppDataSource.getRepository(Users).findOneBy({
				email: email,
			});

			return user;
		} catch (error) {
			// Error handling
			console.log(`Error: ${error}`);
			return null;
		}
	}

	// Method to add a new user
	async addUser(newUser: Record<string, any>): Promise<any> {
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
			console.log(`Error: ${error}`);
			return null;
		}
	}

	// Method to check if user with credentials exists
	async checkCredentials(email: string, password: string): Promise<any> {
		try {
			const user = await AppDataSource.getRepository(Users)
				.createQueryBuilder("user")
				.where("user.email = :email", { email: email })
				.andWhere("user.password = :password", { password: password })
				.getOne();
			
			return user;
		} catch (error) {
			// Error handling
			console.log(`Error: ${error}`);
			return null;
		}
	}
}
