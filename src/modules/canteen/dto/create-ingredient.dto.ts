import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateIngredientDto {
  @ApiProperty({ example: 'Thịt gà', description: 'Tên nguyên liệu' })
  @IsNotEmpty({ message: 'Tên nguyên liệu không được để trống' })
  @IsString({ message: 'Tên nguyên liệu phải là chuỗi ký tự' })
  name: string;

  @ApiProperty({ example: 'kg', description: 'Đơn vị tính (kg, lít, bó...)' })
  @IsNotEmpty({ message: 'Đơn vị tính không được để trống' })
  @IsString({ message: 'Đơn vị tính phải là chuỗi ký tự' })
  unit: string;

  @ApiProperty({ example: 10, description: 'Ngưỡng cảnh báo tồn kho tối thiểu' })
  @IsNotEmpty({ message: 'Ngưỡng cảnh báo tối thiểu không được để trống' })
  @IsNumber({}, { message: 'Ngưỡng cảnh báo tối thiểu phải là số' })
  @Min(0, { message: 'Ngưỡng cảnh báo tối thiểu phải lớn hơn hoặc bằng 0' })
  minimumThreshold: number;
}
