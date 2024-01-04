import {IsString, Max, MaxLength, Min, MinLength} from "class-validator";

export class CreateUserDto {
    @IsString()
    login: string;

    @IsString()
    @MinLength(6)
    @MaxLength(32)
    password: string;
}