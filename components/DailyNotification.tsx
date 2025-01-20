import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import * as Notifications from 'expo-notifications';

// Cài đặt xử lý thông báo
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const DailyNotification = () => {
  useEffect(() => {
    // Khi component được mount, xin quyền và thiết lập thông báo
    requestPermissionsAndSetNotifications();
  }, []);

  // Hàm xin quyền thông báo và thiết lập thông báo
  const requestPermissionsAndSetNotifications = async () => {
    try {
      // Xin quyền thông báo
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Thông báo', 'Bạn cần cho phép ứng dụng gửi thông báo!');
        return;
      }

      // Xóa các thông báo cũ
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Đặt thông báo 9h sáng
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Nhắc nhở buổi sáng',
          body: 'Đừng quên cập nhật chi tiêu hôm nay nhé!',
        },
        trigger: {
          hour: 9,
          minute: 0,
          repeats: true,
        },
      });

      // Đặt thông báo 9h tối
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Nhắc nhở buổi tối',
          body: 'Đừng quên cập nhật chi tiêu hôm nay nhé!',
        },
        trigger: {
          hour: 21,
          minute: 0,
          repeats: true,
        },
      });

      console.log('Thông báo đã được thiết lập!');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể thiết lập thông báo');
    }
  };

  // Component không render gì cả
  return null;
};

export default DailyNotification;