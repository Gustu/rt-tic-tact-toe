import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "./user.entity";
import {GameState} from "../game/types";

@Entity('game')
export class GameEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'json'})
    state: GameState;

    @Column()
    initiatorPlayerId: number;

    @Column({nullable: true})
    counterPartyPlayerId: number | null;

    @ManyToOne(() => UserEntity, user => user.initiatorGames, {nullable: false})
    initiatorPlayer: UserEntity;

    @ManyToOne(() => UserEntity, user => user.counterPartyGames, {nullable: true})
    counterPartyPlayer: UserEntity | null;
}