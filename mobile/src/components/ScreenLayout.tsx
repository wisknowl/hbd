import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, StatusBar, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../context/ThemeContext';

interface ScreenLayoutProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  safeTop?: boolean;
  safeBottom?: boolean;
  fullBleed?: boolean;
  backgroundColor?: string;
}

/**
 * Reusable Screen Layout that rigorously accounts for:
 * - Phone top notifications / clock / notch / camera punch-hole (insets.top + Android status bar)
 * - Phone bottom system buttons / gesture indicator pill (insets.bottom)
 */
export const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  children,
  style,
  contentStyle,
  safeTop = true,
  safeBottom = false,
  fullBleed = false,
  backgroundColor,
}) => {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();

  const bg = backgroundColor || colors.bg;

  // On Android, StatusBar.currentHeight handles the notification bar if insets.top is 0
  const topInset = fullBleed 
    ? 0 
    : Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0);

  const bottomInset = safeBottom ? Math.max(insets.bottom, 12) : 0;

  return (
    <View style={[styles.container, { backgroundColor: bg }, style]}>
      <View
        style={[
          styles.content,
          safeTop && { paddingTop: topInset },
          safeBottom && { paddingBottom: bottomInset },
          contentStyle,
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
