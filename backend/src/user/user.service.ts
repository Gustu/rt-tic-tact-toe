import {BadRequestException, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../db/user.entity";
import {Repository} from "typeorm";
import {compare, hash} from "bcrypt";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService
    ) {
    }

    async createUser(login: string, password: string): Promise<string> {
        const existingUser = await this.findUser(login);

        if (existingUser) {
            throw new BadRequestException('User already exists');
        }

        const passwordHash = await hash(password, 10);
        const user = this.userRepository.create({login, passwordHash});
        const savedUser = await this.userRepository.save(user);

        return this.jwtService.sign({id: savedUser.id});
    }

    async findUser(login: string): Promise<UserEntity | null> {
        return await this.userRepository.findOne({where: {login}});
    }

    async login(login: string, password: string): Promise<string | null> {
        const user = await this.findUser(login);
        if (!user) {
            return undefined;
        }
        const isPasswordCorrect = await compare(password, user.passwordHash);

        if (!isPasswordCorrect) {
            return null;
        }

        return this.jwtService.sign({id: user.id});
    }

}