import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

import { validate as isUUID } from 'uuid';
import { Product,ProductImage } from './entities';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');
  
  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource

  ){}
  
  async create(createProductDto: CreateProductDto, user: User) {
    try {
      const {images = [], ...productDetails} = createProductDto;

      const product = this.productRepository.create({
        ...productDetails,
        images: images.map(image => this.productImageRepository.create({url:image})),
        user: user
      });
      await this.productRepository.save(product);

      return {...product, images: images};

    } catch (error) {
        this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto:PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true
      }
    });
    return products.map(({images,...rest}) => (
      {...rest, 
        images: images.map(image => image.url)
      }));
  }

  async findOne(term: string) {

    let product: Product;
    if(isUUID(term)){
      product = await this.productRepository.findOneBy({id:term});
    }else{
      const queryBuilder = this.productRepository.createQueryBuilder('prod');//aca se le da un alias
      product = await queryBuilder
      .where('UPPER(title) =:title or slug =:slug',{
        title:term.toUpperCase(),
        slug:term.toLocaleLowerCase()
      })
      .leftJoinAndSelect('prod.images','prodImages')//con que tabla y un alias
      .getOne();
    }
 
      if(!product){
        throw new NotFoundException(`Product with ${term} not found`);
      }
      return product;

    
  }

  async findOnePlain(term:string){
    const {images = [], ...rest} = await this.findOne(term);
    return{
      ...rest,
      images: images.map(image => image.url)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {

    const {images, ...toUpdate} = updateProductDto;

    const product = await this.productRepository.preload({
      id: id,
      ...toUpdate,
    })

    if(!product){
      throw new NotFoundException(`Product with ${id} not found`);
    }

    //Create Query runner

    const queryRunner = this.dataSource.createQueryRunner(); //se usa el datasource para que tenga la conexion pero para que no venga de la entidad
    await queryRunner.connect();
    await queryRunner.startTransaction();


    try {

      if(images){
        //se puede hacer asi ya que es la columna de relacion typeorm ya sabe a que tabla afectar, aunque igual se puede productId
        await queryRunner.manager.delete(ProductImage,{product: {id: id}});//se puede poner asi

        product.images = images.map(
          image => this.productImageRepository.create({url:image})
        );
      }

      product.user = user;
      await queryRunner.manager.save(product);

      //await this.productRepository.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      //Si se usa esa insruccion ya no hace falta el else y se devuelven las imagenes
      //return this.findOnePlain(id);
      return product;
    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleDBExceptions(error);  
    }
  }

  async remove(id: string) {
    
    const product = await this.findOne(id);
    if(!product){
      throw new NotFoundException(`Product with ${id} not found`);
    }
    await this.productRepository.remove(product); 
  }

  private handleDBExceptions(error:any){
    if(error.code == '23505'){
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error check server logs'); 

  }

  async deleteAllProducts(){
    const query = this.productRepository.createQueryBuilder('product');

    try {
      return await query
      .delete()
      .where({})
      .execute();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }
}
