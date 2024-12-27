import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Hoặc bộ icon khác
import { View, Text } from 'react-native';

import EditScreen from './EditScreen'; // Màn hình trống khi nhấn dấu cộng
import MainScreen from './Mainscreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Để sử dụng Stack Navigator cho EditScreen

// Khai báo kiểu RootTabParamList
type RootTabParamList = {
  Home: undefined;
  Add: undefined; // Tab dấu cộng sẽ trỏ tới màn hình này
};

const Tab = createBottomTabNavigator<RootTabParamList>();

// Tạo Stack Navigator cho EditScreen
const Stack = createNativeStackNavigator();

const MainStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={MainScreen} />
    <Stack.Screen name="Edit" component={EditScreen} />
  </Stack.Navigator>
);

const BottomTabNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: string;
            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Add') {
              iconName = 'add';
            } else {
              iconName = 'home';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={MainStackNavigator} /> {/* Hiển thị MainScreen trong Stack Navigator */}
        <Tab.Screen
          name="Add"
          component={EditScreen} // Khi nhấn vào dấu cộng, chuyển đến màn hình EditScreen
          options={{
            tabBarButton: () => (
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: 'tomato',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 20,
                }}
              >
                <Icon name="add" size={40} color="white" />
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default BottomTabNavigator;
