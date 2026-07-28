import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class ConsumeIngredientDto {
  @ApiProperty({ example: '6691ab2d5cf2a13ba0d7d8c1', description: 'ID nguyên liệu (Ingredient ID)' })
  @IsNotEmpty({ message: 'ID nguyên liệu (ingredientId) không được để trống' })
  @IsString({ message: 'ID nguyên liệu phải là chuỗi ObjectId' })
  ingredientId: string;

  @ApiProperty({ example: 5, description: 'Số lượng khấu trừ sau khi nấu ăn' })
  @IsNotEmpty({ message: 'Số lượng khấu trừ không được để trống' })
  @IsNumber({}, { message: 'Số lượng phải là số' })
  @Min(0.001, { message: 'Số lượng khấu trừ phải lớn hơn 0' })
  quantity: number;
}
