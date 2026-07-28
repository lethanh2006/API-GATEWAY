import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class AllocateTableDto {
  @ApiProperty({ description: 'Số lượng khách hàng trong đoàn', example: 6 })
  @IsNumber()
  @Min(1)
  partySize: number;
}
