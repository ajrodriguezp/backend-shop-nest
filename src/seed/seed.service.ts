import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';


@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) { }
  async runseed() {
    await this.insertNewProduct();
    return 'This action adds a new seed';
  }

  private async insertNewProduct() {
    this.productsService.delleteAllProducts();
    const product = initialData.products;
    const insertPromise = [];
    product.forEach(prod => {
      this.productsService.create(prod); insertPromise.push()
    });
    await Promise.all(insertPromise);
    return true;
  }

}
