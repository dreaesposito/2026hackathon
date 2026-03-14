export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
}

export class UserManager {
    private users: Map<string, User>;
    private userCount: number;

    constructor() {
      this.users = new Map<string,User>;
      this.userCount = 0;
    } 

    addUser(user: User): void {
      // invalid id
      if(user.id == null || user.id.length == 0)
        throw new Error('User must have an id');
      
      // duplicate id
      if (this.users.has(user.id))
        throw new Error('User with id ' + user.id + ' already exists');

      this.users.set(user.id, user);
      this.userCount++;
    }

    removeUser(id: string): void {
      if(this.users.delete(id))
        this.userCount--;
      else 
        throw new Error('User with id ' + id + ' not found');
    }

    getUser(id: string): User | null {
      return this.users.get(id) ?? null;
    }

    getUsersByEmail(email: string): User[] | null {
      let matches: User[] = []; 

      this.users.forEach(user => {
        if (user.email === email)
          matches.push(user);
      });

      return matches;
    }

    getUsersByPhone(phone: string): User[] | null {
      let matches: User[] = []; 

      this.users.forEach(user => {
        if (user.phone === phone)
          matches.push(user);
      });

      return matches;
    }

    getAllUsers(): User[] {
        return [... this.users.values()];
    }

    getUserCount(): number {
        return this.userCount;
    }


}
