import {IsInt} from "class-validator";

export class PlayerMoveDto {
    @IsInt()
    row: number;

    @IsInt()
    column: number;
}