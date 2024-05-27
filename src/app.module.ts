import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieModule } from './movie/movie.module';
import { Movie } from './entity/Movie';
import { User } from './entity/User';

@Module({
  imports: [
    AuthModule,
    MovieModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || '123456',
      database: process.env.DB_NAME || 'mks-db',
      entities: [User, Movie],
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [JwtService],
})
export class AppModule {}
