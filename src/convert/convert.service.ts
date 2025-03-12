import { Injectable } from '@nestjs/common';
import { convertFiles } from 'src/utils/convert-functions';

@Injectable()
export class ConvertService {
  async convert(
    file: Express.Multer.File,
    fromFormat: string,
    toFormat: string,
  ): Promise<any> {
    const methodName = `${fromFormat}-to-${toFormat}`;
    const pdfBuffer = await convertFiles(methodName, file);
    return pdfBuffer;
  }
}
