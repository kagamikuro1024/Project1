import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Card, IconButton, Button } from 'react-native-paper';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppContext } from '../context/AppContext';

const NotificationScreen = () => {
  const { state } = useAppContext();
  const [notifications, setNotifications] = useState<Notifications.NotificationRequest[]>([]);

  useEffect(() => {
    const init = async () => {
      const isEnabled = await checkDailyNotificationStatus();
      if (isEnabled) {
        fetchScheduledNotifications();
      } else {
        setNotifications([]); // Không hiển thị nếu chưa bật thông báo
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (state) {
      createNotification('Thông tin đã thay đổi', 'Dữ liệu chi tiêu hoặc thu nhập đã được cập nhật.');
    }
  }, [state]);

  const checkDailyNotificationStatus = async () => {
    const isEnabled = await AsyncStorage.getItem('DailyNotificationEnabled');
    return isEnabled === 'true';
  };

  const fetchScheduledNotifications = async () => {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      setNotifications(scheduledNotifications);
    } catch (error) {
      console.error('Error fetching scheduled notifications:', error);
    }
  };

  const createNotification = async (title: string, body: string) => {
    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
        },
        trigger: null, // Gửi ngay lập tức
      });
      setNotifications((prevNotifications) => [
              ...prevNotifications,
              {
                identifier,
                content: { title, body, subtitle: null, data: {}, sound: null },
                trigger: { seconds: 0, repeats: false, type: 'timeInterval' }, // Valid NotificationTrigger
              },
            ]);
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const cancelNotification = async (identifier: string) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
      setNotifications(notifications.filter(notification => notification.identifier !== identifier));
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  };

  const cancelAllNotifications = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      setNotifications([]);
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  };

  const renderItem = ({ item }: { item: Notifications.NotificationRequest }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.content.title}
        subtitle={item.content.body}
        right={(props) => (
          <IconButton
            {...props}
            icon="close"
            onPress={() => cancelNotification(item.identifier)}
          />
        )}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông báo</Text>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.identifier}
        ListEmptyComponent={<Text style={styles.noDataText}>Không có thông báo nào</Text>}
      />
      <Button mode="contained" onPress={cancelAllNotifications} style={styles.button}>
        Xóa tất cả thông báo
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  card: {
    marginVertical: 8,
    padding: 16, // Tăng kích thước hộp thông báo
  },
  noDataText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 20,
  },
  button: {
    marginTop: 16,
    color: 'white',
  },
});

export default NotificationScreen;