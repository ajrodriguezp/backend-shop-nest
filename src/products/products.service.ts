import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as IsUUID } from 'uuid';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly producRepository: Repository<Product>,
  ) { }

  async create(createProductDto: CreateProductDto) {
    try {

      const product = this.producRepository.create(createProductDto);
      await this.producRepository.save(product); //? Guardamos en la bdd

      return product;

    } catch (error) {
      this.handleDbException(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto
      return await this.producRepository.find({
        take: limit,
        skip: offset
      });
    } catch (error) {
      this.handleDbException(error);
    }
  }

  async findOne(term: string) {
    let product: Product;
    if (IsUUID(term)) {
      product = await this.producRepository.findOneBy({ id: term });
    } else {
      // product = await this.producRepository.findOneBy({ slug: term });
      const queryBuilder = this.producRepository.createQueryBuilder();
      product = await queryBuilder.where(`UPPER(title) =:title or slug =:slug`, {
        title: term.toUpperCase(),
        slug: term.toLowerCase()
      }).getOne();
    }

    if (!product) throw new NotFoundException(`Product not found with id ${term}`);
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.producRepository.preload({
      id:id,
      ...updateProductDto
    });
    if (!product) throw new NotFoundException(`Product not found with id ${id}`);

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

  private handleDbException(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
