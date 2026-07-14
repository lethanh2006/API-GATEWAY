import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CanteenController } from './canteen.controller';
import { CanteenService } from './canteen.service';

@Module({
  imports: [HttpModule],
  controllers: [CanteenController],
  providers: [CanteenService],
})
export class CanteenModule {}
