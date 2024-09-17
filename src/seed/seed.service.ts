import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { User } from 'src/auth/entities/user.entity';


@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async runseed() {
    await this.deleteTables();
    const adminUser = await this.insertUsers();
    await this.insertNewProduct(adminUser);
    return 'This action adds a new seed';
  }

  private async deleteTables(){
    await this.productsService.delleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
    .delete()
    .where({})
    .execute();

  }

  private async insertUsers() {
    const seedUsers = initialData.users;
    const users:User[] = [];
    seedUsers.forEach(u => {
      users.push(this.userRepository.create(u));
    });
    const dbUsers = await this.userRepository.save(seedUsers);
    return dbUsers[0];
  }

  private async insertNewProduct(user:User) {
    this.productsService.delleteAllProducts();
    const product = initialData.products;
    const insertPromise = [];
    product.forEach(prod => {
      this.productsService.create(prod,user); 
      insertPromise.push()
    });
    await Promise.all(insertPromise);
    return true;
  }

}
