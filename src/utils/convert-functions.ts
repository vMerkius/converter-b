import * as sharp from 'sharp';
import { PDFDocument } from 'pdf-lib';

export const convertImgToPdf = async (
  file: Express.Multer.File,
): Promise<Buffer> => {
  const jpegBuffer = await sharp(file.buffer).jpeg().toBuffer();
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();

  const image = await pdfDoc.embedJpg(jpegBuffer);
  const { width, height } = image.scale(1);

  page.setSize(width, height);
  page.drawImage(image, {
    x: 0,
    y: 0,
    width,
    height,
  });
  const pdfBytes = await pdfDoc.save();

  return Buffer.from(pdfBytes);
};
export const convertPngToJpg = async (
  file: Express.Multer.File,
): Promise<Buffer> => {
  return await sharp(file.buffer).jpeg().toBuffer();
};

export const convertJpgToPng = async (
  file: Express.Multer.File,
): Promise<Buffer> => {
  return await sharp(file.buffer).png().toBuffer();
};

export const conversionMethods = {
  'png-to-pdf': convertImgToPdf,
  'jpg-to-pdf': convertImgToPdf,
  'jpeg-to-pdf': convertImgToPdf,
  'png-to-jpg': convertPngToJpg,
  'png-to-jpeg': convertPngToJpg,
  'jpg-to-png': convertJpgToPng,
  'jpeg-to-png': convertJpgToPng,
};

export const convertFiles = (method: string, file: Express.Multer.File) => {
  const conversionFn = conversionMethods[method];
  if (!conversionFn) {
    throw new Error(`Conversion method '${method}' not found`);
  }
  return conversionFn(file);
};
