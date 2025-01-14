import TaskManager from './TaskManager.js';
import StickyWall from './StickyWall.js';
import TodoRenderer from './TodoRenderer.js';
import categoryUIManager from './CategoryUIManager.js';
import { isSameDay, isAfter, startOfToday, parseISO, isBefore } from 'date-fns';

class TabManager {
  constructor(contentViewSelector) {
    // The container where tab content is rendered
    this.contentView = document.querySelector(contentViewSelector);
    if (!this.contentView) {
      throw new Error('Content view container not found!');
    }

    // Load data from localStorage, then reference TaskManager
    TaskManager.loadFromLocalStorage();
    this.taskManager = TaskManager;

    // Default tab on first load
    this.currentTabId = 'today';

    // Inset shadow offset logic
    this.insetBg = document.querySelector('.inset-bg');
    this.START_POSITION = 7;
    this.SHIFT_AMOUNT = 3;
    this.CATEGORY_OFFSET = 4;

    // Category input references
    this.addCatDiv = document.querySelector('.add-category-input');
    this.addCategoryButton = document.querySelector('.add-category-btn');
    this.NewCatInput = document.getElementById('add-new-category');
    this.submitNewCatButton = document.querySelector('.add-cat');

    // "Add Todo" button -> opens modal
    this.addTodoButton = document.querySelector('.add-todo-btn');
    this.addTodoButton.addEventListener('click', () => {
      import('../components/EmbedForm.js').then(({openEmbeddedForm}) => openEmbeddedForm(this.currentTabId));
    });

    // The <nav> element (for radio–change handling)
    this.nav = document.querySelector('.nav');

    // Render the default tab initially
    this.renderTabContent(this.currentTabId);

    // Listen for global "contentUpdated" to re-render
    document.addEventListener("contentUpdated", (event) => {
      const previousTabId = event.detail?.previousTabId || null; // Extract the previous tab ID
  
      // Re-render categories in the UI
      categoryUIManager.renderCategories();
  
      // If a previous tab ID is provided, select it
      if (previousTabId) {
          const previousTabRadio = document.getElementById(previousTabId);
          if (previousTabRadio) {
              previousTabRadio.checked = true;
  
              // Dispatch the "change" event to trigger associated listeners
              const changeEvent = new Event("change", { bubbles: true });
              previousTabRadio.dispatchEvent(changeEvent);
  
              // Update currentTabId to reflect the newly selected tab
              this.currentTabId = previousTabId;
          }
      }
  
      // Refresh the content view for the currentTabId
      this.renderTabContent(this.currentTabId);
    });
  

    // Set up old index.js logic
    this.setupNavChangeListeners();   // The radio–button code
    this.setupAddCategoryListeners(); // Show/hide add–category input
    this.setupSubmitCategory();       // "submitCategory" logic
  }

  //--------------------------------------------
  // (A) NAV RADIO-CHANGE LOGIC
  //--------------------------------------------
  setupNavChangeListeners() {
    if (!this.nav) return;

    this.nav.addEventListener('change', (event) => {
      const radio = event.target;
      console.log(radio);
      
      console.log("change event triggered in setupNavChangeListeners");
      
      if (radio.tagName === 'INPUT' && radio.type === 'radio') {
        // 1) Only one radio can be checked at a time
        const allRadios = document.querySelectorAll(
          '.tasks input[type="radio"], .categories input[type="radio"]'
        );
        allRadios.forEach((otherRadio) => {
          if (otherRadio !== radio && otherRadio.name !== radio.name) {
            otherRadio.checked = false;
          }
        });

        // 2) Decide if it's tasks or categories
        const isTaskRadio = radio.closest('.tasks') !== null;
        const taskRadios = document.querySelectorAll('.tasks input[type="radio"]');
        const categoryRadios = document.querySelectorAll('.categories input[type="radio"]');

        // 3) Figure out the radio's index
        const index = isTaskRadio
          ? Array.from(taskRadios).indexOf(radio)
          : Array.from(categoryRadios).indexOf(radio) + taskRadios.length;

        // 4) If category, add offset
        const offset = isTaskRadio ? 0 : this.CATEGORY_OFFSET;
        const newPosition = this.START_POSITION + index * this.SHIFT_AMOUNT + offset;

        if (this.insetBg) {
          this.insetBg.style.top = `${newPosition}rem`;
        }

        // 5) Render that tab's content
        this.renderTabContent(radio.id);
      }
    });
  }

  //--------------------------------------------
  // (B) SHOW/HIDE ADD–CATEGORY INPUT
  //--------------------------------------------
  setupAddCategoryListeners() {
    // The button that toggles "Add Category" input
    this.addCategoryButton.addEventListener('click', () => {
      const checkedCatRadio = document.querySelector('.categories input[type="radio"]:checked');
      if (this.addCatDiv.classList.contains('open')) {
        // Closing
        if (checkedCatRadio) {
          const currentTop = parseFloat(this.insetBg?.style.top) || this.START_POSITION;
          this.insetBg.style.top = `${currentTop - this.SHIFT_AMOUNT}rem`;
        }
        this.hideAddCategoryInput();
      } else {
        // Opening
        if (checkedCatRadio) {
          const currentTop = parseFloat(this.insetBg?.style.top) || this.START_POSITION;
          this.insetBg.style.top = `${currentTop + this.SHIFT_AMOUNT}rem`;
        }
        this.showAddCategoryInput();
      }
      // Focus the input
      if (this.NewCatInput) {
        this.NewCatInput.focus();
      }
    });

    // If user clicks outside, close it
    document.addEventListener('click', (event) => {
      if (
        !this.addCatDiv.contains(event.target) &&
        !this.addCategoryButton.contains(event.target) &&
        this.addCatDiv.classList.contains('open')
      ) {
        const checkedCatRadio = document.querySelector('.categories input[type="radio"]:checked');
        if (checkedCatRadio) {
          const currentTop = parseFloat(this.insetBg?.style.top) || this.START_POSITION;
          this.insetBg.style.top = `${currentTop - this.SHIFT_AMOUNT}rem`;
        }
        this.hideAddCategoryInput();
      }
    });
  }

  showAddCategoryInput() {
    this.addCatDiv.style.display = 'flex';
    requestAnimationFrame(() => {
      this.addCatDiv.classList.add('open');
    });
  }

  hideAddCategoryInput() {
    this.addCatDiv.classList.remove('open');
    this.addCatDiv.addEventListener('transitionend', function onTransitionEnd() {
      if (!this.classList.contains('open')) {
        this.style.display = 'none';
      }
      this.removeEventListener('transitionend', onTransitionEnd);
    });
  }

  //--------------------------------------------
  // (C) SUBMIT NEW CATEGORY
  //--------------------------------------------
  setupSubmitCategory() {
    this.submitNewCatButton.addEventListener('click', () => {
      this.submitCategory();
    });

    // Press enter inside the input
    this.NewCatInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        this.submitCategory();
      }
    });
  }

  submitCategory() {
    if (!this.NewCatInput) return;
    const rawVal = this.NewCatInput.value.trim();
    if (!rawVal) return;

    if (/[^a-zA-Z-_]/.test(rawVal)) { // Allow only letters, dashes, and underscores
      alert(
        "Invalid category name!\n\n" +
        "Please ensure your category name meets the following requirements:\n" +
        "- Only letters (A-Z or a-z) are allowed\n" +
        "- Dashes (-) and underscores (_) are allowed\n" +
        "- No spaces, numbers, or special characters\n\n" +
        "Example of valid names: Work, Personal_Tasks, To-Do."
      );
      return;
    }

    try {
      const catName = rawVal.charAt(0).toUpperCase() + rawVal.slice(1);
      // Create the category in the manager
      this.taskManager.createCategory(catName);

      // Optionally update UI, or rely on contentUpdated to do so
      // e.g. categoryUIManager.addCategory(catName);

      // Then check that radio
      const newCatId = `category-${catName}`;
      const newCatRadio = document.getElementById(newCatId);
      if (newCatRadio) {
        newCatRadio.checked = true;
        // Trigger "change" so we offset + display correct tab
        const evt = new Event('change', { bubbles: true });
        newCatRadio.dispatchEvent(evt);
      }
    } catch (err) {
      alert(err.message);
      return;
    } finally {
      // Cleanup
      this.NewCatInput.value = '';
      this.hideAddCategoryInput();
    }
  }

  //--------------------------------------------
  // (D) RENDER TAB CONTENT
  //--------------------------------------------
  renderTabContent(tabId) {
    this.currentTabId = tabId;
    this.contentView.innerHTML = '';

    // Header
    const header = document.createElement('div');
    header.classList.add('content-header');

    const title = document.createElement('h2');
    title.textContent = this.getTabTitle(tabId);
    title.classList.add('page-title');
    header.appendChild(title);

    if (tabId.startsWith("category-") && !tabId.startsWith("category-General")) {
      const deleteCatButton = document.createElement('button');
      deleteCatButton.innerHTML = '<i class="fa-solid fa-trash fa-lg"></i>';
      deleteCatButton.title = "Delete Category";
      deleteCatButton.classList.add("delete-cat-btn");
      deleteCatButton.addEventListener("click", () => {
          const confirmDelete = confirm('Are you sure you want to delete this category? It will delete ALL the todos within it as well!');
          if (confirmDelete) {
            const categories = Array.from(document.querySelectorAll('.user-category')); // All category inputs
            const currentIndex = categories.findIndex(category => category.id === tabId);
            console.log(currentIndex);
            
    
            if (currentIndex === -1) {
                console.error(`Category with ID "${tabId}" not found in the list of categories.`);
                return;
            }
    
            if (currentIndex > 0) {
              const categoryAbove = categories[currentIndex - 1];
              const previousTabId = categoryAbove.id; // Capture the category above's ID
              console.log("Category above selected:", previousTabId);
          
              this.taskManager.deleteCategory(tabId.replace("category-", ""));
              console.log("Deleted tab ID:", tabId);
          
              // Trigger "contentUpdated" and pass the previousTabId
              const contentUpdatedEvent = new CustomEvent("contentUpdated", {
                  detail: { previousTabId },
              });
              document.dispatchEvent(contentUpdatedEvent);
            } else {
                console.log("This is the first category; no category above.");
            }
          
          }  
      });
      header.appendChild(deleteCatButton);
    }
  
    if (tabId === 'all-tasks' || tabId === 'overdue') {
      this.addTodoButton.style.display = "none";
    } else {
      this.addTodoButton.style.display = "flex";
    }

    this.contentView.appendChild(header);

    // Render sticky or normal tasks
    if (tabId === 'all-tasks') {
      // The "sticky wall"
      const todosGrid = document.createElement('div');
      todosGrid.classList.add('category-grid');

      const cats = this.taskManager.getAllCategories();
      if (!cats.length) {
        const msg = document.createElement('p');
        msg.textContent = 'No categories exist. Create a new category to add Todos to!';
        msg.classList.add('empty-message-sticky');
        todosGrid.appendChild(msg);
      } else {
        StickyWall.renderAllCategories(cats, todosGrid);
      }
      this.contentView.appendChild(todosGrid);

    } else {
      // Normal "tasks" view
      const todosList = document.createElement('div');
      todosList.classList.add('todo-item-list');

      const todos = this.getTodosForTab(tabId);
      if (todos.length) {
        todos.forEach((todo) => {
          let showCategory = false;
          let catName = '';

          if (tabId === 'today' || tabId === 'upcoming' || tabId === 'overdue') {
            // find the category for this todo
            const foundCat = this.taskManager.getAllCategories().find((c) => c.getTodoById(todo.getId()));
            if (foundCat) {
              showCategory = true;
              catName = foundCat.name;
            }
          }

          const todoItem = TodoRenderer.renderTodoItem(todo, {
            showCategory: showCategory,
            categoryName: catName,
            tabId: tabId
          });
          todosList.appendChild(todoItem);
        });
      } else {
        const msg = document.createElement('p');
        if (tabId === 'overdue') {
          msg.innerHTML = 'No overdue tasks. Keep it up!';
        } else if (tabId === 'today') {
          msg.innerHTML = 'No tasks for today!';
        } else if (tabId === 'upcoming') {
          msg.innerHTML =
            'No upcoming tasks, maybe you missed some in the <u>overdue section</u>!';
        } else {
          msg.innerHTML = `No tasks in ${tabId.replace('category-', '')}.`;
        }
        msg.classList.add('empty-message-todo');
        todosList.appendChild(msg);
      }
      this.contentView.appendChild(todosList);
    }
  }

  getTodosForTab(tabId) {
    if (tabId === 'overdue') {
      this.taskManager.checkOverdueTodos(); 
    }
    const today = startOfToday();
    if (tabId === 'all-tasks') {
      return this.taskManager.getAllCategories().flatMap((cat) => cat.listTodos());
    } else if (tabId === 'today') {
      return this.taskManager
        .getAllCategories()
        .flatMap((cat) =>
          cat.listTodos().filter((td) =>
            td.getDueDate() ? isSameDay(parseISO(td.getDueDate()), today) : null
          )
        );
    } else if (tabId === 'upcoming') {
      return this.taskManager
        .getAllCategories()
        .flatMap((cat) =>
          cat.listTodos().filter((td) =>
            td.getDueDate()
              ? isAfter(parseISO(td.getDueDate()), today)
              : null
          )
        );
    } else if (tabId === 'overdue') {
      return this.taskManager
        .getAllCategories()
        .flatMap((cat) =>
          cat.listTodos().filter((td) =>
            td.getDueDate()
              ? isBefore(parseISO(td.getDueDate()), today)
              : null
          )
        );
    } else {
      const catName = tabId.replace('category-', '');
      const cat = this.taskManager.getCategoryByName(catName);
      return cat ? cat.listTodos() : [];
    }
  }

  getTabTitle(tabId) {
    if (tabId === 'all-tasks') return 'The Sticky Wall';
    if (tabId === 'today') return "Today's Tasks";
    if (tabId === 'upcoming') return 'Upcoming Tasks';
    if (tabId === 'overdue') return 'Overdue Tasks';
    const name = tabId.replace('category-', '');
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
}

export default TabManager;
