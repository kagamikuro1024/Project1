import React, { useState, useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import { AppProvider, useAppContext } from './src/context/AppContext';
import InitialDataLoader from './src/components/features/InitialDataLoader';
import DailyNotification from './src/components/features/DailyNotification';
import PasswordScreen from './src/screens/auth/PasswordScreen';

const AppContent = () => {
  const { state } = useAppContext();
  const [isAuthenticated, setIsAuthenticated] = useState(!state.hasPassword);

  if (!isAuthenticated) {
    return <PasswordScreen onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={state.theme}>
        <NavigationContainer>
          <InitialDataLoader />
          <DailyNotification />
          <BottomTabNavigator />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;