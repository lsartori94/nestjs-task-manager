import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'db',
  port: 5432,
  username: 'postgres',
  password: 'admin',
  database: 'taskmanagement',
  entities: [
    `${__dirname}/../**/*.entity.{js, ts}`
  ],
  synchronize: true,
}
