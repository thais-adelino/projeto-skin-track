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
import GradientBackground from './ui/GradientBackground';
import Card from './ui/Card';

interface Props {
  onNameSubmit: (name: string) => void;
}

const NameForm: React.FC<Props> = ({ onNameSubmit }) => {
  const [name, setName] = useState('');

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
    onNameSubmit(trimmedName);
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
            <Text style={styles.label}>Como devemos te chamar?</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Digite seu nome..."
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
              maxLength={50}
            />
            
            <TouchableOpacity
              style={[styles.button, !name.trim() && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={!name.trim()}
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
    padding: 24,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '400',
    paddingHorizontal: 20,
  },
  formCard: {
    marginBottom: 24,
  },
  label: {
    fontSize: 20,
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '500',
  },
  button: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  buttonDisabled: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  infoCard: {
    marginTop: 24,
  },
  infoText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    lineHeight: 28,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default NameForm;
