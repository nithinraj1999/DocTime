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

import { IDoctorAuthService } from '../interfaces/IDoctorAuthService';
import { DoctorAuthController } from '../controllers/doctors/authController';
import { DoctorAuthService } from '../services/doctor/authServices';

import { IAdminAuthService } from '../interfaces/IAdminAuthServices';
import { AdminAuthService } from '../services/admin/adminAuthServices';
import { AdminAuthController } from '../controllers/admin/adminAuthController';

import { IUserMgtService } from '../interfaces/IUserMgtServices';
import { UserMgtService } from '../services/admin/userMgtServices';
import { AdminUserMgtController } from '../controllers/admin/userMgtController';
container.register<IUserRepository>('IUserRepository', { useClass: UserRepository });
container.register<IAuthService>('IAuthService', { useClass: AuthService });
container.register<AuthController>('AuthController', { useClass: AuthController })


container.register<IProfileServices>('IProfileServices', { useClass: ProfileServices });
container.register<ProfileController>('ProfileController', { useClass: ProfileController });


container.register<EmailService>('IEmailService', { useClass: EmailService });


container.register<IDoctorAuthService>('IDoctorAuthService', { useClass: DoctorAuthService });
container.register<DoctorAuthController>('DoctorAuthController', { useClass: DoctorAuthController });

container.register<IDoctorRepository>('IDoctorRepository', { useClass: DoctorRepository });


container.register<IDoctorProfileServices>("IDoctorProfileServices", {
  useClass: DoctorProfileService,
});
container.register<DoctorProfileController>("DoctorProfileController", {
  useClass: DoctorProfileController,
});





container.register<IAdminAuthService>('IAdminAuthService', { useClass: AdminAuthService });
container.register<AdminAuthController>('AdminAuthController', { useClass: AdminAuthController })
 



container.register<IUserMgtService>('IUserMgtService', { useClass: UserMgtService });
container.register<AdminUserMgtController>('AdminUserMgtController', { useClass: AdminUserMgtController })
