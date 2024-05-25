import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MovieService } from './movie.service';
import { createMovieDto } from '../dto/movie.dto';

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

  @Post('/movies')
  createMovie(@Body() movie: createMovieDto) {
    return this.movieService.createMovie(movie);
  }
}
