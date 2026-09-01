import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';

import { HomeownerDashboardScreen } from '../screens/homeowner/HomeownerDashboardScreen';
import { HomeownerBuildingsScreen } from '../screens/homeowner/HomeownerBuildingsScreen';
import { HomeownerVerifiedContractorsScreen } from '../screens/homeowner/HomeownerVerifiedContractorsScreen';
import { HomeownerExpensesScreen } from '../screens/homeowner/HomeownerExpensesScreen';
import { HomeownerDocumentsScreen } from '../screens/homeowner/HomeownerDocumentsScreen';
import { HomeownerSettingsScreen } from '../screens/homeowner/HomeownerSettingsScreen';

import {
  LayoutDashboard,
  Building2,
  ShieldCheck,
  Receipt,
  Settings,
} from 'lucide-react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeownerTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
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
        name="HomeownerDashboardTab"
        component={HomeownerDashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => <LayoutDashboard size={size - 2} color={color} />,
        }}
      />
      <Tab.Screen
        name="HomeownerBuildingsTab"
        component={HomeownerBuildingsScreen}
        options={{
          tabBarLabel: 'Buildings',
          tabBarIcon: ({ color, size }) => <Building2 size={size - 2} color={color} />,
        }}
      />
      <Tab.Screen
        name="HomeownerContractorsTab"
        component={HomeownerVerifiedContractorsScreen}
        options={{
          tabBarLabel: 'Contractors',
          tabBarIcon: ({ color, size }) => <ShieldCheck size={size - 2} color={color} />,
        }}
      />
      <Tab.Screen
        name="HomeownerExpensesTab"
        component={HomeownerExpensesScreen}
        options={{
          tabBarLabel: 'Financials',
          tabBarIcon: ({ color, size }) => <Receipt size={size - 2} color={color} />,
        }}
      />
      <Tab.Screen
        name="HomeownerSettingsTab"
        component={HomeownerSettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size - 2} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export const HomeownerNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeownerTabs" component={HomeownerTabs} />
      <Stack.Screen name="HomeownerBuildings" component={HomeownerBuildingsScreen} />
      <Stack.Screen name="HomeownerVerifiedContractors" component={HomeownerVerifiedContractorsScreen} />
      <Stack.Screen name="HomeownerExpenses" component={HomeownerExpensesScreen} />
      <Stack.Screen name="HomeownerDocuments" component={HomeownerDocumentsScreen} />
      <Stack.Screen name="HomeownerSettings" component={HomeownerSettingsScreen} />
    </Stack.Navigator>
  );
};
