import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from '../movie.service';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from '../../entity/Movie';
import { createMovieDto } from '../../dto/movie.dto';

describe('MovieService', () => {
  let movieService: MovieService;
  let movieRepository: Repository<Movie>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    movieService = module.get<MovieService>(MovieService);
    movieRepository = module.get<Repository<Movie>>(getRepositoryToken(Movie));
  });

  describe('getAllMovies', () => {
    it('should return an array of movies', async () => {
      const movies: Movie[] = [
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
      jest.spyOn(movieRepository, 'find').mockResolvedValue(movies);

      const result = await movieService.getAllMovies();

      expect(result).toEqual(movies);
    });
  });

  describe('getMovieById', () => {
    it('should return a movie by id', async () => {
      const movieId = 1;
      const movie: Movie = {
        id: 2,
        title: 'movie2',
        description: 'Description2',
        genre: 'Genre2',
        director: 'Director2',
        year: 2022,
        coverImgUrl: 'https://example.com',
      };
      jest.spyOn(movieRepository, 'findOneBy').mockResolvedValue(movie);

      const result = await movieService.getMovieById(movieId);

      expect(result).toEqual(movie);
    });

    it('should throw NotFoundException if movie is not found', async () => {
      const movieId = 1;
      jest.spyOn(movieRepository, 'findOneBy').mockResolvedValue(null);

      await expect(movieService.getMovieById(movieId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createMovie', () => {
    it('should create a new movie', async () => {
      const movieDto: createMovieDto = {
        title: 'New Movie',
        description: 'Description',
        genre: 'Genre',
        year: 2021,
        director: 'Director',
        coverImgUrl: 'https://example.com',
      };
      const createdMovie: Movie = {
        id: 1,
        title: 'New Movie',
        description: 'Description',
        genre: 'Genre',
        director: 'Director',
        year: 2021,
        coverImgUrl: 'https://example.com',
      };
      jest.spyOn(movieRepository, 'save').mockResolvedValue(createdMovie);

      const result = await movieService.createMovie(movieDto);

      expect(result).toEqual(createdMovie);
    });
  });

  describe('updateMovie', () => {
    it('should update a movie by id', async () => {
      const movieId = 1;
      const movieDto: createMovieDto = {
        title: 'Updated Movie',
        description: 'Description',
        genre: 'Genre',
        year: 2022,
        director: 'Director',
        coverImgUrl: 'https://example.com',
      };
      const updatedMovie: Movie = {
        id: 1,
        title: 'Updated Movie',
        description: 'Description',
        genre: 'Genre',
        director: 'Director',
        year: 2022,
        coverImgUrl: 'https://example.com',
      };
      jest.spyOn(movieRepository, 'findOneBy').mockResolvedValue(updatedMovie);
      jest
        .spyOn(movieRepository, 'update')
        .mockResolvedValue({ affected: 1 } as UpdateResult);

      const result = await movieService.updateMovie(movieId, movieDto);

      expect(result).toEqual(updatedMovie);
    });

    it('should throw NotFoundException if movie is not found', async () => {
      const movieId = 1;
      const movieDto: createMovieDto = {
        title: 'Updated Movie',
        description: 'Description',
        genre: 'Genre',
        year: 2022,
        director: 'Director',
        coverImgUrl: 'https://example.com',
      };
      jest
        .spyOn(movieRepository, 'update')
        .mockResolvedValue({ affected: 0 } as UpdateResult);

      await expect(movieService.updateMovie(movieId, movieDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteMovie', () => {
    it('should delete a movie by id', async () => {
      const movieId = 1;
      jest
        .spyOn(movieRepository, 'delete')
        .mockResolvedValue({ affected: 1 } as DeleteResult);

      expect(await movieService.deleteMovie(movieId)).toBeUndefined();
    });

    it('should throw NotFoundException if movie is not found', async () => {
      const movieId = 1;
      jest
        .spyOn(movieRepository, 'delete')
        .mockResolvedValue({ affected: 0 } as DeleteResult);

      await expect(movieService.deleteMovie(movieId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
