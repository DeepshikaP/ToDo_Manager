import { Task, TaskStatus, TaskPriority } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  Calendar, 
  Edit, 
  Trash2, 
  Share2,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { isOverdue } from "@/lib/date-utils";

interface TaskCardProps {
  task: Task;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onShareTask: (task: Task) => void;
}

const statusConfig = {
  todo: { label: "To Do", color: "bg-gray-100 text-gray-800", icon: Clock },
  "in-progress": { label: "In Progress", color: "bg-blue-100 text-blue-800", icon: AlertCircle },
  completed: { label: "Completed", color: "bg-green-100 text-green-800", icon: CheckCircle }
};

const priorityConfig = {
  low: { label: "Low", color: "bg-green-100 text-green-800" },
  medium: { label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  high: { label: "High", color: "bg-red-100 text-red-800" }
};

export const TaskCard = ({ task, onUpdateTask, onDeleteTask, onEditTask, onShareTask }: TaskCardProps) => {
  const StatusIcon = statusConfig[task.status].icon;
  const isTaskOverdue = isOverdue(new Date(task.dueDate)) && task.status !== "completed";

  const handleStatusChange = (newStatus: TaskStatus) => {
    onUpdateTask(task.id, { status: newStatus });
  };

  return (
    <div className={`bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-200 ${isTaskOverdue ? 'border-red-200' : 'border-gray-200'}`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{task.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-3">{task.description}</p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem onClick={() => onEditTask(task)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onShareTask(task)}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDeleteTask(task.id)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Badge className={statusConfig[task.status].color}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {statusConfig[task.status].label}
          </Badge>
          <Badge variant="outline" className={priorityConfig[task.priority].color}>
            {priorityConfig[task.priority].label}
          </Badge>
        </div>

        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Calendar className="w-4 h-4 mr-1" />
          <span className={isTaskOverdue ? 'text-red-600 font-medium' : ''}>
            Due {format(new Date(task.dueDate), 'MMM dd, yyyy')}
          </span>
          {isTaskOverdue && (
            <span className="ml-2 text-red-600 font-medium">(Overdue)</span>
          )}
        </div>

        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {task.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {task.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{task.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex gap-2">
          {task.status !== "completed" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusChange(task.status === "todo" ? "in-progress" : "completed")}
              className="flex-1"
            >
              {task.status === "todo" ? "Start" : "Complete"}
            </Button>
          )}
          {task.status === "completed" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusChange("in-progress")}
              className="flex-1"
            >
              Reopen
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
