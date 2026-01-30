import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useStore } from './src/store/useStore';
import LoginScreen from './src/screens/LoginScreen';
import TaskListScreen from './src/screens/TaskListScreen';
import TaskDetailScreen from './src/screens/TaskDetailScreen';
import AddTaskScreen from './src/screens/AddTaskScreen';
import NetInfo from '@react-native-community/netinfo';
import { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const { token, checkAuth, syncOfflineUpdates } = useStore();

  useEffect(() => {
    checkAuth();

    // Listen for network changes to auto-sync
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected && state.isInternetReachable) {
        syncOfflineUpdates();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator>
        {!token ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="TaskList"
              component={TaskListScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TaskDetail"
              component={TaskDetailScreen}
              options={{
                title: 'Task Details',
                headerBackTitle: 'Back',
              }}
            />
            <Stack.Screen
              name="AddTask"
              component={AddTaskScreen}
              options={{
                title: 'New Task',
                headerBackTitle: 'Cancel',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
