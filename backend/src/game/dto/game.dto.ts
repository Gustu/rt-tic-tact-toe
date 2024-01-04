import {GameState} from "../types";

export type GameDto = {
    id: number;
    state: GameState;
    initiatorPlayer: string;
    counterPartyPlayer: string;
}