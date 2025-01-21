import { Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  android: {
    regular: 'Roboto',
    medium: 'Roboto-Medium',
    bold: 'Roboto-Bold',
  },
}) || {
  regular: 'System',
  medium: 'System',
  bold: 'System',
};

export const typography = {
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontFamily: fontFamily.bold,
    letterSpacing: 0.25,
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: fontFamily.bold,
    letterSpacing: 0,
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
    fontFamily: fontFamily.medium,
    letterSpacing: 0.15,
  },
  subtitle1: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamily.medium,
    letterSpacing: 0.15,
  },
  subtitle2: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontFamily.medium,
    letterSpacing: 0.1,
  },
  body1: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamily.regular,
    letterSpacing: 0.5,
  },
  body2: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontFamily.regular,
    letterSpacing: 0.25,
  },
  button: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontFamily.medium,
    letterSpacing: 1.25,
    textTransform: 'uppercase',
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fontFamily.regular,
    letterSpacing: 0.4,
  },
  overline: {
    fontSize: 10,
    lineHeight: 16,
    fontFamily: fontFamily.regular,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
} as const;