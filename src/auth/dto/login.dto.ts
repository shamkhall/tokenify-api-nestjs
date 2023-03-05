import {IsNotEmpty, IsNumber, IsOptional, IsString} from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'username' })
  username: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'password' })
  password: string;

  @Expose({ name: 'device_id' })
  @IsString()
  @IsOptional()
  @ApiProperty({ name: 'device_id' })
  deviceId: string | undefined;

  @Expose({ name: 'imei' })
  @IsString()
  @IsOptional()
  @ApiProperty({ name: 'imei' })
  imei: string | undefined;
}
