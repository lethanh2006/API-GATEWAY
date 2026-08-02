export declare enum TaskPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high"
}
export declare class CreateTaskDto {
    title: string;
    description?: string;
    priority?: TaskPriority;
    deadline?: string;
    assignedTo?: string;
}
