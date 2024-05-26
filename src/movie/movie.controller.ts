import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { createMovieDto } from '../dto/movie.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('movies')
@UseGuards(AuthGuard)
@Controller()
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('/movies')
  @ApiOperation({ summary: 'List all movies' })
  getAllMovies() {
    return this.movieService.getAllMovies();
  }

  @Get('/movies/:id')
  @ApiOperation({ summary: 'Get movie by id' })
  getMovieById(@Param('id') id: number) {
    return this.movieService.getMovieById(id);
  }

  @Post('/movies')
  @ApiOperation({ summary: 'Create a movie' })
  createMovie(@Body() movie: createMovieDto) {
    return this.movieService.createMovie(movie);
  }

  @Put('/movies/:id')
  @ApiOperation({ summary: 'Update a movie' })
  updateMovie(@Param('id') id: number, @Body() movie: createMovieDto) {
    return this.movieService.updateMovie(id, movie);
  }

  @Delete('/movies/:id')
  @ApiOperation({ summary: 'Delete a movie' })
  @HttpCode(204)
  deleteMovie(@Param('id') id: number) {
    return this.movieService.deleteMovie(id);
  }
}
