import { ApiProperty } from '@nestjs/swagger';

export class HttpExceptionResponseDto {
  @ApiProperty()
  status: number;
  @ApiProperty()
  error: string;
  @ApiProperty()
  message: string;
  @ApiProperty({ name: 'affected_columns', type: Array })
  affectedColumns: Array<string>
  @ApiProperty()
  timestamp: Date;
}
