import { palette, lightTheme, darkTheme } from './colors';
import { typography } from './typography';

export const theme = {
  light: {
    colors: lightTheme,
    typography,
  },
  dark: {
    colors: darkTheme,
    typography,
  },
};

export type ThemeType = typeof theme.light;
export type ColorsType = typeof lightTheme;
export type TypographyType = typeof typography;

export { palette, typography };
export default theme;