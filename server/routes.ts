import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTodoSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all todos
  app.get("/api/todos", async (req, res) => {
    try {
      const todos = await storage.getTodos();
      res.json(todos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch todos" });
    }
  });

  // Get single todo
  app.get("/api/todos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const todo = await storage.getTodo(id);
      
      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }

      res.json(todo);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch todo" });
    }
  });

  // Create new todo
  app.post("/api/todos", async (req, res) => {
    try {
      const validatedData = insertTodoSchema.parse(req.body);
      const todo = await storage.createTodo(validatedData);
      res.status(201).json(todo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid todo data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create todo" });
    }
  });

  // Update todo
  app.patch("/api/todos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = insertTodoSchema.partial().parse(req.body);
      
      const updatedTodo = await storage.updateTodo(id, updates);
      
      if (!updatedTodo) {
        return res.status(404).json({ message: "Todo not found" });
      }

      res.json(updatedTodo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid update data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update todo" });
    }
  });

  // Delete todo
  app.delete("/api/todos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteTodo(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Todo not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete todo" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
