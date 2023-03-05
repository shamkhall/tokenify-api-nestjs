import Hashids from 'hashids';
import { Config } from "../config/config";
import { BadRequestException } from "@nestjs/common";

export class HashidsUtil {
  hashids: Hashids;

  constructor() {
    this.hashids = new Hashids(
      Config.HASH_ID_SALT,
      parseInt(Config.HASH_ID_LENGTH.toString()),
    );
  }
  
  decodeId(_id: number | string | undefined): number | undefined {
    try {
      let decodedId = [];
      if (_id) {
        decodedId = this.hashids.decode(_id.toString());
      }
      return decodedId[0];
    }
    catch {
      return undefined
    }

  }

  encodeId(_id: any) {
    try {
      let encodedId = '';
      if (_id) {
        encodedId = this.hashids.encode(_id);
      }
      return encodedId === '' ? undefined : encodedId;
    }
    catch {
      return undefined;
    }
  }
}
