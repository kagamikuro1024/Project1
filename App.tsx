import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BottomTabNavigator from './Routes/BottomTabNavigator';
import { AppProvider } from './context/AppContext';
import InitialDataLoader from './components/InitialDataLoader';
import DailyNotification from './components/DailyNotification';

const App = () => {
  return (
    <AppProvider>
      <SafeAreaProvider>
        <PaperProvider>
          <NavigationContainer>
            <InitialDataLoader />
            <DailyNotification />
            <BottomTabNavigator />
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </AppProvider>
  );
};

export default App;