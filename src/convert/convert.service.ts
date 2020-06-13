import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { spawn, exec } from 'child_process';
import  * as url from 'url';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ConvertService {
  constructor(private readonly configService: ConfigService) {}
  private videoPath = this.configService.get<string>('videoPath');

  convert(sourceVideoPath: string, host: string): string {
    const folder = uuidv4();
    const { pathname } = url.parse(sourceVideoPath);
    const paths = pathname.split('/')
    const nameFile = paths[paths.length - 1];
    const name = nameFile.split('.')[0];
    console.log(name);
    if (!fs.existsSync('./video')){
      fs.mkdirSync('./video');
    }
    const dir = `./video/${folder}`;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    const fileName = `${name}.m3u8`;
    const convertVideoPath = `${dir}/${fileName}`;
    console.log(sourceVideoPath);
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
    '-preset:v', 'superfast',
    '-s', '640:-2',
    '-ac', '2',
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
    const childPid = child.pid;
    const pathPidCollection = './database/pid-collection.json';
    if (!fs.existsSync('./database/')) fs.mkdirSync('./database/');
    let pidCollection = {};
    if (fs.existsSync(pathPidCollection)) {
      const pidCollectionBuffer = fs.readFileSync(pathPidCollection, 'utf8');
      pidCollection = JSON.parse(pidCollectionBuffer);
    }
    pidCollection[`${childPid}`] = { fileName: name.replace(/[^a-z]/g, ''), folder };
    console.log(pidCollection); 
    const data = JSON.stringify(pidCollection);
    fs.writeFileSync(pathPidCollection, data);

   /*child.stdout.on('data', (data) => {
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
      url: `http://${host}/data/${name}.m3u8`,
      childPid: child.pid
    }
    return JSON.stringify(response);
  }

  stopConvert(pid: string): string {

    const pathPidCollection = './database/pid-collection.json';
    if (!fs.existsSync('./database/')) fs.mkdirSync('./database/');
    let pidCollection = {};
    if (fs.existsSync(pathPidCollection)) {
      const pidCollectionBuffer = fs.readFileSync(pathPidCollection, 'utf8');
      pidCollection = JSON.parse(pidCollectionBuffer);
    }
    const deletedProcess = pidCollection[`${pid}`];
    const deletedFolder = deletedProcess.folder;
    delete pidCollection[`${pid}`];
    
    console.log({ deletedFolder });
    console.log({ pidCollection }); 
    const data = JSON.stringify(pidCollection);
    fs.writeFileSync(pathPidCollection, data);

    console.log(pid);
    exec(`kill -9 ${pid}`, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log({ stdout });
      console.log({ stderr });
    });
    if (fs.existsSync(`./video/${deletedFolder}`)) {
    exec(`rm -r -f ./video/${deletedFolder}`, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Delete folder');
      console.log({ stdout });
      console.log({ stderr });
    });
    }
    return 'ok'
  }
}
