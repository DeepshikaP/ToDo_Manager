
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { ShareTask } from "@/components/tasks/ShareTask";
import { AuthModal } from "@/components/auth/AuthModal";
import { useToast } from "@/hooks/use-toast";
import { Task, TaskStatus, TaskPriority, User } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Mock user data
const mockUser: User = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
};

// Mock tasks data
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Complete hackathon project",
    description: "Build a full-stack todo app with React and Supabase",
    status: "in-progress",
    priority: "high",
    dueDate: new Date("2024-01-15"),
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-10"),
    createdBy: "1",
    assignedTo: ["1"],
    sharedWith: [],
    tags: ["hackathon", "react", "supabase"]
  },
  {
    id: "2",
    title: "Review project requirements",
    description: "Go through all the functional requirements and deliverables",
    status: "completed",
    priority: "medium",
    dueDate: new Date("2024-01-12"),
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-12"),
    createdBy: "1",
    assignedTo: ["1"],
    sharedWith: [],
    tags: ["planning"]
  },
  {
    id: "3",
    title: "Set up deployment pipeline",
    description: "Configure Vercel for frontend and set up database",
    status: "todo",
    priority: "high",
    dueDate: new Date("2024-01-20"),
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
    createdBy: "1",
    assignedTo: ["1"],
    sharedWith: [],
    tags: ["deployment", "devops"]
  }
];

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(mockTasks);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [sharingTask, setSharingTask] = useState<Task | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(mockUser);
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "all">("all");
  const [filterPriority, setFilterPriority] = useState<TaskPriority | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "createdAt">("dueDate");
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 6;

  const { toast } = useToast();

  // Filter and sort tasks
  useEffect(() => {
    let filtered = tasks.filter(task => {
      const matchesStatus = filterStatus === "all" || task.status === filterStatus;
      const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesStatus && matchesPriority && matchesSearch;
    });

    // Sort tasks
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "createdAt":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    setFilteredTasks(filtered);
    setCurrentPage(1);
  }, [tasks, filterStatus, filterPriority, searchTerm, sortBy]);

  const handleCreateTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "createdBy">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: currentUser?.id || "1"
    };

    setTasks(prev => [...prev, newTask]);
    setIsTaskFormOpen(false);
    toast({
      title: "Task created",
      description: "Your new task has been created successfully.",
    });
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    ));
    
    toast({
      title: "Task updated",
      description: "Task has been updated successfully.",
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    toast({
      title: "Task deleted",
      description: "Task has been deleted successfully.",
      variant: "destructive"
    });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleShareTask = (task: Task) => {
    setSharingTask(task);
    setIsShareModalOpen(true);
  };

  const handleTaskShare = (taskId: string, emails: string[]) => {
    handleUpdateTask(taskId, {
      sharedWith: [...(tasks.find(t => t.id === taskId)?.sharedWith || []), ...emails]
    });
    setIsShareModalOpen(false);
    setSharingTask(null);
    
    toast({
      title: "Task shared",
      description: `Task shared with ${emails.length} user(s).`,
    });
  };

  // Pagination
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const startIndex = (currentPage - 1) * tasksPerPage;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + tasksPerPage);

  if (!currentUser) {
    return <AuthModal isOpen={true} onClose={() => {}} onLogin={setCurrentUser} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header 
        user={currentUser} 
        onLogout={() => setCurrentUser(null)}
        onLogin={() => setIsAuthModalOpen(true)}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <aside className="lg:w-80">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24">
              <TaskFilters
                filterStatus={filterStatus}
                filterPriority={filterPriority}
                searchTerm={searchTerm}
                sortBy={sortBy}
                onFilterStatusChange={setFilterStatus}
                onFilterPriorityChange={setFilterPriority}
                onSearchChange={setSearchTerm}
                onSortChange={setSortBy}
                taskCounts={{
                  total: tasks.length,
                  completed: tasks.filter(t => t.status === "completed").length,
                  inProgress: tasks.filter(t => t.status === "in-progress").length,
                  todo: tasks.filter(t => t.status === "todo").length
                }}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  My Tasks
                </h1>
                <p className="text-gray-600 mt-1">
                  {filteredTasks.length} of {tasks.length} tasks
                </p>
              </div>
              
              <Button 
                onClick={() => {
                  setEditingTask(null);
                  setIsTaskFormOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>
            </div>

            <TaskList
              tasks={paginatedTasks}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
              onShareTask={handleShareTask}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={() => {
          setIsTaskFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? 
          (data) => {
            handleUpdateTask(editingTask.id, data);
            setIsTaskFormOpen(false);
            setEditingTask(null);
          } : 
          handleCreateTask
        }
        editingTask={editingTask}
      />

      {sharingTask && (
        <ShareTask
          isOpen={isShareModalOpen}
          onClose={() => {
            setIsShareModalOpen(false);
            setSharingTask(null);
          }}
          task={sharingTask}
          onShare={handleTaskShare}
        />
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={setCurrentUser}
      />
    </div>
  );
};

export default Index;
