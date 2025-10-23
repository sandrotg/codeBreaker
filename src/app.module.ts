import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './presentation/users/modules/users.module';
import { join } from 'path';
import * as path from "path"
@Module({
  imports: [
    ConfigModule.forRoot({ 
      envFilePath: path.resolve(__dirname, '../../../.env'),
      isGlobal: true
     }),
    UsersModule
  ],
})
export class AppModule {}
