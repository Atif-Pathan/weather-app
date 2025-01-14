import TaskManager from "../modules/TaskManager.js";

export function openEmbeddedForm(currentTabId = null, editRow = false, todoId = null, categoryName = null, editPressed = false) {

  const row = document.querySelector(".todo-item-row");
  console.log(categoryName);
  console.log(todoId);
  let currentCategory = null;
  let todoItemRow = null;
  if (categoryName && todoId) {
    currentCategory = TaskManager.getCategoryByName(categoryName);
    todoItemRow = currentCategory.getTodoById(todoId);
  }
  const contentView = document.querySelector(".content-view");
  if (!contentView) return console.warn("No .content-view found!");

  // don’t duplicate form if already one in place
  if (contentView.querySelector(".embedded-form")) {
    return; 
  }

  const formContainer = document.createElement("div");
  formContainer.classList.add("embedded-form");

  // Title input
  const titleDiv = document.createElement("div");
  titleDiv.classList.add("title-div");
  const titleLabel = document.createElement("label");
  titleLabel.textContent = "Title (required):";
  titleLabel.htmlFor = 'title';
  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.required = true;
  titleInput.id = "title";
  titleInput.placeholder = "Title";
  titleInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && titleInput.value.trim()) {
      if (editRow) {
        handleUpdateTodo();
      } else {
        handleCreateTodo();
      }
    }
  })
//   titleDiv.appendChild(titleLabel);
  titleDiv.appendChild(titleInput);

  // Description input
  const descDiv = document.createElement("div");
  descDiv.classList.add("desc-div");
  const descriptionLabel = document.createElement("label");
  descriptionLabel.textContent = "Description:";
  descriptionLabel.htmlFor = "description";
  const descriptionInput = document.createElement("textarea");
  descriptionInput.id = "description";
  descriptionInput.maxLength = 400;
  descriptionInput.placeholder = "Description";
//   descDiv.appendChild(descriptionLabel);
  descDiv.appendChild(descriptionInput);

  // Due date input
  const dueDateDiv = document.createElement("div");
  dueDateDiv.classList.add("due-date-div");
  const dueDateLabel = document.createElement("label");
  dueDateLabel.textContent = "Due Date";
  dueDateLabel.htmlFor = "select-date";
  const dueDateInput = document.createElement("input");
  dueDateInput.type = "date";
  dueDateInput.id = "select-date";

  // if (currentTabId && currentTabId.startsWith("today")) {
    // pre-populate date to today
    const today = new Date(); // Get today's date
    const year = today.getFullYear(); // Get the year
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Get the month, pad to 2 digits
    const day = String(today.getDate()).padStart(2, '0'); // Get the day, pad to 2 digits
    dueDateInput.value = `${year}-${month}-${day}`;
  // }
   
  dueDateDiv.appendChild(dueDateLabel);
  dueDateDiv.appendChild(dueDateInput);

  // Priority input
  const prioDiv = document.createElement("div");
  prioDiv.classList.add("prio-div");
  const priorityLabel = document.createElement("label");
  priorityLabel.textContent = "Priority";
  priorityLabel.htmlFor = "prio";
  const prioritySelect = document.createElement("select");
  prioritySelect.id = "prio";
  const priorities = ["Low", "Medium", "High"];
  priorities.forEach((priority) => {
    const option = document.createElement("option");
    option.value = priority.toLowerCase();
    option.textContent = priority;
    prioritySelect.appendChild(option);
  });
  prioDiv.appendChild(priorityLabel);
  prioDiv.appendChild(prioritySelect);

  // Category dropdown
  const catDiv = document.createElement("div");
  catDiv.classList.add("cat-div");
  const categoryLabel = document.createElement("label");
  categoryLabel.textContent = "Category";
  categoryLabel.htmlFor = "category-select";
  const categorySelect = document.createElement("select");
  categorySelect.id = "category-select";
  catDiv.appendChild(categoryLabel);
  catDiv.appendChild(categorySelect);

  // “Create New Category” hidden input
  const newCatInputDiv = document.createElement("div");
  newCatInputDiv.classList.add("new-category-input-div");
  const newCategoryInput = document.createElement("input");
  newCategoryInput.type = "text";
  newCategoryInput.placeholder = "Enter new category";
  newCategoryInput.classList.add("new-category-input");
  newCategoryInput.disabled = true;
  // newCategoryInput.style.display = "none";
  newCatInputDiv.appendChild(newCategoryInput);

  // Populate categories
  function populateCategories() {
    categorySelect.innerHTML = "";
    const categories = TaskManager.getAllCategories();
    if (categories.length === 0) {
      const noCatOption = document.createElement("option");
      noCatOption.value = "";
      noCatOption.textContent = "No categories available";
      noCatOption.disabled = true;
      noCatOption.selected = true;
      categorySelect.appendChild(noCatOption);
    } else {
      categories.forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat.name;
        option.textContent = cat.name;
        categorySelect.appendChild(option);
      });
    }

    // Add “Create New Category” option
    const createOption = document.createElement("option");
    createOption.value = "create-new";
    createOption.textContent = "Add New Category";
    if (!editPressed) {
      categorySelect.appendChild(createOption);
    }

    // Figure out which category to preselect
    let preselectName = null;

    // If currentTabId is a category (like "category-Work")
    if (currentTabId && currentTabId.startsWith("category-")) {
      const catName = currentTabId.replace("category-", "");
      const foundCat = TaskManager.getCategoryByName(catName);
      if (foundCat) {
        preselectName = foundCat.name;
      }
    }

    // Otherwise default to "General" if it exists
    if (!preselectName) {
      const generalCat = TaskManager.getCategoryByName("General");
      if (generalCat) {
        preselectName = "General";
      } else if (categories.length > 0) {
        preselectName = categories[0].name;
      }
    }

    if (preselectName) {
      categorySelect.value = preselectName;
    }
  }

  populateCategories();

  categorySelect.addEventListener("change", () => {
    if (categorySelect.value === "create-new") {
      newCategoryInput.disabled = false;
      newCategoryInput.focus();
    } else {
      newCategoryInput.disabled = true;
    }
  });

  // The “Create” + “Cancel” buttons
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("modal-buttons");

  const createButton = document.createElement("button");
  createButton.textContent = "Create";
  createButton.addEventListener("click", () => {
    if (editRow) {
      handleUpdateTodo();
    } else {
      handleCreateTodo();
    }
  });

  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  cancelButton.addEventListener("click", handleCancel);

  buttonContainer.appendChild(createButton);
  buttonContainer.appendChild(cancelButton);

  // Append all inputs to the container
//   formContainer.appendChild(titleLabel);
//   formContainer.appendChild(titleInput);
  formContainer.appendChild(titleDiv);

//   formContainer.appendChild(descriptionLabel);
//   formContainer.appendChild(descriptionInput);
  formContainer.appendChild(descDiv);

//   formContainer.appendChild(dueDateLabel);
//   formContainer.appendChild(dueDateInput);
  formContainer.appendChild(dueDateDiv);

//   formContainer.appendChild(priorityLabel);
//   formContainer.appendChild(prioritySelect);
  formContainer.appendChild(prioDiv);

//   formContainer.appendChild(categoryLabel);
//   formContainer.appendChild(categorySelect);
  formContainer.appendChild(catDiv);
  formContainer.appendChild(newCatInputDiv);
  
  formContainer.appendChild(buttonContainer);

  const contentHeader = contentView.querySelector(".content-header");
  if (contentHeader) {
    contentHeader.insertAdjacentElement("afterend", formContainer);
  } else {
    // fallback: just append to contentView
    contentView.appendChild(formContainer);
  }

  if (editRow && todoItemRow) {
    titleInput.value = todoItemRow.getTitle();
    descriptionInput.value = todoItemRow.getDescription();
    categorySelect.value = categoryName;
    prioritySelect.value  = todoItemRow.getPriority();
    dueDateInput.value = todoItemRow.getDueDate();
  }

  function handleUpdateTodo() {
    const currCat = categorySelect.value;
    if (categorySelect.options.length > 0) {
      console.log("removed");
      
      const lastIndex = categorySelect.options.length - 1; // Get the index of the last option
      categorySelect.remove(lastIndex); // Remove the last option
    }
    // console.log("updated");
    
    const updatedDetails = {
      title: titleInput.value.trim(),
      description: descriptionInput.value.trim(),
      dueDate: dueDateInput.value ? parseDueDate(dueDateInput.value) : null,
      priority: prioritySelect.value,
      // status: todoItemRow.getStatus()
    };
    // update first
    TaskManager.updateTodo(todoId, categoryName, updatedDetails);
    console.log("todo updated!");
    console.log(categoryName);
    console.log(currentTabId);
    // then move if needed
    if (currCat !== categoryName) {
      console.log(currCat);
      console.log(categoryName);
      
      // need to update category/ move todo
      // throw new Error("error, cant change category");
      TaskManager.moveTodo(todoId, categoryName, currCat);
      console.log(`moved todo from ${categoryName} to ${currCat}`);
    }   
    if ((categoryName !== "upcoming" || categoryName !== "today") && categoryName === currentTabId.replace('category-', '')) {
      const radioId = `category-${categoryName}`;
      const radioBtn = document.getElementById(radioId);
      if (radioBtn) {
        radioBtn.checked = true;
        console.log(`radio btn checked for: ${radioId}`);
        console.log(`current tab: ${currentTabId}`);
      }
      console.log(`current status: ${todoItemRow.getStatus()}`);
    }
    if (todoItemRow.getStatus() === 'overdue') {
      row.classList.add('overdue');
    } else {
      row.classList.remove('overdue');
    }
    handleCancel();
  }

  // === CREATE BUTTON LOGIC ===
  function handleCreateTodo() {
    const todoDetails = {
      title: titleInput.value.trim(),
      description: descriptionInput.value.trim(),
      dueDate: dueDateInput.value ? parseDueDate(dueDateInput.value) : null,
      priority: prioritySelect.value,
    };

    if (!todoDetails.title) {
      alert("Title is required.");
      return;
    }

    let chosenCategory = categorySelect.value;
    if (chosenCategory === "create-new") {
      const newCatName = newCategoryInput.value.trim();
      if (!newCatName) {
        alert("Category name is required.");
        return;
      }
      const formatted = newCatName.charAt(0).toUpperCase() + newCatName.slice(1);
      try {
        TaskManager.createCategory(formatted);
        chosenCategory = formatted;
      } catch (error) {
        alert(error.message);
        return;
      }
    }

    try {
      TaskManager.addTodoToCategory(todoDetails, chosenCategory);
      // Optionally: Switch to the newly added category’s tab
      const radioId = `category-${chosenCategory}`;
      const radioEl = document.getElementById(radioId);
      if (radioEl) {
        radioEl.checked = true;
        console.log(`${radioId} checked`);
        
        const evt = new Event("change", { bubbles: true });
        radioEl.dispatchEvent(evt);
      }
      // Hide the embedded form
      handleCancel();
    } catch (err) {
      alert(err.message);
    }
  }

  function parseDueDate(inputValue) {
    const [year, month, day] = inputValue.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  function handleCancel() {
    // Remove the form from the DOM
    if (formContainer.parentNode) {
      formContainer.parentNode.removeChild(formContainer);
    }
  }

  titleInput.focus();
}
