import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { VideosModule } from './videos/videos.module';

@Module({
  imports: [VideosModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
