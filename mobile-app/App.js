import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import PredictionScreen from './src/screens/PredictionScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import CropInfoScreen from './src/screens/CropInfoScreen';
import WeatherScreen from './src/screens/WeatherScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Import context
import { AuthProvider, useAuth } from './src/context/AuthContext';

const Stack = createNativeStackNavigator();

function AppContent() {
  const { user, isLoading, restoreToken } = useAuth();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Restore user token from storage
        await restoreToken();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  if (!appIsReady || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2e7d32',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {user ? (
          // Authenticated screens
          <>
            <Stack.Screen 
              name="Dashboard" 
              component={DashboardScreen}
              options={{ title: 'CropYield Pro' }}
            />
            <Stack.Screen 
              name="Prediction" 
              component={PredictionScreen}
              options={{ title: 'Yield Prediction' }}
            />
            <Stack.Screen 
              name="History" 
              component={HistoryScreen}
              options={{ title: 'Prediction History' }}
            />
            <Stack.Screen 
              name="CropInfo" 
              component={CropInfoScreen}
              options={{ title: 'Crop Information' }}
            />
            <Stack.Screen 
              name="Weather" 
              component={WeatherScreen}
              options={{ title: 'Weather Forecast' }}
            />
            <Stack.Screen 
              name="Profile" 
              component={ProfileScreen}
              options={{ title: 'My Profile' }}
            />
          </>
        ) : (
          // Auth screens
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{ title: 'Create Account' }}
            />
          </>
        )}
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
});