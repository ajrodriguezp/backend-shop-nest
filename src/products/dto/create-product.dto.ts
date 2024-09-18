import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator"

export class CreateProductDto {

    @ApiProperty({
        description:'The title of the product',
        nullable:false,
        minLength:3
    })
    @IsString()
    @MinLength(3)
    title:string

    @ApiProperty({
        description:'The price of the product',
        nullable:true,
        minimum:0
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?:number

    @ApiProperty({
        description:'The description of the product',
        nullable:true,
        minLength:10
    })
    @IsString()
    @IsOptional()
    @MinLength(10)
    description?:string

    @ApiProperty({
        description:'The slug of the product',
        nullable:true
    })
    @IsString()
    @IsOptional()
    slug?:string

    @ApiProperty({
        description:'The stock of the product',
        nullable:true,
        minimum:0
    })
    @IsInt()
    @IsOptional()
    @IsPositive()
    stock?:number

    @ApiProperty({
        description:'The sizes of the product',
        nullable:false,
        example:['S','M','L','XL']
    })
    @IsString({each:true})
    @IsArray()
    sizes:string[]

    @ApiProperty()
    @IsIn(['men','women','kid','unisex'])
    gender:string

    @ApiProperty({
        description:'The tags of the product',
        nullable:true,
        example:['t-shirt','summer']
    })
    @IsString({each:true})
    @IsArray()
    @IsOptional()
    tags:string[]

    @ApiProperty({
        description:'The images of the product',
        nullable:true,
        example:['url1','url2']
    })
    @IsString({each:true})
    @IsArray()
    @IsOptional()
    images?:string[]

}
