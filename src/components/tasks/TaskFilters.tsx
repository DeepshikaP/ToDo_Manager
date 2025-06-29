
import { TaskStatus, TaskPriority, TaskCounts } from "@/types/task";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";

interface TaskFiltersProps {
  filterStatus: TaskStatus | "all";
  filterPriority: TaskPriority | "all";
  searchTerm: string;
  sortBy: "dueDate" | "priority" | "createdAt";
  onFilterStatusChange: (status: TaskStatus | "all") => void;
  onFilterPriorityChange: (priority: TaskPriority | "all") => void;
  onSearchChange: (search: string) => void;
  onSortChange: (sort: "dueDate" | "priority" | "createdAt") => void;
  taskCounts: TaskCounts;
}

export const TaskFilters = ({
  filterStatus,
  filterPriority,
  searchTerm,
  sortBy,
  onFilterStatusChange,
  onFilterPriorityChange,
  onSearchChange,
  onSortChange,
  taskCounts,
}: TaskFiltersProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-500" />
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
      </div>

      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search">Search Tasks</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="search"
            type="text"
            placeholder="Search by title, description, or tags..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Task Counts */}
      <div className="grid grid-cols-2 gap-2">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{taskCounts.total}</div>
          <div className="text-sm text-blue-800">Total</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{taskCounts.completed}</div>
          <div className="text-sm text-green-800">Completed</div>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{taskCounts.inProgress}</div>
          <div className="text-sm text-yellow-800">In Progress</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-600">{taskCounts.todo}</div>
          <div className="text-sm text-gray-800">To Do</div>
        </div>
      </div>

      {/* Status Filter */}
      <div className="space-y-2">
        <Label>Filter by Status</Label>
        <Select value={filterStatus} onValueChange={onFilterStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Priority Filter */}
      <div className="space-y-2">
        <Label>Filter by Priority</Label>
        <Select value={filterPriority} onValueChange={onFilterPriorityChange}>
          <SelectTrigger>
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort Options */}
      <div className="space-y-2">
        <Label>Sort by</Label>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="dueDate">Due Date</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="createdAt">Created Date</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters */}
      <div className="space-y-2">
        <Label>Active Filters</Label>
        <div className="flex flex-wrap gap-2">
          {filterStatus !== "all" && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => onFilterStatusChange("all")}>
              Status: {filterStatus} ×
            </Badge>
          )}
          {filterPriority !== "all" && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => onFilterPriorityChange("all")}>
              Priority: {filterPriority} ×
            </Badge>
          )}
          {searchTerm && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => onSearchChange("")}>
              Search: {searchTerm} ×
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
