import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator';
import TopTabNavigator from './TopTabNavigator';

const Stack = createStackNavigator();

const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MainTabs" 
        component={BottomTabNavigator} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Settings" 
        component={TopTabNavigator} 
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;