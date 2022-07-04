import { Challenge } from '../entities/challenge.entity';
import { User } from '../entities/user.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const { POSTGRES_PORT } = process.env;
const dbPort = Number(POSTGRES_PORT);

export const DBconfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: '127.0.0.1',
  port: dbPort || 5432,
  username: 'postgres',
  password: 'TurningPoint795381',
  database: 'k_learn',
  entities: [User, Challenge],
  synchronize: false,
};
