import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';
export class UpdateUserDto {
  @ApiProperty({
    description: 'Новое имя пользователя',
    example: 'Ryan',
    minLength: 2,
  })
  @IsString()
  @IsOptional()
  @MinLength(2, { message: 'Минимальная длина имени - 2 символа' })
  FirstName?: string;

  @ApiProperty({
    description: 'Новая фамилия пользователя',
    example: 'Sandle',
    minLength: 2,
  })
  @IsString()
  @IsOptional()
  @MinLength(2, { message: 'Минимальная длина фамилии - 2 символа' })
  LastName?: string;
}
