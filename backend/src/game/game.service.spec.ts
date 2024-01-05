import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameService } from './game.service';
import { GameEntity } from '../entities/game.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { mock, MockProxy } from 'jest-mock-extended';
import { EmptyCell } from './types';

describe('GameService', () => {
  let service: GameService;
  let gameRepository: MockProxy<Repository<GameEntity>>;

  beforeEach(async () => {
    gameRepository = mock<Repository<GameEntity>>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameService,
        { provide: getRepositoryToken(GameEntity), useValue: gameRepository },
      ],
    }).compile();

    service = module.get<GameService>(GameService);
  });

  it('should list all games', async () => {
    const games = [new GameEntity(), new GameEntity()];
    gameRepository.find.mockResolvedValue(games);

    const result = await service.listAllGames();

    expect(result).toEqual(games);
    expect(gameRepository.find).toHaveBeenCalledWith({
      relations: ['initiatorPlayer', 'counterPartyPlayer'],
    });
  });

  it('should throw BadRequestException when invalid move', async () => {
    const game = new GameEntity();
    game.state = {
      board: [
        ['X', 'O', 'X'],
        ['O', 'X', 'O'],
        ['X', 'O', 'X'],
      ],
      currentPlayer: 'X',
      currentPlayerId: 1,
      gameResult: null,
    };
    gameRepository.findOne.mockResolvedValue(game);

    await expect(service.playMove(1, 1, [0, 0])).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw BadRequestException when not player turn', async () => {
    const game = new GameEntity();
    game.state = {
      board: [
        [EmptyCell, EmptyCell, EmptyCell],
        [EmptyCell, EmptyCell, EmptyCell],
        [EmptyCell, EmptyCell, EmptyCell],
      ],
      currentPlayer: 'X',
      currentPlayerId: 2,
      gameResult: null,
    };
    gameRepository.findOne.mockResolvedValue(game);

    await expect(service.playMove(1, 1, [0, 0])).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw BadRequestException when game is not full', async () => {
    const game = new GameEntity();
    game.state = {
      board: [
        [EmptyCell, EmptyCell, EmptyCell],
        [EmptyCell, EmptyCell, EmptyCell],
        [EmptyCell, EmptyCell, EmptyCell],
      ],
      currentPlayer: 'X',
      currentPlayerId: 1,
      gameResult: null,
    };
    game.counterPartyPlayerId = null;
    gameRepository.findOne.mockResolvedValue(game);

    await expect(service.playMove(1, 1, [0, 0])).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should create a new game', async () => {
    const game = new GameEntity();
    game.initiatorPlayerId = 1;
    gameRepository.create.mockReturnValue(game);
    gameRepository.save.mockResolvedValue(game);
    gameRepository.findOne.mockResolvedValue(game);

    const result = await service.createGame(1);

    expect(result).toEqual(game);
    expect(gameRepository.create).toHaveBeenCalledWith({
      initiatorPlayerId: 1,
      state: expect.any(Object),
    });
    expect(gameRepository.save).toHaveBeenCalledWith(game);
  });
});
