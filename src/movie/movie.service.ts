import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../entity/Movie'; // Import the Movie entity
import { createMovieDto } from '../dto/movie.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie) private movieRepository: Repository<Movie>,
  ) {}

  getAllMovies() {
    return this.movieRepository.find();
  }

  async getMovieById(id: number) {
    const movie = await this.movieRepository.findOneBy({ id });
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
      return this.movieRepository.findOneBy({ id });
    } else {
      throw new NotFoundException('Movie not found');
    }
  }

  async deleteMovie(id: number) {
    const result = await this.movieRepository.delete(id);
    if (result.affected === 1) {
      return;
    } else {
      throw new NotFoundException('Movie not found');
    }
  }
}
