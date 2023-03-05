import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetDeviceIdDto {
  @Expose({ name: '_device_id' })
  @IsNumber()
  deviceId: number;
}
