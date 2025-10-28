import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './presentation/users/modules/users.module';
import { join } from 'path';
import * as path from "path"
import { RolesModule } from './presentation/users/modules/roles.module';
@Module({
  imports: [
    ConfigModule.forRoot({ 
      envFilePath: path.resolve(__dirname, '../../../.env'),
      isGlobal: true
     }),
    UsersModule,RolesModule
  ],
})
export class AppModule {}
