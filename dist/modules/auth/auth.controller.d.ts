import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<Partial<import("../user/user.schema").User>>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
    }>;
}
