import { Controller, Get, Param, Req, Res, HttpCode, Header, HttpStatus} from '@nestjs/common';
import { DataService } from './data.service';
import { Response } from 'express';

@Controller('data')
export class DataController {
  constructor(private dataService: DataService) {}
 /*   getFile(@Param('file') file: string) {
    this.dataService.getFilePath(file);
  } */
  @Get(':file')
  findAll(@Param('file') file: string, @Res() res: Response){
    this.dataService.getFilePath(file, res);
 }
}
