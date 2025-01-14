import Category from "./Category.js";
import TodoItem from "./TodoItem.js";

class TaskManager {
  static instance;
  static defaultCategoryName = "General";
  static STORAGE_KEY = "TASK_MANAGER_DATA";

  constructor() {
    if (TaskManager.instance) {
      return TaskManager.instance; // Return existing singleton instance
    }

    this.categories = [];
    this._loadFromStorage(); // Load data from localStorage if available
    this._ensureDefaultCategory(); // Ensure default category exists

    this._setupEventListeners(); // Setup listeners for global events

    TaskManager.instance = this; // Store the new instance
  }

  // Private method to trigger contentUpdated event
  _triggerContentUpdated() {
    const event = new CustomEvent("contentUpdated");
    document.dispatchEvent(event);
    console.log("TaskManager: contentUpdated event triggered");
  }

  // Set up global event listeners
  _setupEventListeners() {
    document.addEventListener("contentUpdated", () => {
      console.log("TaskManager: contentUpdated event detected");
      this.saveToLocalStorage(); // Save to localStorage whenever content is updated
    });
  }

  _ensureDefaultCategory() {
    // Create the default category if it doesn't exist
    if (
      !this.categories.find(
        (cat) => cat.name === TaskManager.defaultCategoryName
      )
    ) {
      this.categories.push(new Category(TaskManager.defaultCategoryName));
      this.saveToLocalStorage(); // Save changes to localStorage
    }
  }

  // -- Local Storage Methods --
  _saveToStorage() {
    const data = this.categories.map((category) => category.toJSON());
    localStorage.setItem(TaskManager.STORAGE_KEY, JSON.stringify(data));
  }

  _loadFromStorage() {
    const data = localStorage.getItem(TaskManager.STORAGE_KEY);
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        this.categories = parsedData.map((categoryData) =>
          Category.fromJSON(categoryData)
        );
      } catch (error) {
        console.error("Failed to load data from localStorage:", error);
        this.categories = [];
      }
    }
  }

  saveToLocalStorage() {
    this._saveToStorage();
    console.log("TaskManager: Data saved to localStorage");
  }

  loadFromLocalStorage() {
    this._loadFromStorage();
    this._triggerContentUpdated();
  }

  // -- Category Management --
  getAllCategories() {
    return this.categories;
  }

  createCategory(name) {
    if (
      this.categories.find((cat) => cat.name.toLowerCase() === name.toLowerCase())
    ) {
      throw new Error(`Category "${name}" already exists. Please use a different name`);
    }
    const category = new Category(name);
    this.categories.push(category);
    console.log("category created:");
    console.log("\n\n\n\n");
    
    console.log(this.categories);
    
    this.saveToLocalStorage(); // Save changes to localStorage
    this._triggerContentUpdated(); // Trigger update
  }

  getCategoryByName(name) {
    return this.categories.find((cat) => cat.name === name);
  }

  deleteCategory(name) {
    const index = this.categories.findIndex((cat) => cat.name === name);
    if (index === -1) {
      throw new Error(`Category "${name}" not found.`);
    }
    this.categories.splice(index, 1);
    this.saveToLocalStorage(); // Save changes to localStorage
    this._triggerContentUpdated(); // Trigger update
  }

  renameCategory(oldName, newName) {
    const category = this.getCategoryByName(oldName);
    if (!category) {
      throw new Error(`Category "${oldName}" not found.`);
    }
    if (
      this.categories.find((cat) => cat.name.toLowerCase() === newName.toLowerCase())
    ) {
      throw new Error(`Category "${newName}" already exists.`);
    }
    category.name = newName;
    this.saveToLocalStorage(); // Save changes to localStorage
    this._triggerContentUpdated(); // Trigger update
  }

  // -- Todo Management (within a category) --
  addTodoToCategory(todoDetails, categoryName = TaskManager.defaultCategoryName) {
    const category = this.getCategoryByName(categoryName);
    if (!category) {
      throw new Error(`Category "${categoryName}" not found.`);
    }
    const todo = new TodoItem(todoDetails);
    category.addTodo(todo);
    // No need to trigger _triggerContentUpdated() here; Category handles it
  }

  deleteTodo(todoId, categoryName) {
    const category = this.getCategoryByName(categoryName);
    if (!category) {
      throw new Error(`Category "${categoryName}" not found.`);
    }

    category.removeTodo(todoId);
    // No need to trigger _triggerContentUpdated() here; Category handles it
  }

  updateTodo(todoId, categoryName, updatedDetails) {
    const category = this.getCategoryByName(categoryName);
    if (!category) {
      throw new Error(`Category "${categoryName}" not found.`);
    }

    const todo = category.getTodoById(todoId);
    if (!todo) {
      throw new Error(
        `Todo with ID "${todoId}" not found in category "${categoryName}".`
      );
    }

    if (updatedDetails.title) todo.setTitle(updatedDetails.title);
    if (updatedDetails.description) todo.setDescription(updatedDetails.description);
    if (updatedDetails.dueDate) todo.setDueDate(updatedDetails.dueDate);
    if (updatedDetails.priority) todo.setPriority(updatedDetails.priority);
    if (updatedDetails.status) todo.setStatus(updatedDetails.status);

    // No need to trigger _triggerContentUpdated() here; TodoItem handles it
  }

  moveTodo(todoId, fromCategoryName, toCategoryName) {
    const fromCategory = this.getCategoryByName(fromCategoryName);
    if (!fromCategory) {
      throw new Error(`Source category "${fromCategoryName}" not found.`);
    }

    const toCategory = this.getCategoryByName(toCategoryName);
    if (!toCategory) {
      throw new Error(`Destination category "${toCategoryName}" not found.`);
    }

    const todo = fromCategory.getTodoById(todoId);
    if (!todo) {
      throw new Error(
        `Todo with ID "${todoId}" not found in category "${fromCategoryName}".`
      );
    }
    fromCategory.removeTodo(todoId);
    toCategory.addTodo(todo);
    // No need to trigger _triggerContentUpdated() here; Category handles it
  }

  checkOverdueTodos() {
    const currentDate = new Date();
    let changed = false;

    this.categories.forEach((category) => {
      category.listTodos().forEach((todo) => {
        const wasOverdue = (todo.getStatus() === 'overdue');
        // "Silent" check: it will update the todo’s status, 
        // but skip `_triggerContentUpdated()` calls if coming from here
        todo.checkOverdue(currentDate, { silent: true }); 
        
        // If just changed from not-overdue => overdue:
        if (!wasOverdue && todo.getStatus() === 'overdue') {
          changed = true;
        }
      });
    });

    // Only persist to localStorage if any statuses actually changed
    if (changed) {
      this.saveToLocalStorage();
    }
  }

  // -- Filtering & Sorting (Global for all todos) --
  getTodosByStatus(status) {
    const validStatuses = ["incomplete", "complete", "overdue"];
    if (!validStatuses.includes(status)) {
      throw new Error(
        `Invalid status: "${status}". Valid statuses are ${validStatuses.join(", ")}.`
      );
    }

    return this.categories.flatMap((cat) =>
      cat.listTodos().filter((todo) => todo.getStatus() === status)
    );
  }

  getTodosByPriority(priority) {
    const validPriorities = ["low", "medium", "high"];
    if (!validPriorities.includes(priority)) {
      throw new Error(
        `Invalid priority: "${priority}". Valid priorities are ${validPriorities.join(", ")}.`
      );
    }

    return this.categories.flatMap((cat) =>
      cat.listTodos().filter((todo) => todo.getPriority() === priority)
    );
  }

  sortTodosBy(property, order = "asc") {
    const validProperties = ["dueDate", "priority"];
    if (!validProperties.includes(property)) {
      throw new Error(
        `Invalid sort property: "${property}". Valid properties are ${validProperties.join(", ")}.`
      );
    }

    return this.categories
      .flatMap((cat) =>
        cat.listTodos().map((todo) => ({ todo, categoryName: cat.name }))
      )
      .sort((a, b) => {
        let comparison = 0;

        if (property === "dueDate") {
          const dateA = a.todo.getDueDate() ? new Date(a.todo.getDueDate()) : null;
          const dateB = b.todo.getDueDate() ? new Date(b.todo.getDueDate()) : null;

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
            priorityOrder[a.todo.getPriority()] - priorityOrder[b.todo.getPriority()];
        }

        return order === "asc" ? comparison : -comparison;
      });
  }

  getStatsForCategory(categoryName) {
    const category = this.getCategoryByName(categoryName);
    if (!category) {
      throw new Error(`Category "${categoryName}" not found.`);
    }

    const stats = {
      totalTodos: category.todos.length,
      incomplete: 0,
      complete: 0,
      overdue: 0,
    };

    category.listTodos().forEach((todo) => {
      const status = todo.getStatus();
      if (status === "incomplete") stats.incomplete++;
      if (status === "complete") stats.complete++;
      if (status === "overdue") stats.overdue++;
    });

    return stats;
  }
}

export default new TaskManager();
