import {Body, Controller, Get, Param, Post, Query, UseGuards} from '@nestjs/common';
import {GameService} from "./game.service";
import {GameDto} from "./dto/game.dto";
import {User} from "../common/user.decorator";
import {IUser} from "../common/user";
import {AuthGuard} from "../common/auth.guard";
import {PlayerMoveDto} from "./dto/player-move.dto";
import {PlayerMove} from "./types";


@UseGuards(AuthGuard)
@Controller('/games')
export class GameController {
    constructor(private readonly gameService: GameService) {
    }

    @Get()
    async listGames(): Promise<GameDto[]> {
        const games = await this.gameService.listAllGames();
        return games.map((game): GameDto => {
            return {
                id: game.id,
                state: game.state,
                initiatorPlayer: game.initiatorPlayer.login,
                counterPartyPlayer: game.counterPartyPlayer?.login,
            };
        });
    }

    @Get('/:id')
    async getGame(
        @Param('id') id: number
    ): Promise<GameDto> {
        const game = await this.gameService.getGame(id);
        return {
            id: game.id,
            state: game.state,
            initiatorPlayer: game.initiatorPlayer.login,
            counterPartyPlayer: game.counterPartyPlayer?.login,
        };
    }

    @Post('join')
    async joinGame(
        @User() user: IUser,
        @Query('gameId') gameId: number | null
    ): Promise<GameDto> {
        const game = await this.gameService.joinGame(user.id, gameId);
        return {
            id: game.id,
            state: game.state,
            initiatorPlayer: game.initiatorPlayer.login,
            counterPartyPlayer: game.counterPartyPlayer?.login,
        };
    }

    @Post()
    async newGame(
        @User() user: IUser,
    ): Promise<GameDto> {
        const game = await this.gameService.createGame(user.id);
        return {
            id: game.id,
            state: game.state,
            initiatorPlayer: game.initiatorPlayer.login,
            counterPartyPlayer: game.counterPartyPlayer?.login,
        };
    }

    @Post('/:id/play')
    async playMove(
        @User() user: IUser,
        @Param('id') id: number,
        @Body() dto: PlayerMoveDto
    ): Promise<GameDto> {
        const move: PlayerMove = [dto.row, dto.column];
        const game = await this.gameService.playMove(id, user.id, move);
        return {
            id: game.id,
            state: game.state,
            initiatorPlayer: game.initiatorPlayer.login,
            counterPartyPlayer: game.counterPartyPlayer?.login,
        };
    }
}
