import { TodoService } from './todo.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { AssignTaskDto, UpdateTaskStatusDto } from './dto/assign-task.dto';
export declare class TodoController {
    private readonly todoService;
    constructor(todoService: TodoService);
    getMyTasks(req: any): Promise<any>;
    updateTaskStatus(id: string, body: UpdateTaskStatusDto, req: any): Promise<any>;
    createTask(body: CreateTaskDto, req: any): Promise<any>;
    assignTask(id: string, body: AssignTaskDto, req: any): Promise<any>;
    getAllTasks(req: any): Promise<any>;
    deleteTask(id: string, req: any): Promise<any>;
}
