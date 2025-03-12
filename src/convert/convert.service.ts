import { Injectable } from '@nestjs/common';

@Injectable()
export class ConvertService {
  convert(
    file: Express.Multer.File,
    fromFormat: string,
    toFormat: string,
  ): any {
    const fileName = file.originalname;
    return {
      fileName,
      fromFormat,
      toFormat,
    };
  }
}
