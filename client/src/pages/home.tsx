import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { SquareCheck, Plus, Edit2, Trash2, List, CheckCircle, Clock } from "lucide-react";
import type { Todo, InsertTodo } from "@shared/schema";

type FilterType = "all" | "active" | "completed";

export default function Home() {
  const [newTodoText, setNewTodoText] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch todos
  const { data: todos = [], isLoading } = useQuery<Todo[]>({
    queryKey: ["/api/todos"],
  });

  // Create todo mutation
  const createTodoMutation = useMutation({
    mutationFn: async (data: InsertTodo) => {
      const response = await apiRequest("POST", "/api/todos", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
      setNewTodoText("");
      toast({
        title: "Success",
        description: "Task created successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update todo mutation
  const updateTodoMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<InsertTodo> }) => {
      const response = await apiRequest("PATCH", `/api/todos/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
      toast({
        title: "Success",
        description: "Task updated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete todo mutation
  const deleteTodoMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/todos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
      setDeleteId(null);
      toast({
        title: "Success",
        description: "Task deleted successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    createTodoMutation.mutate({
      text: newTodoText.trim(),
      completed: false,
    });
  };

  const handleToggleComplete = (todo: Todo) => {
    updateTodoMutation.mutate({
      id: todo.id,
      updates: { completed: !todo.completed },
    });
  };

  const handleStartEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editText.trim() || !editingId) return;

    updateTodoMutation.mutate({
      id: editingId,
      updates: { text: editText.trim() },
    });
    setEditingId(null);
    setEditText("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteTodoMutation.mutate(deleteId);
    }
  };

  // Filter todos
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  // Calculate stats
  const totalTodos = todos.length;
  const completedTodos = todos.filter((todo) => todo.completed).length;
  const activeTodos = totalTodos - completedTodos;

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = now.getTime() - new Date(date).getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return new Date(date).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else {
      return new Date(date).toLocaleDateString();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <SquareCheck className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">TodoApp</h1>
                <p className="text-sm text-slate-600">Stay organized, get things done</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-slate-600">Welcome back,</p>
                <p className="font-semibold text-slate-900">John Doe</p>
              </div>
              <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
                <span className="text-slate-600 text-sm">JD</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Create Todo Form */}
        <Card className="p-6 mb-8 rounded-2xl border-slate-200">
          <form onSubmit={handleCreateTodo} className="flex gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="What needs to be done?"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                className="px-4 py-3 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-500"
              />
            </div>
            <Button
              type="submit"
              disabled={createTodoMutation.isPending || !newTodoText.trim()}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl min-w-fit"
            >
              <Plus className="text-sm mr-2" />
              <span className="hidden sm:inline">Add Task</span>
            </Button>
          </form>
        </Card>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={filter === "all" ? "default" : "ghost"}
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              filter === "all"
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            All Tasks <span className="ml-1 text-sm opacity-75">{totalTodos}</span>
          </Button>
          <Button
            variant={filter === "active" ? "default" : "ghost"}
            onClick={() => setFilter("active")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              filter === "active"
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            Active <span className="ml-1 text-sm opacity-75">{activeTodos}</span>
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "ghost"}
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              filter === "completed"
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            Completed <span className="ml-1 text-sm opacity-75">{completedTodos}</span>
          </Button>
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          {isLoading && (
            <Card className="p-6 border-slate-200 rounded-xl">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                <span className="text-slate-600">Loading tasks...</span>
              </div>
            </Card>
          )}

          {!isLoading && filteredTodos.length === 0 && (
            <Card className="p-12 text-center border-slate-200 rounded-xl">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <List className="text-slate-400 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No tasks yet</h3>
              <p className="text-slate-600">Create your first task to get started!</p>
            </Card>
          )}

          {filteredTodos.map((todo) => (
            <Card
              key={todo.id}
              className={`p-4 border transition-all duration-200 rounded-xl hover:shadow-md hover:-translate-y-0.5 group ${
                editingId === todo.id ? "border-blue-200 shadow-md" : "border-slate-200"
              }`}
            >
              {editingId === todo.id ? (
                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    <Checkbox checked={todo.completed} disabled />
                  </div>
                  <div className="flex-1 min-w-0">
                    <form onSubmit={handleSaveEdit}>
                      <Input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full px-3 py-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 font-medium mb-2"
                        autoFocus
                      />
                      <div className="flex items-center space-x-2">
                        <Button
                          type="submit"
                          size="sm"
                          disabled={updateTodoMutation.isPending || !editText.trim()}
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg"
                        >
                          Save
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleCancelEdit}
                          className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium rounded-lg"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="flex items-start space-x-4">
                  <button className="mt-1" onClick={() => handleToggleComplete(todo)}>
                    <Checkbox
                      checked={todo.completed}
                      className="w-5 h-5 border-2 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p
                          className={`text-slate-900 font-medium break-words ${
                            todo.completed ? "line-through opacity-60" : ""
                          }`}
                        >
                          {todo.text}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500">
                          <span>{formatDate(todo.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStartEdit(todo)}
                          className="p-2 text-slate-400 hover:text-blue-500"
                        >
                          <Edit2 className="text-sm" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(todo.id)}
                          className="p-2 text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="text-sm" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Stats */}
        <Card className="mt-8 p-6 border-slate-200 rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <List className="text-blue-600 text-xl" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{totalTodos}</p>
              <p className="text-sm text-slate-600">Total Tasks</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="text-emerald-600 text-xl" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{completedTodos}</p>
              <p className="text-sm text-slate-600">Completed</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Clock className="text-orange-600 text-xl" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{activeTodos}</p>
              <p className="text-sm text-slate-600">Remaining</p>
            </div>
          </div>
        </Card>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="max-w-sm rounded-2xl">
          <AlertDialogHeader>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="text-red-600 text-xl" />
            </div>
            <AlertDialogTitle className="text-center">Delete Task</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex space-x-3">
            <AlertDialogCancel className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteTodoMutation.isPending}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
