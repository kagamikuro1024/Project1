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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reset authentication when password is disabled
    if (!state.hasPassword) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [state.hasPassword]);

  if (isLoading) {
    return null; // Or a loading spinner
  }

  if (state.hasPassword && !isAuthenticated) {
    return (
      <PasswordScreen 
        onSuccess={() => setIsAuthenticated(true)} 
        showCancel={false}
      />
    );
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