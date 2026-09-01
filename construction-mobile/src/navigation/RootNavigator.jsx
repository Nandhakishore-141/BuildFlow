import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { LoadingScreen } from '../components/common/LoadingScreen';

import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';

import { ContractorNavigator } from './ContractorNavigator';
import { WorkerNavigator } from './WorkerNavigator';
import { HomeownerNavigator } from './HomeownerNavigator';
import { AdminNavigator } from './AdminNavigator';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  const { user, isAuthenticated, isLoading, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isLoading) {
    return <LoadingScreen message="Initializing ConstructIQ..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : user?.role === 'Contractor' ? (
          <Stack.Screen name="ContractorApp" component={ContractorNavigator} />
        ) : user?.role === 'Worker' ? (
          <Stack.Screen name="WorkerApp" component={WorkerNavigator} />
        ) : user?.role === 'Homeowner' ? (
          <Stack.Screen name="HomeownerApp" component={HomeownerNavigator} />
        ) : user?.role === 'Admin' ? (
          <Stack.Screen name="AdminApp" component={AdminNavigator} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
