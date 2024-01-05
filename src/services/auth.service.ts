import { v4 as uuidv4 } from 'uuid';
import { UserRepository } from '../repositories/user.repository';

export class AuthService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async registerUser(email: string, password: string, role: string): Promise<any> {
        try {
            //Simple validation of email
            if (!email.includes('@')) {
                return { data: null, error: { message: 'Email is not valid' }, code: 400 };
            }

            // Check if email is already in use
            const users = await this.userRepository.getUsers();

            if (users.some(user => user.email === email)) {
                return { data: null, error: { message: 'Email is not valid' }, code: 400 };
            }

            // Generate new UUID
            const id = uuidv4();

            // Add the new users array
            users.push({ id, email, role, password });

            // Save updated users array to file
            await this.userRepository.saveUsers(users);

            // Return successful response
            return { data: { id, email, role }, error: null, code: 200 };
        } catch (error) {
            console.error(error);
            return { data: null, error: { message: 'Internal Server error' }, code: 500 };
        }
    }
}
