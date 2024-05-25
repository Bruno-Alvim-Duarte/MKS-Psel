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

  getMovieById(id: number) {
    return this.movieRepository.findBy({ id });
  }

  createMovie(movie: createMovieDto) {
    return this.movieRepository.save(movie);
  }

  async updateMovie(id: number, movie: createMovieDto) {
    const result = await this.movieRepository.update(id, movie);
    if (result.affected === 1) {
      return this.movieRepository.findBy({ id });
    } else {
      throw new NotFoundException('Movie not found');
    }
  }
}
