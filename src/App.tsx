import React, { useState, useEffect } from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import Terminal from './components/Terminal';
import TaskList from './components/TaskList';
import { loadTasks, toggleTask, deleteTask } from './utils/localStorage';
import { Task } from './types/Task';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

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
    <div className="h-screen">
      <PanelGroup direction="horizontal">
        {/* Left Panel - Terminal */}
        <Panel defaultSize={60} minSize={30}>
          <div 
            className="h-full"
            onClick={() => {
              // Keep terminal focused
              const input = document.querySelector('input[placeholder="Enter command (type \'help\' for commands)"]');
              if (input) input.focus();
            }}
          >
            <Terminal 
              onTasksChange={handleTasksChange}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>
        </Panel>
        
        {/* Resize Handle */}
        <PanelResizeHandle className="w-2 bg-green-500 hover:bg-green-400 transition-colors duration-200 cursor-col-resize" />
        
        {/* Right Panel - Task List */}
        <Panel defaultSize={40} minSize={25}>
          <TaskList 
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </Panel>
      </PanelGroup>
    </div>
  );
}

export default App;