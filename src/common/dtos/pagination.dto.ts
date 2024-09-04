import { Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";

export class PaginationDto {
    @IsOptional()
    @IsPositive()
    @Type(() => Number) //? Convertir a tipo number
    limit?: number;

    @IsOptional()
    @Type(() => Number) //? Convertir a tipo number
    offset?: number;
}