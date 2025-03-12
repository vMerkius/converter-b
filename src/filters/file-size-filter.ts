import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  private readonly maxSize = 3 * 1024 * 1024;

  transform(value: Express.Multer.File) {
    if (value.size > this.maxSize) {
      throw new BadRequestException(
        `File size too large. Max size is ${this.maxSize / 1024 / 1024}MB`,
      );
    }

    return value;
  }
}
