import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IsNull, Not, Repository } from 'typeorm';
import { GameEntity } from '../entities/game.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Board, EmptyCell, GameResult, GameState, PlayerMove } from './types';
import { range } from 'lodash';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
  ) {}

  async listAllGames(): Promise<GameEntity[]> {
    return await this.gameRepository.find({
      relations: ['initiatorPlayer', 'counterPartyPlayer'],
    });
  }

  async findFreeGame(userId: number): Promise<GameEntity | null> {
    return await this.gameRepository.findOne({
      where: { initiatorPlayerId: Not(userId), counterPartyPlayer: IsNull() },
      relations: ['initiatorPlayer', 'counterPartyPlayer'],
    });
  }

  async playMove(
    gameId: number,
    userId: number,
    playerMove: PlayerMove,
  ): Promise<GameEntity> {
    const game = await this.gameRepository.findOne({
      where: [
        { id: gameId, initiatorPlayerId: userId },
        { id: gameId, counterPartyPlayerId: userId },
      ],
      relations: ['initiatorPlayer', 'counterPartyPlayer'],
    });

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    game.state = this.play(userId, game, playerMove);
    await this.gameRepository.save(game);

    return this.getGame(game.id);
  }

  public getGame(id: number): Promise<GameEntity> {
    return this.gameRepository.findOne({
      where: {
        id,
      },
      relations: ['initiatorPlayer', 'counterPartyPlayer'],
    });
  }

  private initGame(userId: number): GameState {
    return {
      board: range(0, 3).map((i) => range(0, 3).map((j) => EmptyCell)),
      currentPlayer: 'X',
      currentPlayerId: userId,
      gameResult: null,
    };
  }

  private play(
    userId: number,
    game: GameEntity,
    playerMove: PlayerMove,
  ): GameState {
    const [x, y] = playerMove;

    const state = game.state;

    if (state.board[x][y] !== EmptyCell) {
      throw new BadRequestException('Invalid move');
    }

    if (state.currentPlayerId !== userId) {
      throw new BadRequestException(`It's not your turn`);
    }

    if (game.counterPartyPlayerId === null) {
      throw new BadRequestException('Game is not full');
    }

    const newPlayerId =
      game.initiatorPlayerId === userId
        ? game.counterPartyPlayerId
        : game.initiatorPlayerId;

    const board = this.updateBoard(state, x, y);
    return {
      board: board,
      currentPlayer: this.updatePlayer(state),
      currentPlayerId: newPlayerId,
      gameResult: this.getGameResult(board),
    };
  }

  private updatePlayer(game: GameState) {
    return game.currentPlayer === 'X' ? 'O' : 'X';
  }

  private updateBoard(game: GameState, x: number, y: number) {
    return game.board.map((row, i) =>
      row.map((cell, j) => {
        if (i === x && j === y) {
          return game.currentPlayer;
        } else {
          return cell;
        }
      }),
    );
  }

  private getGameResult(board: Board): GameResult {
    const rows = board;
    const columns = range(0, 3).map((i) => range(0, 3).map((j) => board[j][i]));

    const diagonals = [
      [board[0][0], board[1][1], board[2][2]],
      [board[0][2], board[1][1], board[2][0]],
    ];

    const allLines = [...rows, ...columns, ...diagonals];

    const xWon = allLines.some((line) => line.every((cell) => cell === 'X'));
    const oWon = allLines.some((line) => line.every((cell) => cell === 'O'));

    const canPlay = board.some((row) => row.some((cell) => cell === EmptyCell));

    if (xWon) {
      return 'X';
    } else if (oWon) {
      return 'O';
    } else if (!canPlay) {
      return 'Draw';
    } else {
      return null;
    }
  }

  async joinGame(
    userId: number,
    maybeGameId: number | null,
  ): Promise<GameEntity> {
    if (maybeGameId) {
      const game = await this.getGame(maybeGameId);

      if (!game) {
        throw new NotFoundException('Game not found');
      }

      if (
        [game.initiatorPlayerId, game.counterPartyPlayerId].includes(userId)
      ) {
        return game;
      }

      if (game.counterPartyPlayerId) {
        throw new BadRequestException('Game is already full');
      }

      game.counterPartyPlayerId = userId;
      await this.gameRepository.save(game);

      return this.getGame(game.id);
    }

    const pickedGame = await this.findFreeGame(userId);

    if (!pickedGame) {
      return await this.createGame(userId);
    }

    pickedGame.counterPartyPlayerId = userId;
    await this.gameRepository.save(pickedGame);

    return this.getGame(pickedGame.id);
  }

  async createGame(userId: number): Promise<GameEntity> {
    const game = this.gameRepository.create({
      initiatorPlayerId: userId,
      state: this.initGame(userId),
    });
    await this.gameRepository.save(game);

    return this.getGame(game.id);
  }

  private async findPlayerOwnGame(userId: number): Promise<GameEntity | null> {
    return await this.gameRepository.findOne({
      where: {
        initiatorPlayerId: userId,
        counterPartyPlayerId: IsNull(),
      },
      relations: ['initiatorPlayer', 'counterPartyPlayer'],
    });
  }
}
