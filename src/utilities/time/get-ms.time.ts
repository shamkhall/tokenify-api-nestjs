import { BadRequestException } from '@nestjs/common';

export function getExpTime(str: string) {
  try {
    const tMillis = {
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };
    const count: any = str.match(/[0-9]+/)[0];
    const time = str.match(/[a-z]/)[0];

    const keys = Object.keys(tMillis);

    const current = new Date().getTime();
    for (const key of keys) {
      if (key === time) {
        return current + (count * tMillis[key]);
      }
    }
  }
  catch {
    throw new BadRequestException('Invalid data type');
  }
}
