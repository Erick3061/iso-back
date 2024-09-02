import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { ReportModule } from './report/report.module';
import { ServiceWmModule } from './services/service-wm/service-wm.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: join(__dirname, '..', './database/database.db'),
      synchronize: true,
      autoLoadEntities: true,
    }),
    CommonModule,
    ServiceWmModule,
    UserModule,
    AuthModule,
    ReportModule,
    SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
