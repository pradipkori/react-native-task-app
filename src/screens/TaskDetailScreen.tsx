import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useStore } from '../store/useStore';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { Check, Clock, AlertCircle } from 'lucide-react-native';

type TaskDetailRouteProp = RouteProp<RootStackParamList, 'TaskDetail'>;

const TaskDetailScreen = () => {
    const route = useRoute<TaskDetailRouteProp>();
    const navigation = useNavigation();
    const { task } = route.params;
    const { updateTask, error } = useStore();

    const [status, setStatus] = useState(task.status);
    const [remarks, setRemarks] = useState(task.remarks || '');

    const handleUpdate = async () => {
        await updateTask(task.id, status, remarks);
        Alert.alert('Success', 'Task updated locally. It will sync automatically when online.', [
            { text: 'OK', onPress: () => navigation.goBack() }
        ]);
    };

    const statusOptions: Array<'Pending' | 'In Progress' | 'Completed'> = ['Pending', 'In Progress', 'Completed'];

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.label}>Title</Text>
                <Text style={styles.title}>{task.title}</Text>

                <Text style={styles.label}>Description</Text>
                <Text style={styles.description}>{task.description}</Text>

                <Text style={styles.label}>Status</Text>
                <View style={styles.statusContainer}>
                    {statusOptions.map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={[
                                styles.statusOption,
                                status === option && styles.statusOptionSelected,
                                status === option && option === 'Completed' && styles.statusCompleted,
                                status === option && option === 'In Progress' && styles.statusInProgress,
                            ]}
                            onPress={() => setStatus(option)}
                        >
                            <Text style={[styles.statusText, status === option && styles.statusTextSelected]}>
                                {option}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.label}>Remarks</Text>
                <TextInput
                    style={styles.remarksInput}
                    multiline
                    numberOfLines={4}
                    placeholder="Add comments here..."
                    value={remarks}
                    onChangeText={setRemarks}
                />

                <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>

                <Text style={styles.lastUpdated}>
                    Last updated: {new Date(task.lastUpdated).toLocaleString()}
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    content: {
        padding: 20,
        paddingTop: 40,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#8E8E93',
        textTransform: 'uppercase',
        marginBottom: 8,
        marginTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1C1C1E',
    },
    description: {
        fontSize: 16,
        color: '#3A3A3C',
        lineHeight: 22,
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    statusOption: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#C7C7CC',
        alignItems: 'center',
        marginHorizontal: 4,
        backgroundColor: '#fff',
    },
    statusOptionSelected: {
        borderColor: 'transparent',
    },
    statusCompleted: {
        backgroundColor: '#34C759',
    },
    statusInProgress: {
        backgroundColor: '#007AFF',
    },
    statusText: {
        fontSize: 14,
        color: '#1C1C1E',
        fontWeight: '500',
    },
    statusTextSelected: {
        color: '#fff',
    },
    remarksInput: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        height: 120,
        fontSize: 16,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: '#E5E5EA',
    },
    saveButton: {
        backgroundColor: '#007AFF',
        height: 55,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    lastUpdated: {
        textAlign: 'center',
        marginTop: 20,
        color: '#8E8E93',
        fontSize: 12,
    }
});

export default TaskDetailScreen;
