import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TypeUser } from "../enums/user.enum";

@Entity({
    name: 'User'
})
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    fullName: string;

    @Column('text', { unique: true })
    userName: string;

    @Column('text')
    password: string;

    @Column('text', {
        array: true,
        default: TypeUser.user
    })
    role: string;

    @Column('boolean', {
        default: false,
    })
    isActive: boolean;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @OneToMany(
        () => User,
        user => user.user,
        { cascade: true }
    )
    users?: Array<User>

    @ManyToOne(
        () => User,
        user => user.users,
        // { onDelete: 'CASCADE' }
    )
    @JoinColumn({ name: 'createdBy' })
    user: User
}
