import React, { useState, useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BottomTabNavigator from './Routes/BottomTabNavigator';
import { AppProvider, useAppContext } from './context/AppContext';
import InitialDataLoader from './components/InitialDataLoader';
import DailyNotification from './components/DailyNotification';
import PasswordScreen from './Screens/PasswordScreen';

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