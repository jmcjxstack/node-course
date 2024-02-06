import { Users } from "../entity/Users";
import { AppDataSource } from "../data-source";
import { TODO } from "../schemas/Todo";

export class UserRepository {
    // Method to get user
    async getUserByEmail(email: string): Promise<TODO> {
        try {
            const user = await AppDataSource.getRepository(Users).findOneBy({
                email: email,
            });

            return user;
        } catch (error) {
            // Error handling
            console.log(`Error getting user from database: ${error}`);
            return null;
        }
    }

    // Method to add a new user
    async addUser(newUser: Record<string, any>): Promise<TODO> {
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
            console.log(`Error adding user to database: ${error}`);
            return null;
        }
    }

    // Method to check if user with credentials exists
    async checkCredentials(email: string, password: string): Promise<TODO> {
        try {
            const user = await AppDataSource.getRepository(Users)
                .createQueryBuilder("user")
                .where("user.email = :email", { email: email })
                .andWhere("user.password = :password", { password: password })
                .getOne();

            return user;
        } catch (error) {
            // Error handling
            console.log(`Error checking credentials: ${error}`);
            return null;
        }
    }

    async getUserById(id: string) {
        try {
            const user = await AppDataSource.getRepository(Users).findOneBy({
                id: id,
            });

            return user;
        } catch (error) {
            // Error handling
            console.log(`Error getting user from database: ${error}`);
            return null;
        }
    }
}
