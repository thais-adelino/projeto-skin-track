import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
// @ts-ignore - Picker types may not be available
import { Picker } from '@react-native-picker/picker';
import GradientBackground from './ui/GradientBackground';
import Card from './ui/Card';

interface Props {
  onNameSubmit: (name: string, age: number) => void;
}

const NameForm: React.FC<Props> = ({ onNameSubmit }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(25); // Default age
  const [isFocused, setIsFocused] = useState(false);

  // Generate age options from 13 to 80
  const ageOptions = Array.from({ length: 68 }, (_, i) => i + 13);

  const handleSubmit = () => {
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      Alert.alert('Nome inválido', 'Por favor, insira um nome com pelo menos 2 caracteres.');
      return;
    }
    if (trimmedName.length > 50) {
      Alert.alert('Nome muito longo', 'Por favor, insira um nome com no máximo 50 caracteres.');
      return;
    }
    if (!age || age < 13 || age > 80) {
      Alert.alert('Idade inválida', 'Por favor, selecione uma idade válida.');
      return;
    }
    onNameSubmit(trimmedName, age);
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Qual é o tipo da minha pele?</Text>
            <Text style={styles.subtitle}>
              Descubra qual é o tipo da sua pele e obtenha recomendações personalizadas de produtos para cuidar da sua pele.
            </Text>
          </View>

          <Card variant="glass" style={styles.formCard}>
            <View style={styles.nameRow}>
              <Text style={styles.label}>Como devemos te chamar?</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, isFocused && styles.inputFocused]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Digite seu nome..."
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="next"
                  onSubmitEditing={() => setIsFocused(false)}
                  maxLength={50}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  underlineColorAndroid="transparent"
                  selectionColor="rgba(255, 255, 255, 0.9)"
                  // Disable default focus styles
                  {...(Platform.OS === 'web' && {
                    // @ts-ignore - Web-specific props
                    style: [
                      styles.input, 
                      isFocused && styles.inputFocused,
                      { outline: 'none' }
                    ]
                  })}
                />
              </View>
            </View>

            <View style={styles.ageRow}>
              <Text style={styles.ageLabel}>Qual é a sua idade?</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={age}
                  onValueChange={(itemValue: number) => setAge(itemValue)}
                  style={styles.picker}
                  dropdownIconColor="rgba(255, 255, 255, 0.8)"
                  itemStyle={styles.pickerItem}
                  mode="dropdown"
                >
                  {ageOptions.map((ageOption) => (
                    <Picker.Item
                      key={ageOption}
                      label={`${ageOption} anos`}
                      value={ageOption}
                      color={Platform.OS === 'ios' ? '#ffffff' : '#333333'}
                    />
                  ))}
                </Picker>
              </View>
            </View>
            
            <TouchableOpacity
              style={[styles.button, !name.trim() && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={!name.trim()}
              // Disable default focus styles
              {...(Platform.OS === 'web' && {
                // @ts-ignore - Web-specific props
                style: [
                  styles.button, 
                  !name.trim() && styles.buttonDisabled,
                  { outline: 'none' }
                ]
              })}
            >
              <Text style={styles.buttonText}>Iniciar Análise</Text>
            </TouchableOpacity>
          </Card>

          <Card variant="default" style={styles.infoCard}>
            <Text style={styles.infoText}>
              Análise personalizada do tipo de pele{'\n'}
              Recomendações de produtos sob medida{'\n'}
              Insights e estatísticas da comunidade
            </Text>
          </Card>
        </View>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    maxWidth: 400, // Fixed mobile-like width for all platforms
    alignSelf: 'center',
    width: '100%',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
    paddingHorizontal: 16,
  },
  formCard: {
    marginBottom: 32,
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  nameRow: {
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  inputContainer: {
    width: '100%',
  },
  ageRow: {
    marginBottom: 32,
    alignItems: 'center',
  },
  ageLabel: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  pickerContainer: {
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
    borderColor: Platform.OS === 'ios' ? 'transparent' : 'rgba(255, 255, 255, 0.25)',
    borderWidth: Platform.OS === 'ios' ? 0 : 1,
    borderRadius: 16,
    width: '100%',
    // Platform-specific height and overflow
    ...(Platform.OS === 'ios' ? {
      height: 180, // Taller for iOS picker wheel
      overflow: 'visible', // Allow picker wheel to show
    } : {
      height: 56,
      overflow: 'hidden',
    }),
    justifyContent: 'center',
    alignItems: 'center',
    // Platform-specific padding
    ...(Platform.OS === 'web' ? {
      paddingHorizontal: 20,
      paddingVertical: 16,
      outline: 'none',
      outlineWidth: 0,
      boxShadow: 'none',
    } : {
      paddingHorizontal: 0,
      paddingVertical: 0,
    }),
  },
  picker: {
    color: '#ffffff',
    backgroundColor: 'transparent',
    fontSize: 16,
    fontWeight: '500',
    width: '100%',
    // Platform-specific height and alignment
    ...(Platform.OS === 'web' ? {
      textAlign: 'center',
      height: 24,
      outline: 'none',
      outlineWidth: 0,
      border: 'none',
      boxShadow: 'none',
      WebkitAppearance: 'none',
      MozAppearance: 'none',
      appearance: 'none',
      WebkitTapHighlightColor: 'transparent',
    } : Platform.OS === 'ios' ? {
      height: 180, // Full height for iOS picker wheel
      backgroundColor: 'transparent',
    } : {
      height: 56,
      backgroundColor: 'transparent',
    }),
  },
  pickerItem: {
    fontSize: 18,
    color: Platform.OS === 'ios' ? '#ffffff' : '#333333',
    backgroundColor: 'transparent',
    fontWeight: '500',
    textAlign: 'center',
    ...(Platform.OS === 'ios' && {
      height: 44,
      backgroundColor: 'transparent',
    }),
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '500',
    minHeight: 56,
    width: '100%',
    // Disable default focus outline
    ...(Platform.OS === 'web' && {
      outline: 'none',
      outlineWidth: 0,
    }),
  },
  inputFocused: {
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#ffffff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    minHeight: 56,
    marginTop: 24,
    shadowColor: '#ffffff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    // Disable default focus outline
    ...(Platform.OS === 'web' && {
      outline: 'none',
      outlineWidth: 0,
    }),
  },
  buttonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  infoCard: {
    marginTop: 24,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  infoText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    fontWeight: '400',
  },
});

export default NameForm;
