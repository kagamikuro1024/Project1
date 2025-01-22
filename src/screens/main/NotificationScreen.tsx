import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import { Text, Card, IconButton, Button } from 'react-native-paper';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppContext } from '../../context/AppContext';

// Cấu hình cho notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const NotificationScreen = () => {
  const { state } = useAppContext();
  const [notifications, setNotifications] = useState<Notifications.NotificationRequest[]>([]);

  useEffect(() => {
    const init = async () => {
      // Thiết lập listener cho notification
      const subscription = Notifications.addNotificationReceivedListener(notification => {
        console.log('Notification received:', notification);
      });

      // Thiết lập listener cho việc click vào notification
      const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
        const data = response.notification.request.content.data;
        showNotificationDetails(
          response.notification.request.content.title ?? '',
          response.notification.request.content.body ?? '',
          data
        );
      });

      const isEnabled = await checkDailyNotificationStatus();
      if (isEnabled) {
        await fetchScheduledNotifications();
      } else {
        setNotifications([]);
      }

      // Gửi thông báo chào mừng
      await sendWelcomeNotification();

      // Cleanup subscriptions
      return () => {
        subscription.remove();
        responseSubscription.remove();
      };
    };

    init();
  }, []);

  const sendWelcomeNotification = async () => {
    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Chào mừng trở lại! 👋',
          body: 'Chào mừng quay trở lại, hãy nhập thông tin tài chính ngày hôm nay nào!!!',
          subtitle: null,
          data: { type: 'welcome' },
        },
        trigger: null, // Gửi ngay lập tức
      });

      // Thêm thông báo vào state
      const newNotification: Notifications.NotificationRequest = {
        identifier,
        content: {
          title: 'Chào mừng trở lại! 👋',
          subtitle: null,
          body: 'Chào mừng quay trở lại, hãy nhập thông tin tài chính ngày hôm nay nào!!!',
          data: { type: 'welcome' },
          sound: null,
        },
        trigger: { type: 'timeInterval', seconds: 1, repeats: false },
      };

      setNotifications(prev => [newNotification, ...prev]);
    } catch (error) {
      console.error('Error sending welcome notification:', error);
    }
  };

  const showNotificationDetails = (title: string, body: string, data: any) => {
    Alert.alert(
      title,
      body,
      [{ text: 'OK', onPress: () => console.log('Alert closed') }],
      { cancelable: true }
    );
  };

  useEffect(() => {
    if (state) {
      createNotification('Thông tin đã thay đổi', 'Dữ liệu chi tiêu hoặc thu nhập đã được cập nhật.');
    }
  }, [state]);

  const createNotification = async (title: string, body: string) => {
    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          subtitle: null,
          data: { type: 'update' },
        },
        trigger: null, // Gửi ngay lập tức
      });

      // Thêm thông báo vào state
      const newNotification: Notifications.NotificationRequest = {
        identifier,
        content: {
          title,
          subtitle: null,
          body,
          data: { type: 'update' },
          sound: null,
        },
        trigger: { type: 'timeInterval', seconds: 1, repeats: false },
      };

      setNotifications(prev => [newNotification, ...prev]);
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const checkDailyNotificationStatus = async (): Promise<boolean> => {
    try {
      const status = await AsyncStorage.getItem('dailyNotificationStatus');
      return status === 'enabled';
    } catch (error) {
      console.error('Error checking daily notification status:', error);
      return false;
    }
  };

  const fetchScheduledNotifications = async () => {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      setNotifications(scheduledNotifications);
    } catch (error) {
      console.error('Error fetching scheduled notifications:', error);
    }
  };

  const cancelNotification = async (identifier: string) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
      setNotifications(prev => prev.filter(notification => notification.identifier !== identifier));
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

  // ... các hàm khác giữ nguyên ...

  const renderItem = ({ item }: { item: Notifications.NotificationRequest }) => (
    <TouchableOpacity
      onPress={() => showNotificationDetails(
        item.content.title ?? '',
        item.content.body ?? '',
        item.content.data
      )}
    >
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
    </TouchableOpacity>
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
    paddingTop: 16,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  card: {
    marginVertical: 8,
    padding: 16,
    elevation: 4, // Tăng độ nổi cho card
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  noDataText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 20,
  },
  button: {
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: 'grey', // Màu đỏ cho nút xóa
  },
});

export default NotificationScreen;