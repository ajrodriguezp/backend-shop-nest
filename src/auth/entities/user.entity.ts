import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, nullable: false, type: 'text' })
    email: string;

    @Column({ nullable: false, type: 'text' })
    password: string;

    @Column({ nullable: false, type: 'text' })
    fullName: string;

    @Column({ nullable: false, type: 'bool', default: true })
    isActive: boolean;

    @Column({ nullable: false, type: 'text', array: true, default: ['user'] })
    roles: string[];
}
