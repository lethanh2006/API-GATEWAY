import { TodoService } from './todo.service';
export declare class TodoController {
    private readonly todoService;
    constructor(todoService: TodoService);
    getMyTasks(req: any): Promise<any>;
    updateTaskStatus(id: string, status: string, req: any): Promise<any>;
    createTask(body: any, req: any): Promise<any>;
    assignTask(id: string, assignedTo: string, req: any): Promise<any>;
    getAllTasks(req: any): Promise<any>;
    deleteTask(id: string, req: any): Promise<any>;
}
