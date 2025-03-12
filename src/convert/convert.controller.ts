import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConvertService } from './convert.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileSizeValidationPipe } from 'src/filters/file-size-filter';
import { FileValidationPipe } from 'src/filters/file-filter';

@Controller('convert')
export class ConvertController {
  constructor(private readonly convertService: ConvertService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFileAndValidate(
    @UploadedFile(new FileValidationPipe(), new FileSizeValidationPipe())
    file: Express.Multer.File,
    @Query('from') fromFormat: string,
    @Query('to') toFormat: string,
  ): any {
    return this.convertService.convert(file, fromFormat, toFormat);
  }
}
