import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useStore } from '../store/useStore';
import { useNavigation } from '@react-navigation/native';
import { Plus } from 'lucide-react-native';

const AddTaskScreen = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const { addTask, isLoading, error } = useStore();
    const navigation = useNavigation();

    const handleSave = async () => {
        if (!title.trim() || !description.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        await addTask(title, description);

        if (!error || error.includes('offline')) {
            navigation.goBack();
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.header}>New Task</Text>

                <Text style={styles.label}>Title</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., Review PRs"
                    value={title}
                    onChangeText={setTitle}
                />

                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={styles.remarksInput}
                    multiline
                    numberOfLines={4}
                    placeholder="What needs to be done?"
                    value={description}
                    onChangeText={setDescription}
                />

                {error && <Text style={styles.errorText}>{error}</Text>}

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Plus size={20} color="#fff" />
                            <Text style={styles.saveButtonText}>Create Task</Text>
                        </>
                    )}
                </TouchableOpacity>
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
    header: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1C1C1E',
        marginBottom: 20,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#8E8E93',
        textTransform: 'uppercase',
        marginBottom: 8,
        marginTop: 20,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#E5E5EA',
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
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 8,
    },
    errorText: {
        color: '#FF3B30',
        marginTop: 10,
        textAlign: 'center',
    }
});

export default AddTaskScreen;
