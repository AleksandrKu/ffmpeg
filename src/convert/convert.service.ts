import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { spawn, exec } from 'child_process';
import  * as url from 'url';
import * as fs from 'fs';

@Injectable()
export class ConvertService {
  constructor(private readonly configService: ConfigService) {}
  private videoPath = this.configService.get<string>('videoPath');

  convert(sourceVideoPath: string): string {
    const { pid } = process;
    const { pathname } = url.parse(sourceVideoPath);
    const paths = pathname.split('/')
    const nameFile = paths[paths.length - 1];
    const name = nameFile.split('.')[0];
    console.log(name);
    const dir = `./video/${name}`;
    console.log({ pid });
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    const convertVideoPath = `${dir}/${name}.m3u8`;
    console.log(sourceVideoPath);
    //sourceVideoPath = 'https://fv9-2.failiem.lv/down.php?i=2p87fpfu&download_checksum=225839eda93e8f6559ba837c5744ce7166acc70c&download_timestamp=1591906986';
    const child = spawn('ffmpeg',[
    '-re', 
    '-stream_loop', '-1',
    '-i', 
    sourceVideoPath,
    '-c:a', 'aac',
    '-c:v', 'libx264',
    '-ar', '48000',
    '-b:a', '128k',
    '-keyint_min', '24',
    '-g', '24',
    '-r', '24',
    '-f', 'hls',
    //'-hls_list_size', '2',
    //'-hls_time', '1',
    convertVideoPath
    ],
     {
      detached: true, //false
      stdio: 'ignore'
    }
    );
    console.log(child.pid);
    
/*      child.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    
    child.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    }); */
    
    child.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
    child.unref();
    const response = {
      url: convertVideoPath,
      pid: pid,
      childPid: child.pid
    }
    return JSON.stringify(response);
  }

  stopConvert(pid: string): string {
    console.log(pid);
    exec(`kill -9 ${pid}`, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log({ stdout });
      console.log({ stderr });
    });
    return 'ok'
  }
}
