import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class createMovieDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  genre: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  director: string;

  @ApiProperty()
  @IsNumber()
  year: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  coverImgUrl: string;
}
