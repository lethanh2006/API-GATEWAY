import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { AuthenticatedRequest } from '../../common/interfaces/request-context.interface';
import { AssignTaskDto, UpdateTaskStatusDto } from './dto/assign-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { MyTaskQueryDto, TaskQueryDto } from './dto/task-query.dto';
import { UpcomingDeadlineQueryDto } from './dto/upcoming-deadline-query.dto';
import { UpdateTaskDeadlineDto } from './dto/update-task-deadline.dto';
import { UpdateTaskPriorityDto } from './dto/update-task-priority.dto';
import { UpdateTaskProgressDto } from './dto/update-task-progress.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TodoService } from './todo.service';

/**
 * Công việc: ai cũng xem và cập nhật việc của mình, nhóm quản lý (ADMIN, MANAGER, CHEF) tạo,
 * giao, sửa, xóa; chuyển tiếp tới Todo.
 */
@ApiTags('Api Todo')
@Controller('api/todo')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get('my-tasks')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách công việc của người dùng hiện tại' })
  getMyTasks(@Query() query: MyTaskQueryDto, @Req() req: AuthenticatedRequest) {
    return this.todoService.getMyTasks(query, req.user);
  }

  @Patch(':id/status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật trạng thái của một công việc' })
  @ApiParam({ name: 'id', example: '507f1f77bcf86cd799439011' })
  updateTaskStatus(
    @Param('id') id: string,
    @Body() body: UpdateTaskStatusDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.todoService.updateTaskStatus(id, body.status, req.user);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CHEF)
  @ApiOperation({ summary: 'Tạo công việc mới (ADMIN, MANAGER, CHEF)' })
  createTask(@Body() body: CreateTaskDto, @Req() req: AuthenticatedRequest) {
    return this.todoService.createTask(body, req.user);
  }

  @Patch(':id/assign')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CHEF)
  @ApiOperation({
    summary: 'Giao lại công việc cho người dùng (ADMIN, MANAGER, CHEF)',
  })
  @ApiParam({ name: 'id', example: '507f1f77bcf86cd799439011' })
  assignTask(
    @Param('id') id: string,
    @Body() body: AssignTaskDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.todoService.assignTask(id, body.assignedTo, req.user);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CHEF)
  @ApiOperation({
    summary: 'Cập nhật nội dung công việc (ADMIN, MANAGER, CHEF)',
  })
  @ApiParam({ name: 'id', example: '507f1f77bcf86cd799439011' })
  updateTask(
    @Param('id') id: string,
    @Body() body: UpdateTaskDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.todoService.updateTask(id, body, req.user);
  }

  @Patch(':id/priority')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CHEF)
  @ApiOperation({
    summary: 'Cập nhật mức độ ưu tiên của công việc (ADMIN, MANAGER, CHEF)',
  })
  @ApiParam({ name: 'id', example: '507f1f77bcf86cd799439011' })
  updatePriority(
    @Param('id') id: string,
    @Body() body: UpdateTaskPriorityDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.todoService.updateTaskPriority(id, body.priority, req.user);
  }

  @Patch(':id/deadline')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CHEF)
  @ApiOperation({
    summary: 'Cập nhật hạn chót công việc (ADMIN, MANAGER, CHEF)',
  })
  @ApiParam({ name: 'id', example: '507f1f77bcf86cd799439011' })
  updateDeadline(
    @Param('id') id: string,
    @Body() body: UpdateTaskDeadlineDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.todoService.updateTaskDeadline(id, body.deadline, req.user);
  }

  @Patch(':id/progress')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cập nhật tiến độ hoàn thành % của công việc',
  })
  @ApiParam({ name: 'id', example: '507f1f77bcf86cd799439011' })
  updateProgress(
    @Param('id') id: string,
    @Body() body: UpdateTaskProgressDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.todoService.updateTaskProgress(id, body.progress, req.user);
  }

  @Get('overdue')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy danh sách các công việc đã quá hạn chót',
  })
  getOverdue(@Req() req: AuthenticatedRequest) {
    return this.todoService.getOverdue(req.user);
  }

  @Get('upcoming-deadline')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy danh sách các công việc sắp đến hạn chót trong N ngày',
  })
  getUpcomingDeadline(
    @Query() query: UpcomingDeadlineQueryDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.todoService.getUpcomingDeadline(query, req.user);
  }

  @Get()
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CHEF)
  @ApiOperation({ summary: 'Lấy tất cả công việc (ADMIN, MANAGER, CHEF)' })
  getAllTasks(@Query() query: TaskQueryDto, @Req() req: AuthenticatedRequest) {
    return this.todoService.getAllTasks(query, req.user);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy chi tiết công việc được phép truy cập' })
  @ApiParam({ name: 'id', example: '507f1f77bcf86cd799439011' })
  getTaskById(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.todoService.getTaskById(id, req.user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CHEF)
  @ApiOperation({ summary: 'Xóa công việc (ADMIN, MANAGER, CHEF)' })
  @ApiParam({ name: 'id', example: '507f1f77bcf86cd799439011' })
  deleteTask(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.todoService.deleteTask(id, req.user);
  }
}
