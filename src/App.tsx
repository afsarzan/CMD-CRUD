import React, { useState, useEffect } from 'react';
import Terminal from './components/Terminal';
import TaskList from './components/TaskList';
import { loadTasks, toggleTask, deleteTask } from './utils/localStorage';
import { Task } from './types/Task';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    setTasks(loadTasks());
  }, [refreshTrigger]);

  const handleTasksChange = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleToggleTask = (id: string) => {
    toggleTask(id);
    handleTasksChange();
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    handleTasksChange();
  };

  return (
    <div className="h-screen flex">
      {/* Left Panel - Terminal */}
      <div 
        className="flex-1 min-w-0"
        onClick={() => {
          // Keep terminal focused
          const input = document.querySelector('input');
          if (input) input.focus();
        }}
      >
        <Terminal onTasksChange={handleTasksChange} />
      </div>
      
      {/* Right Panel - Task List */}
      <div className="w-96 min-w-0">
        <TaskList 
          tasks={tasks}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
        />
      </div>
    </div>
  );
}

export default App;