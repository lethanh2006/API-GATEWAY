import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { TodoService } from './todo.service';
import { JwtAuthGuard } from '../auth/common/guard/jwt/jwt.guard';
import { RolesGuard } from '../auth/common/guard/role/role.guard';
import { Roles } from '../../common/decorators/role.decorator';
import { Role } from '../../common/enums/role.enum';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CreateTaskDto } from './dto/create-task.dto';
import { AssignTaskDto, UpdateTaskStatusDto } from './dto/assign-task.dto';

@ApiTags('Api Todo')
@Controller('api/todo')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get('my-tasks')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách công việc của người dùng hiện tại' })
  async getMyTasks(@Req() req: any) {
    return this.todoService.getMyTasks(req.user);
  }

  @Patch(':id/status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật trạng thái của một công việc' })
  @ApiParam({ name: 'id', example: 'taskId123' })
  async updateTaskStatus(@Param('id') id: string, @Body() body: UpdateTaskStatusDto, @Req() req: any) {
    return this.todoService.updateTaskStatus(id, body.status, req.user);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Tạo công việc mới (chỉ Admin)' })
  async createTask(@Body() body: CreateTaskDto, @Req() req: any) {
    return this.todoService.createTask(body, req.user);
  }

  @Patch(':id/assign')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Giao lại công việc cho người dùng (chỉ Admin)' })
  @ApiParam({ name: 'id', example: 'taskId123' })
  async assignTask(@Param('id') id: string, @Body() body: AssignTaskDto, @Req() req: any) {
    return this.todoService.assignTask(id, body.assignedTo, req.user);
  }

  @Get()
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Lấy tất cả công việc (chỉ Admin)' })
  async getAllTasks(@Req() req: any) {
    return this.todoService.getAllTasks(req.user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Xóa công việc (chỉ Admin)' })
  @ApiParam({ name: 'id', example: 'taskId123' })
  async deleteTask(@Param('id') id: string, @Req() req: any) {
    return this.todoService.deleteTask(id, req.user);
  }
}
