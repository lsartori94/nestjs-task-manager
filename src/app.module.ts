import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';

// TODO add async provider for config via .env
// const typeOrmProvider = {
//   imports: [ConfigModule],
//   useFactory: (configService: ConfigService) => ({
//     type: 'mysql',
//     host: configService.get('DB_HOST', 'db'),
//     port: +configService.get<number>('DB_PORT', '5432'),
//     username: configService.get('DB_USERNAME', 'admin'),
//     password: configService.get('DB_PASSWORD', 'admin'),
//     database: configService.get('DB_DATABASE', 'taskmanagement'),
//     entities: [__dirname + '/**/*.entity{.ts,.js}'],
//     synchronize: true,
//   }),
//   inject: [ConfigService],
// }
@Module({
  imports: [
    ConfigModule.forRoot(),
    // TypeOrmModule.forRootAsync(typeOrmProvider),
    TypeOrmModule.forRoot(typeOrmConfig),
    TasksModule,
    AuthModule
  ],
})
export class AppModule {}
