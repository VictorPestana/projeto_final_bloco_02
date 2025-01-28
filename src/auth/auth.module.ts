import { forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { UsuarioModule } from '../usuario/usuario.module';
import { jwtConstants } from './constants/constant';
import { AuthService } from '../auth/services/auth.service';
import { Bcrypt } from './bcrypt/bcrypt';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  imports: [
    forwardRef(() => UsuarioModule),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [Bcrypt, AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [Bcrypt],
})
export class AuthModule {}
