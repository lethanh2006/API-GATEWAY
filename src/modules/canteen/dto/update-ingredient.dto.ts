import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateIngredientDto {
  @ApiPropertyOptional({ description: 'Tên nguyên liệu', example: 'Cà phê' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({ description: 'Đơn vị tính', example: 'kg' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  unit?: string;

  @ApiPropertyOptional({ description: 'Ngưỡng cảnh báo tồn kho', example: 5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minimumThreshold?: number;
}
