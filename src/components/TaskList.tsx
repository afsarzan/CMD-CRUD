import React from 'react';
import { Task } from '../types/Task';
import { CheckCircle, Circle, Trash2, Calendar } from 'lucide-react';

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
    <div className={`group p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
      task.completed 
        ? 'bg-green-50 border-green-200 hover:bg-green-100' 
        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
    }`}>
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggleTask(task.id)}
          className={`mt-0.5 transition-colors duration-200 ${
            task.completed ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          {task.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
        </button>
        
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium transition-all duration-200 ${
            task.completed 
              ? 'text-green-800 line-through opacity-75' 
              : 'text-gray-900'
          }`}>
            <span className="text-xs text-gray-500 mr-2">#{index + 1}</span>
            {task.text}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Calendar size={12} className="text-gray-400" />
            <span className="text-xs text-gray-500">{formatDate(task.createdAt)}</span>
          </div>
        </div>
        
        <button
          onClick={() => onDeleteTask(task.id)}
          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all duration-200 p-1 rounded hover:bg-red-50"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-white border-l border-gray-300 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Task List</h2>
        <p className="text-sm text-gray-600">
          {tasks.length} total • {pendingTasks.length} pending • {completedTasks.length} completed
        </p>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-4">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <Circle size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">No tasks yet</p>
            <p className="text-gray-400 text-xs mt-1">Use the terminal to add your first task</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Pending Tasks */}
            {pendingTasks.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Circle size={16} className="text-blue-500" />
                  Pending ({pendingTasks.length})
                </h3>
                <div className="space-y-2">
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
              <div className={pendingTasks.length > 0 ? 'mt-6' : ''}>
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  Completed ({completedTasks.length})
                </h3>
                <div className="space-y-2">
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
    </div>
  );
};

export default TaskList;