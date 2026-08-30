import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth/auth.controller';
import { UsersController } from './controllers/users.controller';
import { AuthService } from './services/auth/auth.service';
import { UsersService } from './services/users.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User } from './database/entities/user.entity';
import { dataSourceOptions } from './database/data-source';
import { ScheduleModule } from '@nestjs/schedule';
import { FilesController } from './controllers/file/file.controller';
import { FilesService } from './services/files/files.services';
import { FilesCleanService } from './services/files/files-clean.service';
import { FileEntity } from './database/entities/file.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([User,FileEntity]), // Pour injecter les repositories
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController, UsersController, FilesController],
  providers: [AuthService, UsersService, JwtStrategy, FilesService, FilesCleanService],
})
export class AppModule {}
