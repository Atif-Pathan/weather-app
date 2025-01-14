import TodoItem from "./TodoItem.js";

class Category {
  constructor(name, todos = []) {
    if (!name) {
      throw new Error("Category name is required.");
    }

    this.name = name; // Unique identifier (no UUID needed since name is unique)
    this.todos = todos; // Array of TodoItem objects
  }

  // Private method to trigger contentUpdated event
  _triggerContentUpdated() {
    const event = new CustomEvent("contentUpdated", { detail: { category: this.name } });
    document.dispatchEvent(event);
  }

  // Add a todo item to the category
  addTodo(todo) {
    if (!(todo instanceof TodoItem)) {
      throw new Error("Only TodoItem instances can be added to a category.");
    }
    this.todos.push(todo);
    this._triggerContentUpdated(); // Trigger event after adding a todo
  }

  // Remove a todo item from the category by ID
  removeTodo(todoId) {
    const originalLength = this.todos.length;
    this.todos = this.todos.filter((todo) => todo.getId() !== todoId);
    if (this.todos.length !== originalLength) {
      this._triggerContentUpdated(); // Trigger event if a todo was removed
    }
  }

  // Update a todo item by ID
  updateTodo(todoId, updates) {
    const todo = this.getTodoById(todoId);
    if (!todo) {
      throw new Error(`Todo with ID "${todoId}" not found.`);
    }

    if (updates.title) todo.setTitle(updates.title);
    if (updates.description) todo.setDescription(updates.description);
    if (updates.dueDate) todo.setDueDate(updates.dueDate);
    if (updates.priority) todo.setPriority(updates.priority);
    if (updates.status) todo.setStatus(updates.status);

    this._triggerContentUpdated(); // Trigger event after updating a todo
  }

  // Get a todo item by ID
  getTodoById(todoId) {
    return this.todos.find((todo) => todo.getId() === todoId) || null;
  }

  // List all todos in the category
  listTodos() {
    return this.todos;
  }

  // Get todos by status
  getTodosByStatus(status) {
    const validStatuses = ["incomplete", "complete", "overdue"];
    if (!validStatuses.includes(status)) {
      throw new Error(
        `Invalid status: "${status}". Valid statuses are ${validStatuses.join(", ")}.`
      );
    }

    return this.todos.filter((todo) => todo.getStatus() === status);
  }

  // Get todos by priority
  getTodosByPriority(priority) {
    const validPriorities = ["low", "medium", "high"];
    if (!validPriorities.includes(priority)) {
      throw new Error(
        `Invalid priority: "${priority}". Valid priorities are ${validPriorities.join(", ")}.`
      );
    }

    return this.todos.filter((todo) => todo.getPriority() === priority);
  }

  // Sort todos by a specific property
  sortTodosBy(property, order = "asc") {
    const validProperties = ["dueDate", "priority"];
    if (!validProperties.includes(property)) {
      throw new Error(
        `Invalid sort property: "${property}". Valid properties are ${validProperties.join(", ")}.`
      );
    }

    // Clone and sort to avoid mutating the original array
    const sortedTodos = [...this.todos].sort((a, b) => {
      let comparison = 0;

      if (property === "dueDate") {
        const dateA = a.getDueDate() ? new Date(a.getDueDate()) : null;
        const dateB = b.getDueDate() ? new Date(b.getDueDate()) : null;

        if (dateA && dateB) {
          comparison = dateA - dateB;
        } else if (!dateA && dateB) {
          comparison = -1;
        } else if (dateA && !dateB) {
          comparison = 1;
        }
      } else if (property === "priority") {
        const priorityOrder = { low: 1, medium: 2, high: 3 };
        comparison =
          priorityOrder[a.getPriority()] - priorityOrder[b.getPriority()];
      }

      return order === "asc" ? comparison : -comparison;
    });

    return sortedTodos;
  }

  // Serialize the category object to JSON
  toJSON() {
    return {
      name: this.name,
      todos: this.todos.map((todo) => todo.toJSON()), // Convert each TodoItem to JSON
    };
  }

  // Recreate a Category instance from JSON
  static fromJSON(jsonData) {
    const todos = jsonData.todos.map((todoData) => TodoItem.fromJSON(todoData)); // Recreate TodoItems
    return new Category(jsonData.name, todos); // Create a new category with the given name and todos
  }
}

export default Category;
