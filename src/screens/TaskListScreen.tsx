import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useStore } from '../store/useStore';
import { Task } from '../types';
import { CheckCircle2, Circle, Clock, LogOut, RefreshCw, Plus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

const TaskListScreen = () => {
    const { tasks, isLoading, isSyncing, lastSynced, fetchTasks, syncOfflineUpdates, logout } = useStore();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleRefresh = async () => {
        await syncOfflineUpdates();
        await fetchTasks();
    };

    const renderTaskItem = ({ item }: { item: Task }) => {
        const StatusIcon = item.status === 'Completed' ? CheckCircle2 : item.status === 'In Progress' ? Clock : Circle;
        const iconColor = item.status === 'Completed' ? '#34C759' : item.status === 'In Progress' ? '#007AFF' : '#8E8E93';

        return (
            <TouchableOpacity
                style={styles.taskCard}
                onPress={() => navigation.navigate('TaskDetail', { task: item })}
            >
                <StatusIcon size={24} color={iconColor} />
                <View style={styles.taskInfo}>
                    <Text style={styles.taskTitle}>{item.title}</Text>
                    <Text style={styles.taskStatus}>{item.status}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>My Tasks</Text>
                    {lastSynced && (
                        <Text style={styles.syncText}>
                            Last synced: {new Date(lastSynced).toLocaleTimeString()}
                        </Text>
                    )}
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity onPress={handleRefresh} style={styles.iconButton} disabled={isSyncing}>
                        {isSyncing ? <ActivityIndicator size="small" /> : <RefreshCw size={24} color="#007AFF" />}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={logout} style={styles.iconButton}>
                        <LogOut size={24} color="#FF3B30" />
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={tasks}
                renderItem={renderTaskItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
                }
                ListEmptyComponent={
                    !isLoading ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No tasks found.</Text>
                        </View>
                    ) : null
                }
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddTask')}
            >
                <Plus size={30} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1C1C1E',
    },
    syncText: {
        fontSize: 12,
        color: '#8E8E93',
        marginTop: 2,
    },
    headerActions: {
        flexDirection: 'row',
    },
    iconButton: {
        marginLeft: 15,
        padding: 5,
    },
    listContent: {
        padding: 15,
        paddingBottom: 100,
    },
    taskCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    taskInfo: {
        flex: 1,
        marginLeft: 15,
    },
    taskTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#1C1C1E',
    },
    taskStatus: {
        fontSize: 14,
        color: '#8E8E93',
        marginTop: 2,
    },
    chevron: {
        fontSize: 24,
        color: '#C7C7CC',
    },
    emptyState: {
        marginTop: 100,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#8E8E93',
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        backgroundColor: '#007AFF',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    }
});

export default TaskListScreen;
