import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@auth_token';
const TASKS_KEY = '@cached_tasks';
const OFFLINE_QUEUE_KEY = '@offline_queue';

export const storage = {
    async setToken(token: string) {
        await AsyncStorage.setItem(TOKEN_KEY, token);
    },
    async getToken() {
        return await AsyncStorage.getItem(TOKEN_KEY);
    },
    async removeToken() {
        await AsyncStorage.removeItem(TOKEN_KEY);
    },
    async setTasks(tasks: any[]) {
        await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    },
    async getTasks() {
        const tasks = await AsyncStorage.getItem(TASKS_KEY);
        return tasks ? JSON.parse(tasks) : [];
    },
    async getOfflineQueue() {
        const queue = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
        return queue ? JSON.parse(queue) : [];
    },
    async addToOfflineQueue(update: any) {
        const queue = await this.getOfflineQueue();
        queue.push(update);
        await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
    },
    async clearOfflineQueue() {
        await AsyncStorage.removeItem(OFFLINE_QUEUE_KEY);
    }
};
