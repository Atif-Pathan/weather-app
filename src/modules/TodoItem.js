import { v4 as uuidv4 } from "uuid";
import { format, isBefore, startOfDay, isAfter, isEqual } from "date-fns";

class TodoItem {
  constructor({
    id = uuidv4(), // Use provided id (e.g., from localStorage) or generate a new one
    title,
    description = "",
    dueDate = null,
    priority = "low",
    status = "incomplete",
    createdDate = startOfDay(new Date()), // Use provided date or current date
    updatedDate = startOfDay(new Date()),
  } = {}) {
    if (!title) {
      throw new Error("Title is required for a TodoItem.");
    }

    this.id = id;
    this.title = title;
    this.description = description;

    // Normalize the dueDate to local midnight using startOfDay
    this.dueDate = dueDate ? startOfDay(new Date(dueDate)) : null;

    this.priority = priority;
    this.status = status;

    this.createdDate = startOfDay(new Date(createdDate));
    this.updatedDate = startOfDay(new Date(updatedDate));

    this.checkOverdue();
  }

  // Private method to trigger contentUpdated event
  _triggerContentUpdated() {
    const event = new CustomEvent("contentUpdated");
    document.dispatchEvent(event);
    console.log("Content updated event triggered. IN TODOITEM");
  }

  // Getters
  getId() {
    return this.id;
  }

  getTitle() {
    return this.title;
  }

  getDescription() {
    return this.description;
  }

  getDueDate() {
    return this.dueDate ? format(this.dueDate, "yyyy-MM-dd") : null;
  }

  getPriority() {
    return this.priority;
  }

  getStatus() {
    return this.status;
  }

  getCreatedDate() {
    return format(this.createdDate, "yyyy-MM-dd");
  }

  getUpdatedDate() {
    return format(this.updatedDate, "yyyy-MM-dd");
  }

  // Setters
  setTitle(newTitle) {
    if (!newTitle) {
      throw new Error("Title cannot be empty.");
    }
    if (this.title !== newTitle) {
      this.title = newTitle;
      this._updateTimestamp();
      this._triggerContentUpdated(); // Trigger update only if data changes
    }
  }

  setDescription(newDescription) {
    if (this.description !== newDescription) {
      this.description = newDescription;
      this._updateTimestamp();
      this._triggerContentUpdated(); // Trigger update only if data changes
    }
  }

  setDueDate(newDueDate) {
    if (!newDueDate) {
      throw new Error("Invalid date.");
    }
    const normalizedDate = startOfDay(new Date(newDueDate));
    if (this.dueDate === null || this.dueDate.getTime() !== normalizedDate.getTime()) {
      this.dueDate = normalizedDate;
      this.checkOverdue();
      console.log("date changed so called check overdue");
      
      this._updateTimestamp();
      this._triggerContentUpdated(); // Trigger update only if data changes
    }
  }

  setPriority(newPriority) {
    const validPriorities = ["low", "medium", "high"];
    if (!validPriorities.includes(newPriority)) {
      throw new Error("Priority must be 'low', 'medium', or 'high'.");
    }
    if (this.priority !== newPriority) {
      this.priority = newPriority;
      this._updateTimestamp();
      this._triggerContentUpdated(); // Trigger update only if data changes
    }
  }

  setStatus(newStatus, { silent = false } = {}) {
    const validStatuses = ['incomplete', 'complete', 'overdue'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error("Status must be 'incomplete', 'complete', or 'overdue'.");
    }
    if (this.status !== newStatus) {
      this.status = newStatus;
      this.checkOverdue();
      this._updateTimestamp();
  
      // ONLY dispatch contentUpdated if not silent
      if (!silent) {
        this._triggerContentUpdated();
      }
    }
  }

  // Utility Methods
  markAsComplete() {
    if (this.status !== "complete") {
      this.status = "complete";
      this._updateTimestamp();
      this._triggerContentUpdated(); // Trigger update
    }
  }

  markAsIncomplete() {
    if (this.status !== "incomplete") {
      this.status = "incomplete";
      this._updateTimestamp();
      this._triggerContentUpdated(); // Trigger update
    }
  }

  checkOverdue(currentDate = new Date(), { silent = false } = {}) {
    console.log(`${currentDate} - current date`);
    console.log(`${this.dueDate} - due date`);
    
    if (this.status === 'complete') {
      // If the task is marked as complete, don't change its status
      return;
    }
  
    if (this.dueDate && isBefore(this.dueDate, startOfDay(currentDate))) {
      // If the due date is before today, set it to 'overdue'
      if (this.status !== 'overdue') {
        this.setStatus('overdue', { silent });
      }
    } else if (this.dueDate && (isAfter(this.dueDate, startOfDay(currentDate)) || isEqual(this.dueDate, startOfDay(currentDate)))) {
      // If the due date is after today, set it back to 'incomplete'
      if (this.status !== 'incomplete') {
        this.setStatus('incomplete', { silent });
      }
    }
  }
  

  isOverdue(currentDate = new Date()) {
    return this.dueDate && isBefore(this.dueDate, startOfDay(currentDate));
  }

  // Serialization Method: Convert the TodoItem to a plain object
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      dueDate: this.dueDate ? this.dueDate.toISOString() : null, // Store as ISO string
      priority: this.priority,
      status: this.status,
      createdDate: this.createdDate.toISOString(),
      updatedDate: this.updatedDate.toISOString(),
    };
  }

  // Deserialization Method: Create a TodoItem from a plain object
  static fromJSON(jsonData) {
    return new TodoItem({
      id: jsonData.id,
      title: jsonData.title,
      description: jsonData.description,
      dueDate: jsonData.dueDate ? new Date(jsonData.dueDate) : null,
      priority: jsonData.priority,
      status: jsonData.status,
      createdDate: new Date(jsonData.createdDate),
      updatedDate: new Date(jsonData.updatedDate),
    });
  }

  // Private method to update the timestamp after each setter is called
  _updateTimestamp() {
    this.updatedDate = startOfDay(new Date());
  }
}

export default TodoItem;
