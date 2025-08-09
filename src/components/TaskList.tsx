import React from 'react';
import { Task } from '../types/Task';
import { Terminal as TerminalIcon } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleTask, onDeleteTask }) => {
  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const TaskItem: React.FC<{ task: Task; index: number }> = ({ task, index }) => (
    <div className="group hover:bg-gray-800 transition-colors duration-200 p-2 rounded">
      <div className="flex items-start gap-3">
        <span className="text-yellow-400 font-mono text-sm">{index + 1}.</span>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`font-mono text-sm ${
              task.completed ? 'text-green-600' : 'text-green-400'
            }`}>
              [{task.completed ? '✓' : '○'}]
            </span>
            <span className={`font-mono text-sm ${
              task.completed 
                ? 'text-green-600 line-through opacity-75' 
                : 'text-green-400'
            }`}>
              {task.text}
            </span>
          </div>
          <div className="mt-1 text-xs text-green-600 font-mono">
            Created: {formatDate(task.createdAt)}
          </div>
        </div>
        
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
          <button
            onClick={() => onToggleTask(task.id)}
            className="text-yellow-400 hover:text-yellow-300 font-mono text-xs px-2 py-1 border border-yellow-400 hover:border-yellow-300 rounded transition-colors duration-200"
          >
            {task.completed ? 'UNDO' : 'DONE'}
          </button>
          <button
            onClick={() => onDeleteTask(task.id)}
            className="text-red-400 hover:text-red-300 font-mono text-xs px-2 py-1 border border-red-400 hover:border-red-300 rounded transition-colors duration-200"
          >
            DEL
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-black text-green-400 font-mono flex flex-col border-l border-green-500">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 p-4 border-b border-green-500 text-green-300">
        <TerminalIcon size={20} />
        <span className="text-sm">Task List - Status Monitor</span>
      </div>

      {/* Status Bar */}
      <div className="p-4 border-b border-green-500 bg-gray-900">
        <div className="text-xs space-y-1">
          <div className="text-yellow-400">SYSTEM STATUS:</div>
          <div className="text-green-400">
            TOTAL: {tasks.length} | PENDING: {pendingTasks.length} | COMPLETED: {completedTasks.length}
          </div>
        </div>
      </div>

      {/* Task Display */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-900">
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-green-600 font-mono text-sm space-y-2">
              <div>NO TASKS FOUND</div>
              <div className="text-xs">Use terminal to add tasks</div>
              <div className="text-xs text-green-700">$ add &lt;task description&gt;</div>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {/* Header */}
            <div className="text-yellow-400 font-mono text-xs mb-4 border-b border-green-700 pb-2">
              ID  STATUS  DESCRIPTION
            </div>

            {/* Pending Tasks */}
            {pendingTasks.length > 0 && (
              <div className="mb-6">
                <div className="text-blue-400 font-mono text-xs mb-2">
                  &gt; PENDING TASKS ({pendingTasks.length})
                </div>
                <div className="space-y-1 ml-2">
                  {pendingTasks.map((task, index) => (
                    <TaskItem 
                      key={task.id} 
                      task={task} 
                      index={tasks.findIndex(t => t.id === task.id)} 
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div>
                <div className="text-green-600 font-mono text-xs mb-2">
                  &gt; COMPLETED TASKS ({completedTasks.length})
                </div>
                <div className="space-y-1 ml-2">
                  {completedTasks.map((task, index) => (
                    <TaskItem 
                      key={task.id} 
                      task={task} 
                      index={tasks.findIndex(t => t.id === task.id)} 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Command Help */}
      <div className="p-4 border-t border-green-500 bg-black">
        <div className="text-xs text-green-600 space-y-1">
          <div>QUICK ACTIONS:</div>
          <div>• Hover over tasks to see controls</div>
          <div>• Use terminal for full command set</div>
        </div>
      </div>
    </div>
  );
};

export default TaskList;