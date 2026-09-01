import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';

import { ContractorDashboardScreen } from '../screens/contractor/ContractorDashboardScreen';
import { ContractorProjectsScreen } from '../screens/contractor/ContractorProjectsScreen';
import { ContractorAttendanceScreen } from '../screens/contractor/ContractorAttendanceScreen';
import { ContractorMaterialsScreen } from '../screens/contractor/ContractorMaterialsScreen';
import { ContractorExpensesScreen } from '../screens/contractor/ContractorExpensesScreen';
import { ContractorProgressScreen } from '../screens/contractor/ContractorProgressScreen';
import { ContractorOpportunitiesScreen } from '../screens/contractor/ContractorOpportunitiesScreen';
import { ContractorReportsScreen } from '../screens/contractor/ContractorReportsScreen';
import { ContractorSettingsScreen } from '../screens/contractor/ContractorSettingsScreen';

import {
  LayoutDashboard,
  Briefcase,
  CalendarCheck,
  Package,
  Receipt,
  Settings,
} from 'lucide-react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ContractorTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.gold600,
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
        name="DashboardTab"
        component={ContractorDashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => <LayoutDashboard size={size - 2} color={color} />,
        }}
      />
      <Tab.Screen
        name="ProjectsTab"
        component={ContractorProjectsScreen}
        options={{
          tabBarLabel: 'Projects',
          tabBarIcon: ({ color, size }) => <Briefcase size={size - 2} color={color} />,
        }}
      />
      <Tab.Screen
        name="AttendanceTab"
        component={ContractorAttendanceScreen}
        options={{
          tabBarLabel: 'Muster',
          tabBarIcon: ({ color, size }) => <CalendarCheck size={size - 2} color={color} />,
        }}
      />
      <Tab.Screen
        name="MaterialsTab"
        component={ContractorMaterialsScreen}
        options={{
          tabBarLabel: 'Materials',
          tabBarIcon: ({ color, size }) => <Package size={size - 2} color={color} />,
        }}
      />
      <Tab.Screen
        name="ExpensesTab"
        component={ContractorExpensesScreen}
        options={{
          tabBarLabel: 'Expenses',
          tabBarIcon: ({ color, size }) => <Receipt size={size - 2} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export const ContractorNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ContractorTabs" component={ContractorTabs} />
      <Stack.Screen name="ContractorProjects" component={ContractorProjectsScreen} />
      <Stack.Screen name="ContractorAttendance" component={ContractorAttendanceScreen} />
      <Stack.Screen name="ContractorMaterials" component={ContractorMaterialsScreen} />
      <Stack.Screen name="ContractorExpenses" component={ContractorExpensesScreen} />
      <Stack.Screen name="ContractorProgress" component={ContractorProgressScreen} />
      <Stack.Screen name="ContractorOpportunities" component={ContractorOpportunitiesScreen} />
      <Stack.Screen name="ContractorReports" component={ContractorReportsScreen} />
      <Stack.Screen name="ContractorSettings" component={ContractorSettingsScreen} />
    </Stack.Navigator>
  );
};
