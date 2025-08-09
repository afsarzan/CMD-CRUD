export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface TerminalOutput {
  id: string;
  type: 'command' | 'output' | 'error';
  content: string;
  timestamp: string;
}