export const Colors = {
  primary: '#233D4D',
  secondary: '#FE7F2D',
  accent: '#FCCA46',
  success: '#A1C181',
  info: '#619B8A',

  // Light mode
  light: {
    background: '#F5F7FA',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    text: '#1A2B3C',
    textSecondary: '#6B7C93',
    textMuted: '#A0ADB8',
    border: '#E8ECF0',
    inputBg: '#EEF1F5',
    tabBar: '#FFFFFF',
    tabBarInactive: '#A0ADB8',
  },

  // Dark mode
  dark: {
    background: '#1A1A1A',
    surface: '#242424',
    card: '#2A2A2A',
    text: '#F0F2F5',
    textSecondary: '#9BA8B5',
    textMuted: '#5F6B78',
    border: '#333D47',
    inputBg: '#2F2F2F',
    tabBar: '#1E1E1E',
    tabBarInactive: '#5F6B78',
  },
};

export type ColorScheme = 'light' | 'dark';
