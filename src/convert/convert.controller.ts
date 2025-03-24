import {
  Controller,
  Get,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';

import { ConvertService } from './convert.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('convert')
export class ConvertController {
  constructor(private readonly convertService: ConvertService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileAndValidate(
    @UploadedFile()
    file: Express.Multer.File,
    @Query('from') fromFormat: string,
    @Query('to') toFormat: string,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const maxSize = 3 * 1024 * 1024;
      if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      if (file.size > maxSize) {
        return res
          .status(400)
          .json({ message: 'File too big - max size is 3MB' });
      }
      if (fromFormat === toFormat) {
        return res
          .status(400)
          .json({ message: 'The same format for both from and to' });
      }

      const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
      if (fileExtension !== fromFormat) {
        return res.status(400).json({
          message: 'Difference between chosen extension and uploaded file',
        });
      }

      const convertedBuffer = await this.convertService.convert(
        file,
        fromFormat,
        toFormat,
      );

      const mimeTypes: Record<string, string> = {
        pdf: 'application/pdf',
        png: 'image/png',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
      };

      const mimeType = mimeTypes[toFormat] || 'application/octet-stream';

      const newFileName = file.originalname.replace(
        /\.[^/.]+$/,
        `.${toFormat}`,
      );

      res.set({
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename=${newFileName}`,
      });

      return res.send(convertedBuffer);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
