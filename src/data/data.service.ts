import { Injectable, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class DataService {
  async getFilePath(file: string, res: Response): Promise<any> {
      const folder = file.split('.')[0];
      //const filePath = `./video/${folder}/${file}`;
      const filePath = `./video/syncTest/${file}`
      console.log(filePath);
      res.status(HttpStatus.OK).download(filePath);
  }
}
