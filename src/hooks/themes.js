import { DefaultTheme, DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...(DefaultTheme?.colors || {}),
    background: '#ffffff',
    text: '#000000',
    surface: '#f0f0f0',
    primary: '#007AFF',
    secondaryText: '#666666',
  },
};

export const darkTheme = {
  ...DarkTheme,
  colors: {
    ...(DarkTheme?.colors || {}),
    background: '#000000',
    text: '#ffffff',
    surface: '#121212',
    primary: '#0A84FF',
    secondaryText: '#EBEBF5',
  },
};
