import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { GameEntity } from './entities/game.entity';
import { GameModule } from './game/game.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './db/mydatabase.sqlite',
      entities: [UserEntity, GameEntity],
      synchronize: true, // Set to false in production
    }),
    GameModule,
    UserModule,
  ],
})
export class AppModule {}
