import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from '../movie.controller';
import { MovieService } from '../movie.service';
import { createMovieDto } from '../../dto/movie.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from '../../entity/Movie';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../auth/auth.constants';

describe('MovieController', () => {
  let movieController: MovieController;
  let movieService: MovieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '15m' },
        }),
      ],
      controllers: [MovieController],
      providers: [
        MovieService,
        {
          provide: getRepositoryToken(Movie),
          useValue: {
            save: jest.fn(),
            findOneBy: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    movieController = module.get<MovieController>(MovieController);
    movieService = module.get<MovieService>(MovieService);
  });

  describe('getAllMovies', () => {
    it('should return an array of movies', async () => {
      const result = [
        {
          id: 1,
          title: 'movie1',
          description: 'Description',
          genre: 'Genre',
          director: 'Director',
          year: 2021,
          coverImgUrl: 'https://example.com',
        },
        {
          id: 2,
          title: 'movie2',
          description: 'Description2',
          genre: 'Genre2',
          director: 'Director2',
          year: 2022,
          coverImgUrl: 'https://example.com',
        },
      ];
      const movieServiceSpy = jest
        .spyOn(movieService, 'getAllMovies')
        .mockResolvedValue(result);

      expect(await movieController.getAllMovies()).toBe(result);
      expect(movieServiceSpy).toHaveBeenCalled();
    });
  });

  describe('getMovieById', () => {
    it('should return a movie by id', async () => {
      const id = 1;
      const result = {
        id: 1,
        title: 'movie1',
        description: 'Description',
        genre: 'Genre',
        director: 'Director',
        year: 2021,
        coverImgUrl: 'https://example.com',
      };
      jest.spyOn(movieService, 'getMovieById').mockResolvedValue(result);

      expect(await movieController.getMovieById(id)).toBe(result);
    });
  });

  describe('createMovie', () => {
    it('should create a new movie', async () => {
      const movie: createMovieDto = {
        title: 'New Movie',
        description: 'Description',
        genre: 'Genre',
        year: 2021,
        director: 'Director',
        coverImgUrl: 'https://example.com',
      };
      const result = {
        id: 1,
        title: 'New Movie',
        description: 'Description',
        genre: 'Genre',
        director: 'Director',
        year: 2021,
        coverImgUrl: 'https://example.com',
      };
      jest.spyOn(movieService, 'createMovie').mockResolvedValue(result);

      expect(await movieController.createMovie(movie)).toBe(result);
    });
  });

  describe('updateMovie', () => {
    it('should update a movie by id', async () => {
      const id = 1;
      const movie: createMovieDto = {
        title: 'Updated Movie',
        description: 'Description',
        genre: 'Genre',
        year: 2021,
        director: 'Director',
        coverImgUrl: 'https://example.com',
      };
      const result = {
        id: 1,
        title: 'Updated Movie',
        description: 'Description',
        genre: 'Genre',
        director: 'Director',
        year: 2021,
        coverImgUrl: 'https://example.com',
      };
      jest.spyOn(movieService, 'updateMovie').mockResolvedValue(result);

      expect(await movieController.updateMovie(id, movie)).toBe(result);
    });
  });

  describe('deleteMovie', () => {
    it('should delete a movie by id', async () => {
      const id = 1;
      jest.spyOn(movieService, 'deleteMovie').mockResolvedValue();

      expect(await movieController.deleteMovie(id)).toBeUndefined();
    });
  });
});
