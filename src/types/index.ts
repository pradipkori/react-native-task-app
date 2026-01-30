export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  remarks?: string;
  lastUpdated: string;
}

export type RootStackParamList = {
  Login: undefined;
  TaskList: undefined;
  TaskDetail: { task: Task };
  AddTask: undefined;
};
