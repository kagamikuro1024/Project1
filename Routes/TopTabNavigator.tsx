import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Appbar, IconButton } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import SettingsScreen from '../Screens/SettingScreen';
import NotificationScreen from '../Screens/NotificationScreen';

const TopTab = createMaterialTopTabNavigator();

const TopTabScreen: React.FC = () => {
  return (
    <>
      <Appbar.Header style={styles.header}>
        <View style={styles.titleContainer}>
          <Appbar.Content
            title="MoneyHS - Quản lý chi tiêu"
            style={styles.title}
            titleStyle={styles.titleText}
          />
        </View>
      </Appbar.Header>

      <TopTab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: 'gray',
          tabBarIndicatorStyle: {
            backgroundColor: '#4CAF50',
          },
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: 'bold',
          },
        }}
      >
        <TopTab.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{
            title: 'Cài đặt',
          }}
        />
        <TopTab.Screen 
          name="Notifications" 
          component={NotificationScreen}
          options={{
            title: 'Thông báo',
          }}
        />
      </TopTab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
    paddingLeft: 30,
  },
  title: {
    flex: 1,
  },
  titleText: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});

export default TopTabScreen;