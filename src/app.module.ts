import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { VideosModule } from './videos/videos.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProfilesService } from './profiles/profiles.service';

@Module({
  imports: [VideosModule, UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, ProfilesService],
})
export class AppModule {}
