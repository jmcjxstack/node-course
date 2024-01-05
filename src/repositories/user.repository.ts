import fs from 'fs/promises';
import path from 'path';

export class UserRepository {
    private usersFilePath = path.join(__dirname, '../data/users.json');

    async getUsers(): Promise<any[]> {
        try {
            const content = await fs.readFile(this.usersFilePath, 'utf-8');
            return JSON.parse(content);
        } catch (error) {
            return [];
        }
    }

    async saveUsers(users: any[]): Promise<void> {
        await fs.writeFile(this.usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
    }
}
