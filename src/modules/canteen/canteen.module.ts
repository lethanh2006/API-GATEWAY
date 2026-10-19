import { Module } from '@nestjs/common';

import { UpstreamHttpModule } from '../../common/http/upstream-http.module';
import { CanteenCategoryController } from './canteen-category.controller';
import { CanteenMenuController } from './canteen-menu.controller';
import { CanteenOrderController } from './canteen-order.controller';
import { CanteenReviewController } from './canteen-review.controller';
import { CanteenTableController } from './canteen-table.controller';
import { CanteenService } from './canteen.service';

@Module({
  imports: [UpstreamHttpModule],
  controllers: [
    CanteenMenuController,
    CanteenOrderController,
    CanteenReviewController,
    CanteenTableController,
    CanteenCategoryController,
  ],
  providers: [CanteenService],
})
export class CanteenModule {}
