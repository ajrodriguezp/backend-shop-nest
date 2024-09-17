import { Product } from "src/products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, nullable: false, type: 'text' })
    email: string;

    @Column({ nullable: false, type: 'text', select: false })
    password: string;

    @Column({ nullable: false, type: 'text' })
    fullName: string;

    @Column({ nullable: false, type: 'bool', default: true })
    isActive: boolean;

    @Column({ nullable: false, type: 'text', array: true, default: ['user'] })
    roles: string[];

    @OneToMany(
        () => Product,
        (product) => product.user
    )
    product:Product

    @BeforeInsert()
    checkEmail() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkEmailUpdate() {
        this.checkEmail();
    }
}
