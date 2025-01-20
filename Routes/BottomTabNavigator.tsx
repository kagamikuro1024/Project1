import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import MainScreen from '../Screens/Mainscreen';
import StatsScreen from '../Screens/StatsScreen';
import NotificationScreen from '../Screens/NotificationScreen';
import SettingScreen from '../Screens/SettingScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Stats':
              iconName = 'bar-chart';
              break;
            case 'Notifications':
              iconName = 'notifications';
              break;
            case 'Settings':
              iconName = 'settings';
              break;
            default:
              iconName = 'help';
              break;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={MainScreen} 
        options={{ headerShown: false }} 
      />
      <Tab.Screen 
        name="Stats" 
        component={StatsScreen}
        options={{ headerShown: false }} 
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationScreen} 
        options={{ headerShown: false }} 
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingScreen} 
        options={{ headerShown: false }} 
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
