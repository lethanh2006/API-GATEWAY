import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateTableDto {
  @ApiProperty({ description: 'Tên bàn ăn (ví dụ: Bàn 01)', example: 'Bàn 01' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Sức chứa tối đa (số người)', example: 4 })
  @IsNumber()
  @Min(1)
  capacity: number;

  @ApiPropertyOptional({ description: 'Đường dẫn QR Code bàn ăn', example: 'https://canteen.domain.com/qr/tables/Ban01' })
  @IsString()
  @IsOptional()
  qrCodeUrl?: string;
}
