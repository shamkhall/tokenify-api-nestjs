import { ApiProperty } from "@nestjs/swagger";

enum FileTypes {
  JPEG = 'jpeg',
  JPG = 'jpg',
  PNG = 'png'
}

export class FileExtensionResponseDto {
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  message: string;
  @ApiProperty({ name: 'valid_types', enum: FileTypes })
  validTypes: FileTypes;
  @ApiProperty()
  error: string;
}
