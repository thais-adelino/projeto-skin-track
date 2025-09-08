import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'glass' | 'solid';
}

const Card: React.FC<Props> = ({ children, style, variant = 'default' }) => {
  const getCardStyle = () => {
    switch (variant) {
      case 'glass':
        return styles.glassCard;
      case 'solid':
        return styles.solidCard;
      default:
        return styles.defaultCard;
    }
  };

  return (
    <View style={[getCardStyle(), style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  defaultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  solidCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
});

export default Card;
