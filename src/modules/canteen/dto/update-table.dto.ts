import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateTableDto {
  @ApiPropertyOptional({ description: 'Tên bàn ăn', example: 'Bàn 01' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({ description: 'Sức chứa tối đa', example: 4 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  capacity?: number;

  @ApiPropertyOptional({ description: 'Đường dẫn QR Code bàn ăn' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  qrCodeUrl?: string;
}
