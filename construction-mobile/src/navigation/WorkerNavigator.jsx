import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';

import { WorkerDashboardScreen } from '../screens/worker/WorkerDashboardScreen';
import { WorkerAttendanceScreen } from '../screens/worker/WorkerAttendanceScreen';
import { WorkerTasksScreen } from '../screens/worker/WorkerTasksScreen';
import { WorkerBuildingsScreen } from '../screens/worker/WorkerBuildingsScreen';
import { WorkerUploadProgressScreen } from '../screens/worker/WorkerUploadProgressScreen';
import { WorkerProfileScreen } from '../screens/worker/WorkerProfileScreen';
import { WorkerSettingsScreen } from '../screens/worker/WorkerSettingsScreen';

import {
  LayoutDashboard,
  CalendarCheck,
  ListTodo,
  Building2,
  User,
} from 'lucide-react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const WorkerTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.success,
        tabBarInactiveTintColor: colors.neutral400,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.neutral200,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="WorkerDashboardTab"
        component={WorkerDashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => <LayoutDashboard size={size - 2} color={color} />,
        }}
      />
      <Tab.Screen
        name="WorkerAttendanceTab"
        component={WorkerAttendanceScreen}
        options={{
          tabBarLabel: 'Attendance',
          tabBarIcon: ({ color, size }) => <CalendarCheck size={size - 2} color={color} />,
        }}
      />
      <Tab.Screen
        name="WorkerTasksTab"
        component={WorkerTasksScreen}
        options={{
          tabBarLabel: 'My Tasks',
          tabBarIcon: ({ color, size }) => <ListTodo size={size - 2} color={color} />,
        }}
      />
      <Tab.Screen
        name="WorkerBuildingsTab"
        component={WorkerBuildingsScreen}
        options={{
          tabBarLabel: 'Sites',
          tabBarIcon: ({ color, size }) => <Building2 size={size - 2} color={color} />,
        }}
      />
      <Tab.Screen
        name="WorkerProfileTab"
        component={WorkerProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size - 2} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export const WorkerNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WorkerTabs" component={WorkerTabs} />
      <Stack.Screen name="WorkerAttendance" component={WorkerAttendanceScreen} />
      <Stack.Screen name="WorkerTasks" component={WorkerTasksScreen} />
      <Stack.Screen name="WorkerBuildings" component={WorkerBuildingsScreen} />
      <Stack.Screen name="WorkerUploadProgress" component={WorkerUploadProgressScreen} />
      <Stack.Screen name="WorkerProfile" component={WorkerProfileScreen} />
      <Stack.Screen name="WorkerSettings" component={WorkerSettingsScreen} />
    </Stack.Navigator>
  );
};
