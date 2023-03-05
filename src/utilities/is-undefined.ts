import { BadRequestException } from '@nestjs/common';

type DecodedIDType = {
  id: any;
  name: string;
};

export function isUndefined(DecodedIDs: Array<DecodedIDType>) {
  DecodedIDs.forEach((DecodedID) => {
    if (DecodedID.id === undefined) {
      throw new BadRequestException(`${DecodedID.name} ID is not correct`);
    }
  });
}
