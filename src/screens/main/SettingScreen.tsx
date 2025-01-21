import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Alert, Platform } from 'react-native';
import { List, Switch, Modal, Portal, Button, TextInput } from 'react-native-paper';
import { TimePickerModal } from 'react-native-paper-dates';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import PasswordScreen from '../auth/PasswordScreen'; // Ensure this path is correct or adjust it to the correct location
import { useAppContext } from '../../context/AppContext';

const STORAGE_KEYS = {
  LANGUAGE: '@settings_language',
  THEME: '@settings_theme',
  NOTIFICATIONS: '@settings_notifications',
  PASSWORD: '@settings_password',
  DAILY_NOTIFICATION_TIME: '@settings_daily_notification_time'
};

const LANGUAGES = [
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'en', name: 'English' }
];

const THEMES = [
  { id: 'light', name: 'Sáng' },
  { id: 'dark', name: 'Tối' }
];

const SettingsScreen = () => {
  // State declarations
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('vi');
  const [currentTheme, setCurrentTheme] = useState('light');
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showTimePickerModal, setShowTimePickerModal] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordEnabled, setIsPasswordEnabled] = useState(false);
  const [error, setError] = useState('');
  const { state, dispatch } = useAppContext();
  const [showPasswordVerificationModal, setShowPasswordVerificationModal] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [language, theme, notifications, savedPassword, savedNotificationTime] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE),
        AsyncStorage.getItem(STORAGE_KEYS.THEME),
        AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS),
        AsyncStorage.getItem(STORAGE_KEYS.PASSWORD),
        AsyncStorage.getItem(STORAGE_KEYS.DAILY_NOTIFICATION_TIME)
      ]);

      if (language) setCurrentLanguage(language);
      if (theme) setCurrentTheme(theme);
      if (notifications) setIsNotificationsEnabled(JSON.parse(notifications));

      setIsPasswordEnabled(!!savedPassword);
      if (savedPassword) {
        dispatch({ type: 'SET_PASSWORD', password: savedPassword });
      }
      if (savedNotificationTime) {
        dispatch({ type: 'SET_DAILY_NOTIFICATION_TIME', time: savedNotificationTime });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const toggleNotifications = async () => {
    try {
      const newValue = !isNotificationsEnabled;
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(newValue));
      setIsNotificationsEnabled(newValue);

      if (newValue) {
        await requestNotificationPermission();
      } else {
        await disableNotifications();
      }
    } catch (error) {
      console.error('Error saving notification setting:', error);
    }
  };

  const requestNotificationPermission = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        setIsNotificationsEnabled(false);
        Alert.alert('Thông báo', 'Vui lòng cấp quyền thông báo trong cài đặt thiết bị');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  const disableNotifications = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error disabling notifications:', error);
    }
  };

  const changeLanguage = async (languageCode: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, languageCode);
      setCurrentLanguage(languageCode);
      setShowLanguageModal(false);
    } catch (error) {
      console.error('Error saving language setting:', error);
    }
  };

  const changeTheme = async (themeId: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, themeId);
      setCurrentTheme(themeId);
      setShowThemeModal(false);
    } catch (error) {
      console.error('Error saving theme setting:', error);
    }
  };

  const togglePassword = () => {
    if (isPasswordEnabled) {
      Alert.prompt(
        'Nhập mật khẩu',
        'Vui lòng nhập mật khẩu hiện tại để tắt tính năng',
        [
          { text: 'Hủy', style: 'cancel' },
          {
            text: 'Xác nhận',
            onPress: async (value) => {
              if (value === state.password) {
                await AsyncStorage.removeItem(STORAGE_KEYS.PASSWORD);
                setIsPasswordEnabled(false);
                dispatch({ type: 'SET_PASSWORD', password: null });
              } else {
                Alert.alert('Lỗi', 'Mật khẩu không đúng');
              }
            },
          },
        ],
        'secure-text'
      );
      setShowPasswordVerificationModal(true);
    } else {
      setShowPasswordModal(true);
    }
  };
  const handlePasswordVerificationSuccess = async (cancelled = false) => {
    setShowPasswordVerificationModal(false);
    if (!cancelled) {
      await AsyncStorage.removeItem(STORAGE_KEYS.PASSWORD);
      setIsPasswordEnabled(false);
      dispatch({ type: 'SET_PASSWORD', password: null });
    }
  };


  const handleSetPassword = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }
    if (password.length < 4) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 4 ký tự');
      return;
    }

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PASSWORD, password);
      dispatch({ type: 'SET_PASSWORD', password });
      setIsPasswordEnabled(true);
      setShowPasswordModal(false);
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error saving password:', error);
    }
  };

  const scheduleDailyNotification = async (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);

    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Nhắc nhở hàng ngày',
        body: 'Đã đến giờ cập nhật chi tiêu của bạn!',
      },
      trigger: {
        hour: hours,
        minute: minutes,
        repeats: true,
      },
    });

    await AsyncStorage.setItem(STORAGE_KEYS.DAILY_NOTIFICATION_TIME, time);
    dispatch({ type: 'SET_DAILY_NOTIFICATION_TIME', time });
  };

  const showAboutInfo = () => {
    Alert.alert(
      'Về ứng dụng',
      'Phiên bản: 1.0.0\nPhát triển bởi: [Tên công ty/nhóm phát triển]\nLiên hệ: example@email.com',
      [{ text: 'Đóng', style: 'cancel' }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cài đặt</Text>
      <List.Section>
        <List.Item
          title="Ngôn ngữ"
          description={LANGUAGES.find(lang => lang.code === currentLanguage)?.name}
          left={props => <List.Icon {...props} icon="translate" />}
          onPress={() => setShowLanguageModal(true)}
          style={styles.listItem}
        />
        <List.Item
          title="Chủ đề"
          description={THEMES.find(theme => theme.id === currentTheme)?.name}
          left={props => <List.Icon {...props} icon="theme-light-dark" />}
          onPress={() => setShowThemeModal(true)}
          style={styles.listItem}
        />
        <List.Item
          title="Thông báo"
          left={props => <List.Icon {...props} icon="bell" />}
          right={props => (
            <Switch
              value={isNotificationsEnabled}
              onValueChange={toggleNotifications}
            />
          )}
          style={styles.listItem}
        />
        <List.Item
          title="Bảo vệ bằng mật khẩu"
          description={isPasswordEnabled ? "Đang bật" : "Đang tắt"}
          left={props => <List.Icon {...props} icon="lock" />}
          right={props => (
            <Switch
              value={isPasswordEnabled}
              onValueChange={togglePassword}
            />
          )}
          style={styles.listItem}
        />
        <List.Item
          title="Nhắc nhở hàng ngày"
          description={state.dailyNotificationTime ? `Thời gian: ${state.dailyNotificationTime}` : 'Chưa đặt giờ'}
          left={props => <List.Icon {...props} icon="clock" />}
          onPress={() => setShowTimePickerModal(true)}
          style={styles.listItem}
        />
        <List.Item
          title="Về ứng dụng"
          left={props => <List.Icon {...props} icon="information" />}
          onPress={showAboutInfo}
          style={styles.listItem}
        />
      </List.Section>

      {/* Modals */}
      <Portal>
        <Modal
          visible={showPasswordModal}
          onDismiss={() => setShowPasswordModal(false)}
          contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>Đặt mật khẩu mới</Text>
          <Text style={styles.modalSubtitle}>
            Mật khẩu phải có ít nhất 4 ký tự
          </Text>
          <TextInput
            mode="outlined"
            secureTextEntry
            label="Mật khẩu mới"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError('');
            }}
            style={styles.input}
            error={!!error}
            right={<TextInput.Icon icon="key" />}
          />
          <TextInput
            mode="outlined"
            secureTextEntry
            label="Xác nhận mật khẩu"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setError('');
            }}
            style={styles.input}
            error={!!error}
            right={<TextInput.Icon icon="key" />}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <View style={styles.buttonContainer}>
            <Button
              mode="text"
              onPress={() => {
                setShowPasswordModal(false);
                setPassword('');
                setConfirmPassword('');
                setError('');
              }}
              style={styles.button}>
              Hủy
            </Button>
            <Button
              mode="contained"
              onPress={handleSetPassword}
              style={styles.button}
              disabled={!password || !confirmPassword}>
              Xác nhận
            </Button>
          </View>
        </Modal>

        <Modal
          visible={showPasswordVerificationModal}
          onDismiss={() => setShowPasswordVerificationModal(false)}
          contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>Xác minh mật khẩu</Text>
          <TextInput
            mode="outlined"
            secureTextEntry
            label="Nhập mật khẩu"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            error={!!error}
            right={<TextInput.Icon icon="key" />}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <View style={styles.buttonContainer}>
            <Button
              mode="text"
              onPress={() => setShowPasswordVerificationModal(false)}
              style={styles.button}>
              Hủy
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                if (password !== state.password) {
                  setError('Mật khẩu không đúng');
                  return;
                }
                handlePasswordVerificationSuccess();
              }}
              style={styles.button}>
              Xác nhận
            </Button>
          </View>
        </Modal>


        <Modal
          visible={showThemeModal}
          onDismiss={() => setShowThemeModal(false)}
          contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>Chọn chủ đề</Text>
          {THEMES.map(theme => (
            <Button
              key={theme.id}
              mode={currentTheme === theme.id ? 'contained' : 'outlined'}
              onPress={() => changeTheme(theme.id)}
              style={styles.modalButton}>
              {theme.name}
            </Button>
          ))}
        </Modal>

        <Modal
          visible={showPasswordModal}
          onDismiss={() => setShowPasswordModal(false)}
          contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>Đặt mật khẩu</Text>
          <TextInput
            secureTextEntry
            label="Mật khẩu mới"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />
          <TextInput
            secureTextEntry
            label="Xác nhận mật khẩu"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={handleSetPassword}
            style={styles.modalButton}>
            Xác nhận
          </Button>
        </Modal>
      </Portal>

      <TimePickerModal
        visible={showTimePickerModal}
        onDismiss={() => setShowTimePickerModal(false)}
        onConfirm={({ hours, minutes }: { hours: number; minutes: number }) => {
          const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          scheduleDailyNotification(time);
          setShowTimePickerModal(false);
        }}
        hours={state.dailyNotificationTime ? parseInt(state.dailyNotificationTime.split(':')[0]) : 12}
        minutes={state.dailyNotificationTime ? parseInt(state.dailyNotificationTime.split(':')[1]) : 0}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  title: {
    paddingTop: 25,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listItem: {
    marginVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButton: {
    marginVertical: 8,
  },
  input: {
    marginBottom: 16,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  error: {
    color: '#B00020',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default SettingsScreen;