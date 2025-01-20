// SettingsScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { List } from 'react-native-paper';

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <List.Section>
        <List.Item
          title="Thông tin tài khoản"
          left={props => <List.Icon {...props} icon="account" />}
        />
        <List.Item
          title="Ngôn ngữ"
          left={props => <List.Icon {...props} icon="translate" />}
        />
        <List.Item
          title="Chủ đề"
          left={props => <List.Icon {...props} icon="theme-light-dark" />}
        />
        <List.Item
          title="Về ứng dụng"
          left={props => <List.Icon {...props} icon="information" />}
        />
      </List.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});

export default SettingsScreen;