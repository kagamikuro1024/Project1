import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BottomTabNavigator from './Routes/BottomTabNavigator';
import { AppProvider } from './context/AppContext';
import InitialDataLoader from './components/InitialDataLoader';

const App = () => {
  return (
    <AppProvider>
      <SafeAreaProvider>
        <PaperProvider>
          <NavigationContainer>
            <InitialDataLoader />
            <BottomTabNavigator />
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </AppProvider>
  );
};

export default App;