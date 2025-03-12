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
import { FileSizeValidationPipe } from 'src/filters/file-size-filter';
import { FileValidationPipe } from 'src/filters/file-filter';

@Controller('convert')
export class ConvertController {
  constructor(private readonly convertService: ConvertService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileAndValidate(
    @UploadedFile(new FileValidationPipe(), new FileSizeValidationPipe())
    file: Express.Multer.File,
    @Query('from') fromFormat: string,
    @Query('to') toFormat: string,
    @Res() res: Response,
  ): Promise<any> {
    const pdfBuffer = await this.convertService.convert(
      file,
      fromFormat,
      toFormat,
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${file.originalname.replace(/\.[^/.]+$/, '-pdf')}.pdf`,
    });

    return res.send(pdfBuffer);
  }
}
