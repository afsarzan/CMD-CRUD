import { Task } from '../types/Task';

const TASKS_KEY = 'cmd-tasks';

export const loadTasks = (): Task[] => {
  try {
    const stored = localStorage.getItem(TASKS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
};

export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};

export const addTask = (text: string): Task => {
  const tasks = loadTasks();
  const newTask: Task = {
    id: Date.now().toString(),
    text,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
};

export const toggleTask = (id: string): Task | null => {
  const tasks = loadTasks();
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) return null;
  
  tasks[taskIndex].completed = !tasks[taskIndex].completed;
  saveTasks(tasks);
  return tasks[taskIndex];
};

export const deleteTask = (id: string): boolean => {
  const tasks = loadTasks();
  const filteredTasks = tasks.filter(task => task.id !== id);
  
  if (filteredTasks.length === tasks.length) return false;
  
  saveTasks(filteredTasks);
  return true;
};

export const clearAllTasks = (): void => {
  saveTasks([]);
};