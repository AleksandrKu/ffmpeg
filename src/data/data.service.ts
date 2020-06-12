import { Injectable, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';

@Injectable()
export class DataService {
  async getFilePath(file: string, res: Response): Promise<any> {
      const folder = file.split('.')[0];
      //const filePath = `./video/${folder}/${file}`;
      const filePath = `./video/syncTest/${file}`
      console.log(filePath);
      const pm4Path = "./video/video_2019-07-20_13-24-58.mp4";
      res.status(HttpStatus.OK).download(filePath);
      //res.status(HttpStatus.OK).download(pm4Path);
      //response.send(readstream)
     // return fs.createReadStream(pm4Path);
  }
}
