import { Injectable, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
@Injectable()
export class DataService {
  async getFilePath(file: string, res: Response): Promise<any> {
    const pathPidCollection = './database/pid-collection.json';
    let pidCollection = {};
    if (fs.existsSync(pathPidCollection)) {
      const pidCollectionBuffer = fs.readFileSync(pathPidCollection, 'utf8');
      pidCollection = JSON.parse(pidCollectionBuffer);
    }
    let folder;
    let name = file.split('.')[0];
    name = name.replace(/[^a-z]/g, '');
    for(const pid in pidCollection) {
      if(!folder && pidCollection[pid].fileName === name.toLowerCase()) {
        folder = pidCollection[pid].folder;
        break;
      }
    }
      const filePath = `./video/${folder}/${file}`;
      res.status(HttpStatus.OK).download(filePath);
  }
}
