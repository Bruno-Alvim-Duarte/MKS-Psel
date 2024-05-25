import { Controller, Get } from '@nestjs/common';
import { MovieService } from './movie.service';

@Controller()
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('/movies')
  getAllMovies() {
    return this.movieService.getAllMovies();
  }
}
