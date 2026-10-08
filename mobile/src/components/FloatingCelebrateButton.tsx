import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';

interface FloatingCelebrateButtonProps {
  onPress: () => void;
  bottomOffset?: number;
}

export const FloatingCelebrateButton: React.FC<FloatingCelebrateButtonProps> = ({ 
  onPress,
  bottomOffset = 24
}) => {
  const { colors, shadows } = useAppTheme();

  return (
    <TouchableOpacity
      style={[
        styles.fab,
        shadows.fab,
        { 
          backgroundColor: colors.fabCoral,
          bottom: bottomOffset 
        }
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Feather name="plus" size={28} color="#1A1A1A" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
});
