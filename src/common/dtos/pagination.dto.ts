import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";


export class PaginationDto {
    
    @ApiProperty({
        default: 10,
        description: "The number of items to return",
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number) //Esto es lo mismo que el enableImplicitConversion: true
    limit?: number;

    @ApiProperty({
        default: 0,
        description: "The number of items to skip",
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    offset?: number;

}