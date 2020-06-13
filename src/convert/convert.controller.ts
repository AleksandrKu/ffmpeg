import { Controller, Put, Delete, Req, Param } from '@nestjs/common';
import { Request } from 'express';
import { ConvertService } from './convert.service';

@Controller('convert')
export class ConvertController {
  constructor(private convertService: ConvertService) {}
  @Put()
  convert(@Req() request: Request): string {
    const host = request.headers.host
    const response = this.convertService.convert(request.body.url, host);
    return response;
  }
  @Delete(':pid')
  stopConvert(@Param('pid') pid: string): string {
    const response = this.convertService.stopConvert(pid);
    return response;
  }
}
