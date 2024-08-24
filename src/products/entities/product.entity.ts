import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";


@Entity({name: 'products'})
export class Product {

    @ApiProperty({
        example:"06a517a8-c71a-4049-a362-513e7af9479e",
        description: "Product ID",
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example:"Kids 3D T Logo Tee",
        description: "Product title",
        uniqueItems: true,
    })
    @Column('text',{
        unique: true,
    })
    title: string;

    @ApiProperty({
        example:0,
        description: "Product price",
    })
    @Column('float',{
        default: 0,
    })
    price: number;

    @ApiProperty({
        example: "Designed for fit, comfort and style, the Tesla T Logo Tee is made from 100% Peruvian cotton and features a silicone-printed T Logo on the left chest.",
        description: "Product description",
        default: null
    })
    @Column({
        type: 'text',
        nullable: true,
    })
    description: string;
    
    @ApiProperty({
        example:"kids_3d_t_logo_tee",
        description: "Product slug for SEO routes",
        uniqueItems: true,
    })
    @Column('text',{
        unique: true,
    })
    slug: string;

    @ApiProperty({
        example:10,
        description: "Product stock",
        default: 0,
    })
    @Column('int',{
        default: 0,
    })
    stock: number;

    @ApiProperty({
        example:["XS","S","M"],
        description: "Product sizes",
    })
    @Column('text',{
        array: true,
    })
    sizes: string[];

    @ApiProperty({
        example:'women',
        description: "Product gender",
    })
    @Column('text')
    gender: string;

    @ApiProperty()
    @Column('text',{
       array: true,
       default: [],
    })
    tags: string[];
    
    @ApiProperty()
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        {
            cascade: true,
            eager: true,
        }
    )
    images: ProductImage[];

    @ManyToOne(
        () => User,
        (user) => user.product,
        {
            eager: true,
        }
    )
    user: User;

    @BeforeInsert()
    checkSlugInsert(){
        if(!this.slug){
            this.slug = this.title
        }
        
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'');
    }

    @BeforeUpdate()
    checkSlugUpdate(){
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'');
    }
}