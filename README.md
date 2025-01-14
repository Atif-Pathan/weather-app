# The Todo App

[Something2Do - Live (Click to check it out!)](https://atif-pathan.github.io/todo/)

## Overview

This project is a simple but complete Todo List application developed as part of [The Odin Project](https://www.theodinproject.com/). The focus was on learning and applying JavaScript concepts, adhering to best practices, and implementing modern web development techniques. The app allows users to create, manage, and organize tasks within categories and different tabbed views.

## Key Features

- Create, edit, and delete tasks.
- Organize tasks by projects or categories.
- Add task details, including **title**, **description**, **priority**, and **due date**.
- Mark tasks as completed, with visual indicators.
- Automatically sort tasks by due dates (e.g., Today, Upcoming, Overdue). `in a future update!`
- Persistent data storage using **localStorage**.
- Minimal **neomorphic theme** for a sleek user interface.

## What did I learn? (Concepts and Principles I applied)

- **Single Responsibility Principle (SRP):** Each module or class in the application focuses on a single responsibility. For example, `TabManager` handles navigation logic, while `TaskManager` focuses on task-related data and operations. `TodoItem` only focuses on modelling a single task and `Category` is only concerned with managing a single category and its own todos.

- **Separation of Concerns**
  Following the previous point, I tried to implements a clear separation between the logic, data, and UI components. For example: `TaskManager` handles all task and category-related operations, ensuring centralized data management. While The `CategoryUIManager` and `TabManager` modules are dedicated to updating and managing the user interface.

- **ES6+ Module and JavaScript Classes:** And I used modules and classes to implement the above two points, by exporting and importing modules and creating classes as needed. For example:
  **`TaskManager`:** Manages tasks, categories, and application state.
  **`TodoRenderer`:** Handles rendering a single row for a single todo.
  **`CategoryUIManager`:** Updates the nav tab and the categories in it.

  and more...

- **Event-Driven Programming:** The application uses event listeners extensively to decouple actions from the UI. For instance, a `contentUpdated` custom event is triggered whenever data is modified, ensuring UI components are refreshed dynamically without direct coupling.

- **Dynamic DOM Manipulation:** Tasks and categories are rendered dynamically using JavaScript, minimizing hardcoded HTML. This approach enables the app to handle user interactions like adding or deleting tasks in real-time.

- **Local Storage:** Lastly, I also had a Data persistence layer, using the browser's local storage, ensuring tasks and categories are saved even after the page is reloaded. This also makes it so that any user can have their own todos show up based on their local storage on the same link! I do think in the future a dedicated database will be much better.

## Tools and Technologies

- **JavaScript:** Core programming language used for logic and DOM manipulation.
- **Webpack:** Module bundler for efficient asset management.
- **HTML:** For the skeleton and setting up the nav bar.
- **CSS:** Custom styles, including neomorphic design elements.
- **FontAwesome:** For icons used in the UI.
- **date-fns:** For date handling and formatting.
- **uuid:** To generate unique IDs for tasks and categories.

## Future Improvements

- **Sorting and Filtering:** Add UI features for sorting tasks by due date or priority and filtering tasks by priority or completion status. The functionality exists as I initially planned to add this, but was unable to due to time constraints.
- **Renaming Categories:** Allow users to rename categories. For now they can delete and create a new category. I do have the functionality available, but for the sake of time I didnt end up adding it to the UI.
- **Improved Validation:** Currently, I just restrict any fancy names or numbers inside category names, as it was the easiest to do. But I do think its better to allow users to write any name for their categories, so introducing some sanitization or encoding to allow for that would be awesome!
- **Drag and Drop:** Allow users to reorder tasks or move them between categories using drag-and-drop functionality. I have this somewhat implemented as the code in the backend exists for moving tasks around to different categories, I just dont have a drag and drop UI. Instead you can do so by editing the task and then changing the category there!
- **Search Functionality:** Enable searching for tasks by title or description. This would be super clutch as the todo list grows and maybe you want to refer back to an old todo item.
- **Pagination:** On that note, it would also be cool to add some sort of lazy loaded pagination, if I have a LOT of todos at one point.
- **Dedicated Database:** Lastly, and very importantly, the localStorage can be cleared easily and doesnt offer a robust way to persist the data. So adding a db would fix that.

---

As you see, there are so many features that can be added and I do hope to use this personally and update it as I find more bugs or things I need. But this project helped me learn a lot. And not only did I learn the technical implementation of a functional todo list app but also the learned how to apply key programming principles and modern web development practices. And it was really fun!
