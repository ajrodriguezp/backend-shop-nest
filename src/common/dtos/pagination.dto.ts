import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";

export class PaginationDto {
    @ApiProperty({
        default: 10,
        description: 'The number of items to return',
        minimum: 1,
    })
    @IsOptional()
    @IsPositive()
    @Type(() => Number) //? Convertir a tipo number
    limit?: number;

    @ApiProperty({
        default: 0,
        description: 'The number of items to skip before starting to collect the result set',
        minimum: 0,
    })
    @IsOptional()
    @Type(() => Number) //? Convertir a tipo number
    offset?: number;
}