import TaskManager from './TaskManager.js';

class CategoryUIManager {
  constructor() {
    if (CategoryUIManager.instance) {
      return CategoryUIManager.instance; // Enforce singleton
    }

    this.categoriesContainer = document.querySelector('.categories .segmented-control');

    if (!this.categoriesContainer) {
      throw new Error('Categories container not found!');
    }

    CategoryUIManager.instance = this; // Cache the instance
  }

  /**
   * Renders all categories in the UI.
   */
  renderCategories() {
    // Clear the existing categories container
    this.categoriesContainer.innerHTML = '';
    console.log("call render category");
    

    const categories = TaskManager.getAllCategories();

    if (categories.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.textContent = 'No categories available.';
      emptyMessage.classList.add('empty-message');
      this.categoriesContainer.appendChild(emptyMessage);
      return;
    }

    categories.forEach((category) => this.addCategory(category.name, false)); // Add categories without triggering event listeners
  }

  /**
   * Adds a new category to the UI.
   * @param {string} categoryName - The name of the new category.
   * @param {boolean} [selectNewCategory=false] - Whether to select the new category radio button.
   */
  addCategory(categoryName, selectNewCategory = true) {
    if (!categoryName) {
      throw new Error('Category name is required to add it to the UI.');
    }

    // Check if the category already exists in the UI
    if (this.categoriesContainer.querySelector(`#category-${categoryName}`)) {
      console.warn(`Category "${categoryName}" already exists in the UI.`);
      return;
    }

    // Create a new radio input for the category
    const input = document.createElement('input');
    input.type = 'radio';
    input.classList.add('user-category');
    input.id = `category-${categoryName}`;
    input.name = 'vertical-categories';
    input.hidden = true;
    // input.checked = true;

    // Create a label for the category
    const label = document.createElement('label');
    label.setAttribute('for', input.id);
    label.classList.add('categories__tab');
    label.innerHTML = `
      <i class="fa-solid fa-folder fa-sm"></i>
      ${categoryName}
    `;

    // Append the input and label to the container
    this.categoriesContainer.appendChild(input);
    this.categoriesContainer.appendChild(label);

    // Select the new category if required
    console.log(selectNewCategory);
    
    if (selectNewCategory) {
      input.checked = true;
      console.log(`radio checked for ${selectNewCategory}`);

      // Optionally, dispatch a 'change' event to trigger any associated listeners
      const event = new Event('change', { bubbles: true });
      console.log("change even emitted in cat ui mang");
      
      input.dispatchEvent(event);
    }
  }

  /**
   * Removes a category from the UI.
   * @param {string} categoryName - The name of the category to remove.
   */
  removeCategory(categoryName) {
    if (!categoryName) {
      throw new Error('Category name is required to remove it from the UI.');
    }

    // Find and remove the input and label for the category
    const input = this.categoriesContainer.querySelector(`#category-${categoryName}`);
    const label = this.categoriesContainer.querySelector(`label[for="category-${categoryName}"]`);

    if (input) input.remove();
    if (label) label.remove();
  }
}

const categoryUIManager = new CategoryUIManager();

// Listen for the `contentUpdated` event and re-render the categories dynamically
document.addEventListener('contentUpdated', () => {
  categoryUIManager.renderCategories();
});

export default categoryUIManager;
