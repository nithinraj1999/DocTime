import { container } from 'tsyringe';
import { IAuthService } from '../interfaces/IAuthService';
import { AuthService } from '../services/authServices';

import { IUserRepository } from '../interfaces/IUserRepository';
import { UserRepository } from '../repositories/userRepository';
import { AuthController } from '../controllers/users/authController';
import { IProfileServices } from '../interfaces/IProfileServices';
import { ProfileServices } from '../services/user/profileServices';
import { ProfileController } from '../controllers/users/profileController';

import { EmailService } from '../config/nodeMailer';


import { IDoctorProfileServices } from '../interfaces/IDoctorProfileServices';
import { DoctorProfileService } from '../services/doctor/profileServices';
import { DoctorProfileController } from '../controllers/doctors/profileController';
import { IDoctorRepository } from '../interfaces/IDoctorRepository';
import { DoctorRepository } from '../repositories/doctorRepostitory';
container.register<IUserRepository>('IUserRepository', { useClass: UserRepository });
container.register<IAuthService>('IAuthService', { useClass: AuthService });
container.register<AuthController>('AuthController', { useClass: AuthController })


container.register<IProfileServices>('IProfileServices', { useClass: ProfileServices });
container.register<ProfileController>('ProfileController', { useClass: ProfileController });


container.register<EmailService>('IEmailService', { useClass: EmailService });


container.register<IDoctorRepository>('IDoctorRepository', { useClass: DoctorRepository });


container.register<IDoctorProfileServices>("IDoctorProfileServices", {
  useClass: DoctorProfileService,
});
container.register<DoctorProfileController>("DoctorProfileController", {
  useClass: DoctorProfileController,
});

