export declare enum TaskStatus {
    TODO = "todo",
    IN_PROGRESS = "in_progress",
    DONE = "done",
    CANCELLED = "cancelled"
}
export declare class AssignTaskDto {
    assignedTo: string;
}
export declare class UpdateTaskStatusDto {
    status: TaskStatus;
}
