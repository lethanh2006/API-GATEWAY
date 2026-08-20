import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class CreatePaymentQrDto {
  @ApiProperty({
    description: 'ID đơn hàng Canteen; amount được Gateway lấy từ Canteen',
    example: '66c6a6a6a6a6a6a6a6a6a6a6',
  })
  @IsMongoId({ message: 'orderId không hợp lệ' })
  orderId: string;
}
