import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User, UserDocument } from '../user/user.schema';
export declare class AuthService {
    private userService;
    private jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    validateUser(username: string, password: string): Promise<UserDocument | null>;
    login(user: UserDocument): {
        access_token: string;
    };
    register(username: string, password: string): Promise<Partial<User>>;
}
