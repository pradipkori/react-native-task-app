import { create } from 'zustand';
import { Task, User } from '../types';
import { storage } from '../utils/storage';
import { mockApi } from '../api/mockApi';

interface AppState {
    user: User | null;
    token: string | null;
    tasks: Task[];
    isLoading: boolean;
    isSyncing: boolean;
    lastSynced: string | null;
    error: string | null;

    // Auth Actions
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;

    // Task Actions
    fetchTasks: () => Promise<void>;
    updateTask: (taskId: string, status: string, remarks?: string) => Promise<void>;
    addTask: (title: string, description: string) => Promise<void>;

    // Sync Actions
    syncOfflineUpdates: () => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
    user: null,
    token: null,
    tasks: [],
    isLoading: false,
    isSyncing: false,
    lastSynced: null,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const { token, user } = await mockApi.login(email, password);
            await storage.setToken(token);
            set({ token, user, isLoading: false });
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
        }
    },

    logout: async () => {
        await storage.removeToken();
        set({ user: null, token: null, tasks: [] });
    },

    checkAuth: async () => {
        const token = await storage.getToken();
        if (token) {
            // In a real app, we'd verify the token or fetch user info
            set({ token, user: { id: '1', name: 'Test User', email: 'test@example.com' } });
        }
    },

    fetchTasks: async () => {
        set({ isLoading: true, error: null });
        try {
            const tasks = await mockApi.fetchTasks();
            await storage.setTasks(tasks);
            set({ tasks, lastSynced: new Date().toISOString(), isLoading: false });
        } catch (err: any) {
            // If offline or error, load from cache
            const cachedTasks = await storage.getTasks();
            set({ tasks: cachedTasks, error: 'Loaded from cache', isLoading: false });
        }
    },

    updateTask: async (taskId, status, remarks) => {
        const { tasks } = get();
        // Optimistic update
        const updatedTasks = tasks.map(t =>
            t.id === taskId ? { ...t, status: status as any, remarks, lastUpdated: new Date().toISOString() } : t
        );
        set({ tasks: updatedTasks });

        try {
            await mockApi.updateTask(taskId, status, remarks);
            await storage.setTasks(updatedTasks);
        } catch (err) {
            // Save to offline queue if API fails
            await storage.addToOfflineQueue({ type: 'UPDATE_TASK', taskId, status, remarks });
            await storage.setTasks(updatedTasks);
            set({ error: 'Update saved offline. Will sync later.' });
        }
    },

    addTask: async (title, description) => {
        set({ isLoading: true, error: null });
        try {
            const newTask = await mockApi.addTask(title, description);
            const { tasks } = get();
            const updatedTasks = [newTask, ...tasks];
            await storage.setTasks(updatedTasks);
            set({ tasks: updatedTasks, isLoading: false });
        } catch (err: any) {
            // Offline task creation
            const newTask: Task = {
                id: `local-${Date.now()}`,
                title,
                description,
                status: 'Pending',
                lastUpdated: new Date().toISOString(),
            };
            const { tasks } = get();
            const updatedTasks = [newTask, ...tasks];
            await storage.addToOfflineQueue({ type: 'ADD_TASK', title, description, localId: newTask.id });
            await storage.setTasks(updatedTasks);
            set({ tasks: updatedTasks, isLoading: false, error: 'Task added offline. Will sync later.' });
        }
    },

    syncOfflineUpdates: async () => {
        const queue = await storage.getOfflineQueue();
        if (queue.length === 0) return;

        set({ isSyncing: true });
        try {
            for (const item of queue) {
                if (item.type === 'ADD_TASK') {
                    await mockApi.addTask(item.title, item.description);
                } else {
                    await mockApi.updateTask(item.taskId, item.status, item.remarks);
                }
            }
            await storage.clearOfflineQueue();
            set({ isSyncing: false, error: 'Synced successfully!' });
            // Refresh tasks after sync
            await get().fetchTasks();
        } catch (err) {
            set({ isSyncing: false, error: 'Sync failed. Will retry later.' });
        }
    }
}));
