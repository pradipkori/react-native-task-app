# Task Management App (React Native)

A robust task management mobile application built with React Native and Expo, featuring offline support and JWT-based authentication simulation.

## Features

- **Authentication**: JWT-based login simulation with persistent sessions.
- **Task List**: View tasks with status badges and details.
- **Task Details**: Detailed view with capability to update status and remarks.
- **Offline Support**: 
  - Tasks are cached locally using `AsyncStorage`.
  - Offline updates are queued and automatically synced when the network is restored or via manual refresh.
- **Sync Visuals**: Displays "Last Synced" time and manual refresh indicators.
- **Modern UI**: Clean, responsive interface using Lucide icons.

## Tech Stack

- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **State Management**: Zustand
- **Navigation**: React Navigation (Stack)
- **Storage**: @react-native-async-storage/async-storage
- **Icons**: Lucide React Native

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run the App**:
   ```bash
   npx expo start
   ```
   Follow the CLI instructions to open the app in Expo Go (Android/iOS) or a simulator.

3. **Login Credentials**:
   - **Email**: `test@example.com`
   - **Password**: `password`

## Project Structure & App Flow

### Folder Structure
- `src/api`: Mock backend services for Auth and Tasks.
- `src/screens`: UI components for Login, Task List, Task Detail, and Add Task.
- `src/store`: Global state management using Zustand (handles both data and offline logic).
- `src/utils`: Helper for persistent storage (AsyncStorage).
- `src/types`: TypeScript interfaces for the entire project.

### App Flow
1. **Initial Load**: App checks `AsyncStorage` for a stored JWT token.
2. **Authentication**: If no token, user is directed to the **Login Screen**.
3. **Task List**: Authenticated users see their tasks. This screen displays "Last Synced" time and a Floating Action Button (FAB) for adding tasks.
4. **Task Details**: Clicking a task opens the detail view where status and remarks can be modified.
5. **Adding Tasks**: Users can create new tasks via the FAB. These are optimistically added to the list.
6. **Automatic Sync**: Whenever the app detects the device is back online (using NetInfo), it automatically pushes queued offline changes.

## Offline Logic Implementation

1. **Caching**: When tasks are fetched from the API, they are immediately stored in `AsyncStorage`. If the fetch fails (due to no internet), the app falls back to this local cache.
2. **Optimistic Updates**: When a user updates a task, the UI is updated immediately.
3. **Queueing**: If the update API call fails, the update object (taskId, status, remarks) is added to an "Offline Queue" in `AsyncStorage`.
4. **Synchronization**: Every time the Task List is refreshed or the app attempts a "Sync", it iterates through the offline queue, pushes updates to the mock API, and clears the queue upon success.
