import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject:[ConfigService],
      useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'db'),
        port: +configService.get<number>('DB_PORT', 5432),
        username: configService.get('DB_USER', 'postgres'),
        password: configService.get('DB_PASSWORD', 'admin'),
        database: configService.get('DB_DATABASE', 'taskmanagement'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('DB_SYNCHRONIZE', true),
      })
    }),
    TasksModule,
    AuthModule
  ],
})
export class AppModule {}
