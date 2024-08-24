//import { PartialType } from '@nestjs/mapped-types'; //sin documentacion
import { PartialType } from '@nestjs/swagger'; // con documentacion
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
