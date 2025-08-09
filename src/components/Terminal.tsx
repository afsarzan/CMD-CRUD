import React, { useState, useEffect, useRef } from 'react';
import { TerminalOutput, Task } from '../types/Task';
import { loadTasks, addTask, toggleTask, deleteTask, clearAllTasks } from '../utils/localStorage';
import { Terminal as TerminalIcon } from 'lucide-react';

const Terminal: React.FC = () => {
  const [output, setOutput] = useState<TerminalOutput[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Welcome message
    addOutput('system', 'Daily Task Manager v1.0');
    addOutput('system', 'Type "help" for available commands');
    addOutput('system', '');
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  useEffect(() => {
    // Focus input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const addOutput = (type: 'command' | 'output' | 'error' | 'system', content: string) => {
    const newOutput: TerminalOutput = {
      id: Date.now().toString() + Math.random(),
      type: type === 'system' ? 'output' : type,
      content,
      timestamp: new Date().toISOString(),
    };
    setOutput(prev => [...prev, newOutput]);
  };

  const formatTask = (task: Task, index: number): string => {
    const status = task.completed ? '✓' : '○';
    const date = new Date(task.createdAt).toLocaleDateString();
    return `${index + 1}. [${status}] ${task.text} (${date})`;
  };

  const executeCommand = (command: string) => {
    const trimmedCommand = command.trim();
    if (!trimmedCommand) return;

    // Add command to history
    setCommandHistory(prev => [...prev, trimmedCommand]);
    setHistoryIndex(-1);
    
    // Display the command
    addOutput('command', `$ ${trimmedCommand}`);

    const [cmd, ...args] = trimmedCommand.toLowerCase().split(' ');
    const argString = args.join(' ').trim();

    switch (cmd) {
      case 'help':
        addOutput('output', 'Available commands:');
        addOutput('output', '  add <task>     - Add a new task');
        addOutput('output', '  list           - Show all tasks');
        addOutput('output', '  done <id>      - Mark task as completed');
        addOutput('output', '  undone <id>    - Mark task as incomplete');
        addOutput('output', '  delete <id>    - Delete a task');
        addOutput('output', '  clear          - Clear the terminal');
        addOutput('output', '  reset          - Delete all tasks');
        addOutput('output', '  help           - Show this help');
        break;

      case 'add':
        if (!argString) {
          addOutput('error', 'Usage: add <task description>');
        } else {
          const task = addTask(argString);
          addOutput('output', `Task added: ${task.text}`);
        }
        break;

      case 'list':
        const tasks = loadTasks();
        if (tasks.length === 0) {
          addOutput('output', 'No tasks found. Use "add <task>" to create one.');
        } else {
          addOutput('output', `Found ${tasks.length} task(s):`);
          tasks.forEach((task, index) => {
            addOutput('output', formatTask(task, index));
          });
        }
        break;

      case 'done':
        if (!argString) {
          addOutput('error', 'Usage: done <task_id>');
        } else {
          const tasks = loadTasks();
          const taskIndex = parseInt(argString) - 1;
          if (isNaN(taskIndex) || taskIndex < 0 || taskIndex >= tasks.length) {
            addOutput('error', 'Invalid task ID. Use "list" to see task IDs.');
          } else {
            const task = toggleTask(tasks[taskIndex].id);
            if (task && task.completed) {
              addOutput('output', `Task marked as completed: ${task.text}`);
            } else {
              addOutput('error', 'Failed to mark task as completed.');
            }
          }
        }
        break;

      case 'undone':
        if (!argString) {
          addOutput('error', 'Usage: undone <task_id>');
        } else {
          const tasks = loadTasks();
          const taskIndex = parseInt(argString) - 1;
          if (isNaN(taskIndex) || taskIndex < 0 || taskIndex >= tasks.length) {
            addOutput('error', 'Invalid task ID. Use "list" to see task IDs.');
          } else {
            const task = tasks[taskIndex];
            if (task.completed) {
              toggleTask(task.id);
              addOutput('output', `Task marked as incomplete: ${task.text}`);
            } else {
              addOutput('output', `Task is already incomplete: ${task.text}`);
            }
          }
        }
        break;

      case 'delete':
        if (!argString) {
          addOutput('error', 'Usage: delete <task_id>');
        } else {
          const tasks = loadTasks();
          const taskIndex = parseInt(argString) - 1;
          if (isNaN(taskIndex) || taskIndex < 0 || taskIndex >= tasks.length) {
            addOutput('error', 'Invalid task ID. Use "list" to see task IDs.');
          } else {
            const taskToDelete = tasks[taskIndex];
            const success = deleteTask(taskToDelete.id);
            if (success) {
              addOutput('output', `Task deleted: ${taskToDelete.text}`);
            } else {
              addOutput('error', 'Failed to delete task.');
            }
          }
        }
        break;

      case 'clear':
        setOutput([]);
        break;

      case 'reset':
        clearAllTasks();
        addOutput('output', 'All tasks have been deleted.');
        break;

      default:
        addOutput('error', `Unknown command: ${cmd}. Type "help" for available commands.`);
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim()) {
      executeCommand(currentInput);
      setCurrentInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentInput('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-4">
      <div className="max-w-4xl mx-auto">
        {/* Terminal Header */}
        <div className="flex items-center gap-2 mb-4 text-green-300">
          <TerminalIcon size={20} />
          <span className="text-sm">Daily Task Manager - Terminal Interface</span>
        </div>

        {/* Terminal Output */}
        <div 
          ref={outputRef}
          className="bg-gray-900 border border-green-500 rounded-lg p-4 h-96 overflow-y-auto mb-4 shadow-lg"
        >
          {output.map((item) => (
            <div 
              key={item.id} 
              className={`mb-1 ${
                item.type === 'command' ? 'text-yellow-400' : 
                item.type === 'error' ? 'text-red-400' : 'text-green-400'
              }`}
            >
              {item.content}
            </div>
          ))}
        </div>

        {/* Command Input */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span className="text-yellow-400">$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-green-400 font-mono"
            placeholder="Enter command (type 'help' for commands)"
            autoComplete="off"
          />
        </form>

        {/* Help Text */}
        <div className="mt-4 text-xs text-green-600">
          <p>• Use ↑/↓ arrow keys to navigate command history</p>
          <p>• Click anywhere to focus the terminal</p>
          <p>• All tasks are saved locally in your browser</p>
        </div>
      </div>
    </div>
  );
};

export default Terminal;