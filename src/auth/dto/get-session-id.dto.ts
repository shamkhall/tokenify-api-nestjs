import { Expose } from "class-transformer";
import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GetSessionIdDto {
    @Expose({name: '_session_id'})
    @ApiProperty({name: '_session_id'})
    @IsString()
    sessionId: string;
}
