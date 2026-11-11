import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

import type { RefundOutcome } from '../payment-request-context';

export class ResolveRefundDto {
  @ApiProperty({ enum: ['REFUNDED', 'DISMISSED'] })
  @IsIn(['REFUNDED', 'DISMISSED'], {
    message: 'outcome phải là REFUNDED hoặc DISMISSED',
  })
  outcome: RefundOutcome;

  @ApiPropertyOptional({ maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Ghi chú tối đa 500 ký tự' })
  note?: string;
}
