import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';

export class RefundQueryDto {
  @ApiPropertyOptional({ enum: ['OPEN', 'REFUNDED', 'DISMISSED'] })
  @IsOptional()
  @IsIn(['OPEN', 'REFUNDED', 'DISMISSED'], {
    message: 'status phải là OPEN, REFUNDED hoặc DISMISSED',
  })
  status?: 'OPEN' | 'REFUNDED' | 'DISMISSED';

  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit phải là số nguyên' })
  @Min(1, { message: 'limit tối thiểu là 1' })
  @Max(100, { message: 'limit tối đa là 100' })
  limit?: number;
}
