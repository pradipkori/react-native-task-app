import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useStore } from '../store/useStore';
import { LogIn } from 'lucide-react-native';

const LoginScreen = () => {
    const [email, setEmail] = useState('test@example.com');
    const [password, setPassword] = useState('password');
    const { login, isLoading, error } = useStore();

    const handleLogin = () => {
        login(email, password);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <LogIn size={48} color="#007AFF" />
                <Text style={styles.title}>Task Manager</Text>
                <Text style={styles.subtitle}>Log in to manage your tasks</Text>
            </View>

            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                {error && <Text style={styles.errorText}>{error}</Text>}

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Log In</Text>
                    )}
                </TouchableOpacity>
            </View>

            <Text style={styles.footerNote}>Use test@example.com / password</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1C1C1E',
        marginTop: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#8E8E93',
        marginTop: 5,
    },
    form: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#E5E5EA',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007AFF',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    errorText: {
        color: '#FF3B30',
        marginBottom: 10,
        textAlign: 'center',
    },
    footerNote: {
        textAlign: 'center',
        marginTop: 20,
        color: '#8E8E93',
    }
});

export default LoginScreen;
