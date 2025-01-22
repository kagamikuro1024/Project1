import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
import { useAppContext } from '../../context/AppContext';

interface PasswordScreenProps {
  onSuccess: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
}

const PasswordScreen: React.FC<PasswordScreenProps> = ({ 
  onSuccess, 
  onCancel,
  showCancel = true 
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { state } = useAppContext();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleSubmit = () => {
    if (!password) {
      setError('Vui lòng nhập mật khẩu');
      return;
    }

    if (password === state.password) {
      setError('');
      setPassword('');
      onSuccess();
    } else {
      setError('Mật khẩu không đúng');
      setPassword('');
    }
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.surface}>
        <Text style={styles.title}>Xác thực mật khẩu</Text>
        <Text style={styles.subtitle}>Vui lòng nhập mật khẩu để tiếp tục</Text>
        
        <TextInput
          mode="outlined"
          secureTextEntry
          label="Mật khẩu"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError('');
          }}
          style={styles.input}
          error={!!error}
          right={<TextInput.Icon icon="key" />}
          autoFocus
          onSubmitEditing={handleSubmit}
        />
        
        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : null}
        
        <View style={styles.buttonContainer}>
          {showCancel && (
            <Button
              mode="text"
              onPress={onCancel}
              style={styles.button}>
              Hủy
            </Button>
          )}
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.button}
            disabled={!password}>
            Xác nhận
          </Button>
        </View>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  surface: {
    padding: 24,
    borderRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  error: {
    color: '#B00020',
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
});

export default PasswordScreen;