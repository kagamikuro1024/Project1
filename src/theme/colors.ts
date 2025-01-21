export const palette = {
    primary: '#2196F3',
    primaryDark: '#1976D2',
    primaryLight: '#BBDEFB',
    
    secondary: '#FF4081',
    secondaryDark: '#C51162',
    secondaryLight: '#FF80AB',
    
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FFC107',
    info: '#2196F3',
    
    grey50: '#FAFAFA',
    grey100: '#F5F5F5',
    grey200: '#EEEEEE',
    grey300: '#E0E0E0',
    grey400: '#BDBDBD',
    grey500: '#9E9E9E',
    grey600: '#757575',
    grey700: '#616161',
    grey800: '#424242',
    grey900: '#212121',
    
    white: '#FFFFFF',
    black: '#000000',
  } as const;
  
  export const lightTheme = {
    background: palette.white,
    surface: palette.grey50,
    text: palette.grey900,
    textSecondary: palette.grey600,
    border: palette.grey200,
    ...palette,
  };
  
  export const darkTheme = {
    background: palette.grey900,
    surface: palette.grey800,
    text: palette.white,
    textSecondary: palette.grey400,
    border: palette.grey700,
    ...palette,
  };
  