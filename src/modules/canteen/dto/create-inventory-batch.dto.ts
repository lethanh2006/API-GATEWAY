import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsMongoId,
  IsNumber,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';

export class CreateInventoryBatchDto {
  @ApiProperty({
    example: '6691ab2d5cf2a13ba0d7d8c1',
    description: 'ID nguyên liệu (Ingredient ID)',
  })
  @IsNotEmpty({ message: 'ID nguyên liệu (ingredientId) không được để trống' })
  @IsMongoId({ message: 'ID nguyên liệu không đúng định dạng ObjectId' })
  ingredientId: string;

  @ApiProperty({ example: 50, description: 'Số lượng nguyên liệu nhập kho' })
  @IsNotEmpty({ message: 'Số lượng nhập không được để trống' })
  @IsNumber({}, { message: 'Số lượng phải là số' })
  @Min(0.001, { message: 'Số lượng nhập phải lớn hơn 0' })
  quantity: number;

  @ApiProperty({
    example: '2026-08-15',
    description: 'Hạn sử dụng (YYYY-MM-DD)',
  })
  @IsNotEmpty({ message: 'Hạn sử dụng (expiryDate) không được để trống' })
  @IsDateString(
    {},
    { message: 'Hạn sử dụng phải đúng định dạng ISO Date (YYYY-MM-DD)' },
  )
  expiryDate: string;

  @ApiProperty({ example: 85000, description: 'Giá nhập lô hàng (VND)' })
  @IsNotEmpty({ message: 'Giá nhập không được để trống' })
  @IsInt({ message: 'Giá nhập phải là số nguyên VND' })
  @Min(0, { message: 'Giá nhập phải lớn hơn hoặc bằng 0' })
  @Max(Number.MAX_SAFE_INTEGER, { message: 'Giá nhập vượt giới hạn hỗ trợ' })
  costPrice: number;

  @ApiProperty({
    example: 'Công ty Thực Phẩm Sạch CP',
    description: 'Tên nhà cung cấp',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Tên nhà cung cấp phải là chuỗi ký tự' })
  supplier?: string;
}
