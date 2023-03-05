import { existsSync, writeFile } from 'fs';
import { mkdir } from 'fs/promises';
import { BadRequestException } from '@nestjs/common';

export async function createImage(
  image: string,
  imageName: string,
  path: string,
) {
  const parent = '.';
  const dirNames = path.split('/');

  let folderName = '';
  for (let i = 0; i < dirNames.length; i++) {
    folderName += `/${dirNames[i]}`;
    if (!existsSync(`.${folderName}`)) {
      await mkdir(`${parent}${folderName}`);
    }
  }

  writeFile(`./${path}/${imageName}`, image, (error) => {
    if (error) {
      throw new BadRequestException(error.message);
    }
  });
}
