import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  RootTabParamList,
  ROUTES,
  TAB_ICONS
} from './types';
import MainScreen from '../screens/main/Mainscreen';
import StatsScreen from '../screens/main/StatsScreen';
import NotificationScreen from '../screens/main/NotificationScreen';
import SettingScreen from '../screens/main/SettingScreen';
import SplitBillScreen from '../screens/main/SplitBillScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();

const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const iconName = TAB_ICONS[route.name as ROUTES] || 'help';
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name={ROUTES.HOME}
        component={MainScreen} 
        options={{ headerShown: false }} 
      />
      <Tab.Screen 
        name={ROUTES.STATS}
        component={StatsScreen}
        options={{ headerShown: false }} 
      />
      <Tab.Screen 
        name={ROUTES.SPLIT}
        component={SplitBillScreen}
        options={{ 
          headerShown: false,
          title: 'Split Bill'
        }} 
      />
      <Tab.Screen 
        name={ROUTES.NOTIFICATIONS}
        component={NotificationScreen} 
        options={{ headerShown: false }} 
      />
      <Tab.Screen 
        name={ROUTES.SETTINGS}
        component={SettingScreen} 
        options={{ headerShown: false }} 
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;