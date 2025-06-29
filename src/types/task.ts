
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export type TaskStatus = "todo" | "in-progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  assignedTo: string[];
  sharedWith: string[];
  tags: string[];
}

export interface TaskFilters {
  status?: TaskStatus | "all";
  priority?: TaskPriority | "all";
  search?: string;
  sortBy?: "dueDate" | "priority" | "createdAt";
}

export interface TaskCounts {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
}
