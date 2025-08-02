import { type Todo, type InsertTodo } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
  
  // Todo operations
  getTodos(): Promise<Todo[]>;
  getTodo(id: string): Promise<Todo | undefined>;
  createTodo(todo: InsertTodo): Promise<Todo>;
  updateTodo(id: string, updates: Partial<InsertTodo>): Promise<Todo | undefined>;
  deleteTodo(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, any>;
  private todos: Map<string, Todo>;

  constructor() {
    this.users = new Map();
    this.todos = new Map();
  }

  async getUser(id: string): Promise<any | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: any): Promise<any> {
    const id = randomUUID();
    const user: any = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getTodos(): Promise<Todo[]> {
    return Array.from(this.todos.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getTodo(id: string): Promise<Todo | undefined> {
    return this.todos.get(id);
  }

  async createTodo(insertTodo: InsertTodo): Promise<Todo> {
    const id = randomUUID();
    const todo: Todo = {
      ...insertTodo,
      id,
      createdAt: new Date(),
    };
    this.todos.set(id, todo);
    return todo;
  }

  async updateTodo(id: string, updates: Partial<InsertTodo>): Promise<Todo | undefined> {
    const existingTodo = this.todos.get(id);
    if (!existingTodo) {
      return undefined;
    }

    const updatedTodo: Todo = {
      ...existingTodo,
      ...updates,
    };
    this.todos.set(id, updatedTodo);
    return updatedTodo;
  }

  async deleteTodo(id: string): Promise<boolean> {
    return this.todos.delete(id);
  }
}

export const storage = new MemStorage();
