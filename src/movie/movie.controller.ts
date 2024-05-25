import { Controller, Get, Param } from '@nestjs/common';
import { MovieService } from './movie.service';

@Controller()
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('/movies')
  getAllMovies() {
    return this.movieService.getAllMovies();
  }

  @Get('/movies/:id')
  getMovieById(@Param('id') id: number) {
    return this.movieService.getMovieById(id);
  }
}
