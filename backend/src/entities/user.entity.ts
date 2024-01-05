import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {GameEntity} from "./game.entity";

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    login: string;

    @Column()
    passwordHash: string;

    @OneToMany(() => GameEntity, game => game.initiatorPlayer)
    initiatorGames: GameEntity[];

    @OneToMany(() => GameEntity, game => game.counterPartyPlayer)
    counterPartyGames: GameEntity[];

}