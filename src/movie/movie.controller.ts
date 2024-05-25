import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { createMovieDto } from '../dto/movie.dto';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
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

  @Put('/movies/:id')
  updateMovie(@Param('id') id: number, @Body() movie: createMovieDto) {
    return this.movieService.updateMovie(id, movie);
  }
}
