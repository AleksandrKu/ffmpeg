import { Controller, Post, Get, Req, Param } from '@nestjs/common';
import { Request } from 'express';
import { ConvertService } from './convert.service';

@Controller('convert')
export class ConvertController {
  constructor(private convertService: ConvertService) {}
  @Post()
  convert(@Req() request: Request): string {
    const host = request.headers.host
    const response = this.convertService.convert(request.body.url, host);
    return response;
  }
  @Get(':pid')
  stopConvert(@Param('pid') pid: string): string {
    const response = this.convertService.stopConvert(pid);
    return response;
  }
}
