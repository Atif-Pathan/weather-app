class StickyWall {
    /**
     * Renders a sticky note for a single category (only if it has tasks).
     * @param {Object} category - The category object.
     * @returns {HTMLElement} - The rendered sticky note element.
     */
    static renderCategoryStickyNote(category) {
      // Note: This method assumes category.todos is non-empty,
      // since we're filtering before calling it.
  
      const stickyNote = document.createElement('div');
      stickyNote.classList.add('category-sticky-note'); // or `.todo-item` if you prefer the old name
  
      // Dynamic background color for each sticky note
      const randomHue = Math.floor(Math.random() * 360); // Randomize hue
      stickyNote.style.backgroundColor = `hsl(${randomHue}, 80%, 90%)`; // Light pastel color
  
      const title = document.createElement('h3');
      title.textContent = category.name; // Assuming `name` is a property of the category
      title.classList.add('category-title');
  
      // Create a list of tasks for the sticky note
      const taskList = document.createElement('ul');
      taskList.classList.add('category-task-list');
  
      category.todos.forEach((todo) => {
        const listItem = document.createElement('li');
        listItem.textContent = todo.getTitle(); // e.g., `todo.getTitle()`
        taskList.appendChild(listItem);
      });
  
      // Clicking the sticky note navigates to the category tab
      stickyNote.addEventListener('click', () => {
        const catRadio = document.getElementById(`category-${category.name}`);
        if (catRadio) catRadio.click(); // Simulate tab click if it exists
      });
  
      // Append elements to the sticky note
      stickyNote.appendChild(title);
      stickyNote.appendChild(taskList);
  
      return stickyNote;
    }
  
    /**
     * Renders all categories as sticky notes, skipping categories with no tasks.
     * @param {Array} categories - Array of category objects.
     * @param {HTMLElement} container - The container to append the sticky notes to.
     */
    static renderAllCategories(categories, container) {
      container.innerHTML = ''; // Clear existing content
  
      // Filter out categories that have zero todos
      const categoriesWithTasks = categories.filter(
        (category) => category.todos && category.todos.length > 0
      );
  
      if (categoriesWithTasks.length === 0) {
        // If no categories have tasks, show "No Todos."
        const noTodosMessage = document.createElement('p');
        noTodosMessage.innerHTML = `No Todos. Click <u>Add Todo</u> on the top right to add your <em>first task</em>!`;
        noTodosMessage.classList.add('empty-message-sticky');
        container.appendChild(noTodosMessage);
        return;
      }
  
      // Otherwise, render a sticky note for each category that has tasks
      categoriesWithTasks.forEach((category) => {
        const stickyNote = StickyWall.renderCategoryStickyNote(category);
        container.appendChild(stickyNote);
      });
    }
}
  
export default StickyWall;
  