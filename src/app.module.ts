import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ConvertModule } from './convert/convert.module';
import { DataModule } from './data/data.module';

const enviroment = process.env.NODE_ENV || 'development';
@Module({
  imports: [
    ConvertModule,
    ConfigModule.forRoot({
      envFilePath: `.env.${enviroment}`,
      isGlobal: true,
    }),
    DataModule
  ],
})
export class AppModule {}
