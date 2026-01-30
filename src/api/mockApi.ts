import { Task, User } from '../types';

const MOCK_TASKS: Task[] = [
    {
        id: '1',
        title: 'Design Task List UI',
        description: 'Create a clean and responsive task list screen with status icons.',
        status: 'In Progress',
        remarks: 'Working on status badges.',
        lastUpdated: new Date().toISOString(),
    },
    {
        id: '2',
        title: 'Implement Offline Sync',
        description: 'Sync logic should handle internet restoration and manual refresh.',
        status: 'Pending',
        lastUpdated: new Date().toISOString(),
    },
    {
        id: '3',
        title: 'Setup Navigation',
        description: 'Implement Stack navigation with Login and Task screens.',
        status: 'Completed',
        lastUpdated: new Date(Date.now() - 86400000).toISOString(),
    }
];

export const mockApi = {
    async login(email: string, password: string): Promise<{ token: string, user: User }> {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
        if (email === 'test@example.com' && password === 'password') {
            return {
                token: 'mock-jwt-token-123',
                user: { id: '1', name: 'Test User', email }
            };
        }
        throw new Error('Invalid credentials');
    },

    async fetchTasks(): Promise<Task[]> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return [...MOCK_TASKS];
    },

    async updateTask(taskId: string, status: string, remarks?: string): Promise<Task> {
        await new Promise(resolve => setTimeout(resolve, 800));
        const task = MOCK_TASKS.find(t => t.id === taskId);
        if (!task) throw new Error('Task not found');

        const updatedTask = {
            ...task,
            status: status as any,
            remarks,
            lastUpdated: new Date().toISOString()
        };

        // In a real app, we'd update the DB. Here we just return it.
        return updatedTask;
    },

    async addTask(title: string, description: string): Promise<Task> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const newTask: Task = {
            id: Math.random().toString(36).substr(2, 9),
            title,
            description,
            status: 'Pending',
            lastUpdated: new Date().toISOString(),
        };
        MOCK_TASKS.unshift(newTask); // Add to the beginning
        return newTask;
    }
};
