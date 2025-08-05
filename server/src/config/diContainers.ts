import { container } from 'tsyringe';
import { IAuthService } from '../interfaces/IAuthService';
import { AuthService } from '../services/authServices';

import { IUserRepository } from '../interfaces/IUserRepository';
import { UserRepository } from '../repositories/userRepository';
import { AuthController } from '../controllers/patients/authController';

container.register<IUserRepository>('IUserRepository', { useClass: UserRepository });
container.register<IAuthService>('IAuthService', { useClass: AuthService });
container.register<AuthController>('AuthController', { useClass: AuthController })
