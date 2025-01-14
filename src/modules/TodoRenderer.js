import TaskManager from "./TaskManager";

class TodoRenderer {
  /**
   * Renders a single todo item as a row-based HTML element.
   * @param {Object} todo - The todo item (instance of TodoItem).
   * @param {Object} [options={}] - Additional options.
   * @param {boolean} [options.showCategory=false] - Whether to display category label.
   * @param {string} [options.categoryName=''] - If you already know the category name.
   * @returns {HTMLElement} - The rendered row element.
   */
  static renderTodoItem(todo, { showCategory = false, categoryName = '', tabId = '' } = {}) {
    // Create the main container for the row
    const row = document.createElement('div');
    row.classList.add('todo-item-row');

    // Completed? Then add 'completed' class
    if (todo.getStatus() === 'complete') {
      row.classList.add('completed');
    }
    // Overdue? Then add 'overdue' class (optional)
    if (todo.getStatus() === 'overdue') {
      row.classList.add('overdue');
    } else {
      row.classList.remove('overdue');
    }

    // Checkbox to toggle complete/incomplete
    // Create checkbox input
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('todo-checkbox');
    checkbox.id = `todo-item-${todo.getId()}`;
    checkbox.checked = (todo.getStatus() === 'complete');
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        todo.setStatus('complete');
      } else {
        todo.setStatus('incomplete');
      }
      // The 'setStatus' call should handle dispatching 'contentUpdated'
    });

    // Create a label to wrap both icon and title
    const label = document.createElement('label');
    label.classList.add('todo-label');
    label.htmlFor = `todo-item-${todo.getId()}`; // Connects the label to the checkbox

    // Create the icon element
    const icon = document.createElement('i');
    icon.classList.add('fa-solid', 'fa-check', 'checkbox-icon');

    // Create the title span (task title)
    const titleSpan = document.createElement('span');
    titleSpan.classList.add('todo-title');
    titleSpan.textContent = todo.getTitle();

    // Append icon and title to the label
    label.appendChild(icon);
    label.appendChild(titleSpan);

    // Append elements to the row
    row.appendChild(checkbox); // Hidden checkbox
    row.appendChild(label);    // Label containing both icon and title


    // description
    const descSpan = document.createElement('span');
    descSpan.classList.add("todo-desc");
    descSpan.textContent = `${todo.getDescription()}`;
    row.appendChild(descSpan);

    // Priority label
    const prioritySpan = document.createElement('span');
    prioritySpan.classList.add('todo-priority', `priority-${todo.getPriority()}`);
    prioritySpan.textContent = `${todo.getPriority()}`;
    row.appendChild(prioritySpan);

    // If we’re in a "global" tab (today, upcoming, overdue), show category
    if (showCategory && categoryName) {
      const categoryBadge = document.createElement('span');
      categoryBadge.classList.add('todo-category-badge');
      categoryBadge.textContent = categoryName;
      row.appendChild(categoryBadge);
    }

    // Due date
    const dueDate = todo.getDueDate();
    const dueSpan = document.createElement('span');
    dueSpan.classList.add('todo-due-date');
    dueSpan.textContent = dueDate ? `Due: ${dueDate}` : 'No due date';
    row.appendChild(dueSpan);

    // (Optional) Edit button (no real functionality yet)
    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-todo-btn');
    editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
    editBtn.title = "Edit todo item";
    // Potentially add logic, e.g. open an "edit" modal
    editBtn.addEventListener('click', () => {
      let catToUpdate;
      if (categoryName) {
        catToUpdate = categoryName;
      } else if (tabId) {
        catToUpdate = tabId.replace('category-', '');  
      }
      import('../components/EmbedForm.js').then(({openEmbeddedForm}) => openEmbeddedForm(tabId, true, todo.getId(), catToUpdate, true));

      if (todo.getStatus() === 'overdue') {
        row.classList.add('overdue');
      } else {
        row.classList.remove('overdue');
      }
    });
    row.appendChild(editBtn);

    const deleteTodoBtn = document.createElement('button');
    deleteTodoBtn.classList.add('delete-todo-btn');
    deleteTodoBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteTodoBtn.title = "Delete todo item";
    deleteTodoBtn.addEventListener('click', () => {
      let catToDelete;
      if (categoryName) {
        catToDelete = categoryName;
      } else if (tabId) {
        catToDelete = tabId.replace('category-', '');  
      }
      const confirmDelete = confirm('Are you sure you want to delete this todo?');
      if (!confirmDelete) return;
      TaskManager.deleteTodo(todo.getId(), catToDelete);
      row.remove();
      if ((catToDelete !== "upcoming" || catToDelete !== "today") && catToDelete === tabId.replace('category-', '')) {
        const radioId = `category-${catToDelete}`;
        const radioBtn = document.getElementById(radioId);
        if (radioBtn) {
          radioBtn.checked = true;
        }
      }
      
    });
    row.appendChild(deleteTodoBtn);

    return row;
  }
}

export default TodoRenderer;
