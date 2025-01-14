import './styles.css';
import TabManager from './modules/TabManager.js';
import TaskManager from './modules/TaskManager.js';
import './modules/CategoryUIManager.js';

TaskManager.checkOverdueTodos();

// Initialize TabManager for managing tab switching
const tabManager = new TabManager('.content-view');

// Collapse/Expand Navigation Logic
const collapseBtn = document.querySelector('.collapse-btn');
const nav = document.querySelector('.nav');
const caretIcon = collapseBtn.querySelector('.fa-caret-up');

collapseBtn.addEventListener('click', () => {
  nav.classList.toggle('collapsed');
  if (nav.classList.contains('collapsed')) {
    caretIcon.classList.remove('fa-rotate-270');
    caretIcon.classList.add('fa-rotate-90');
  } else {
    caretIcon.classList.remove('fa-rotate-90');
    caretIcon.classList.add('fa-rotate-270');
  }
});
