import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../entity/Movie'; // Import the Movie entity
import { createMovieDto } from '../dto/movie.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie) private movieRepository: Repository<Movie>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getAllMovies() {
    const moviesCached = await this.cacheManager.get('movies');
    const isMoviesFromCacheStale =
      !(await this.cacheManager.get('movies:validation'));
    if (isMoviesFromCacheStale && moviesCached) {
      const isRefetching = await this.cacheManager.get('movies:isRefetching');
      // se a busca no banco de dados já estiver sendo feita por alguma requisição, se enquanto isso chegar outra requisição não é necessário refazer a busca
      if (!isRefetching) {
        await this.cacheManager.set('movies:isRefetching', 'true', 1000);
        console.log('cache is stale - refetching...');
        setTimeout(async () => {
          const movies = await this.movieRepository.find();
          await this.cacheManager.set('movies', movies, 0);
          await this.cacheManager.set('movies:validation', 'true', 10000);
        }, 0);
      }
    }
    if (moviesCached) {
      return moviesCached;
    }
    const movies = await this.movieRepository.find();
    await this.cacheManager.set('movies', movies, 0);
    await this.cacheManager.set('movies:validation', 'true', 10000);
    return movies;
  }

  async getMovieById(id: number) {
    const movieCached = await this.cacheManager.get(`movie-${id}`);
    if (movieCached) {
      return movieCached;
    }
    const movie = await this.movieRepository.findOneBy({ id });
    await this.cacheManager.set(`movie-${id}`, movie);
    if (movie) {
      return movie;
    } else {
      throw new NotFoundException('Movie not found');
    }
  }

  createMovie(movie: createMovieDto) {
    return this.movieRepository.save(movie);
  }

  async updateMovie(id: number, movie: createMovieDto) {
    const result = await this.movieRepository.update(id, movie);
    if (result.affected === 1) {
      await this.cacheManager.del(`movie-${id}`);
      return this.movieRepository.findOneBy({ id });
    } else {
      throw new NotFoundException('Movie not found');
    }
  }

  async deleteMovie(id: number) {
    const result = await this.movieRepository.delete(id);
    if (result.affected === 1) {
      await this.cacheManager.del(`movie-${id}`);
      return;
    } else {
      throw new NotFoundException('Movie not found');
    }
  }
}
