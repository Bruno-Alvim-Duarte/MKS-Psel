import { Injectable } from '@nestjs/common';
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
}
