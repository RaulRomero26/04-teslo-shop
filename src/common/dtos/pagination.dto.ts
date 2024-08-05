import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";


export class PaginationDto {
    
    @IsOptional()
    @IsNumber()
    @Type(() => Number) //Esto es lo mismo que el enableImplicitConversion: true
    limit?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    offset?: number;

}