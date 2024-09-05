import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { validate as IsUUID } from 'uuid';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { ProductImage } from './entities';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly producRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly producImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,
  ) { }

  async create(createProductDto: CreateProductDto) {
    try {

      const { images = [], ...productDetails } = createProductDto;

      const product = this.producRepository.create({
        ...createProductDto,
        images: images.map(image => this.producImageRepository.create({ url: image })),
      });
      await this.producRepository.save(product); //? Guardamos en la bdd

      return { ...product, images };

    } catch (error) {
      this.handleDbException(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto
      const products = await this.producRepository.find({
        take: limit,
        skip: offset,
        relations: {
          images: true
        }
      });
      return products.map(({ images, ...rest }) => (
        {
          ...rest,
          images: images.map(img => img.url)
        }
      ));
    } catch (error) {
      this.handleDbException(error);
    }
  }

  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images.map(img => img.url)
    }
  }

  async findOne(term: string) {
    let product: Product;
    if (IsUUID(term)) {
      product = await this.producRepository.findOneBy({ id: term });
    } else {
      // product = await this.producRepository.findOneBy({ slug: term });
      const queryBuilder = this.producRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where(`UPPER(title) =:title or slug =:slug`, {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    }

    if (!product) throw new NotFoundException(`Product not found with id ${term}`);
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const { images, ...toUpdate } = updateProductDto;

    const product = await this.producRepository.preload({
      id,
      ...toUpdate,
    });

    if (!product) throw new NotFoundException(`Product not found with id ${id}`);

    //? Creamos el query runner

    const queryRunner = this.dataSource.createQueryRunner();
    


    try {
      return await this.producRepository.save(product);
    } catch (error) {
      this.handleDbException(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.producRepository.remove(product);

  }

  //? Manejamos las excepciones de la base de datos
  private handleDbException(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
