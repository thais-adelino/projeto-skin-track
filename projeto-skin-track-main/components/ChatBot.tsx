import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import useChatLogic from '../hooks/useChatLogic';
import ProductRecommendations from './ProductRecommendations';
import GradientBackground from './ui/GradientBackground';
import Card from './ui/Card';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
}

interface Props {
  userName: string;
  onShowStatistics: () => void;
  onStartOver: () => void;
}

const ChatBot: React.FC<Props> = ({ userName, onShowStatistics, onStartOver }) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const {
    currentQuestion,
    handleResponse,
    isFinished,
    getSkinAnalysis,
    saveUserData,
    messages = [],
  } = useChatLogic(userName);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollViewRef.current && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  if (isFinished) {
    const analysis = getSkinAnalysis();
    return (
      <ProductRecommendations 
        skinType={analysis.skinType}
        characteristics={analysis.characteristics}
        userName={userName}
        onShowStatistics={onShowStatistics}
        onStartOver={onStartOver}
        saveUserData={saveUserData}
      />
    );
  }

  return (
    <GradientBackground>
      <View style={styles.container}>
        <View style={styles.header}>
                      <Text style={styles.headerTitle}>Qual é minha pele?</Text>
            <Text style={styles.headerSubtitle}>Consulta de Análise da Pele</Text>
        </View>

                            <View style={styles.chatWrapper}>
                      <ScrollView
                        ref={scrollViewRef}
                        style={styles.chatContainer}
                        contentContainerStyle={styles.chatContent}
                        showsVerticalScrollIndicator={false}
                      >
            {messages.map((message: Message) => (
              <View
                key={message.id}
                style={[
                  styles.messageContainer,
                  message.isBot ? styles.botMessage : styles.userMessage,
                ]}
              >
                <Text style={[
                  styles.messageText,
                  message.isBot ? styles.botMessageText : styles.userMessageText
                ]}>
                  {message.text}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
        
        <Card variant="glass" style={styles.bottomSection}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
          
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.buttonContainer}
                onPress={() => handleResponse(item)}
              >
                <Text style={styles.buttonText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  chatWrapper: {
    flex: 1,
    marginHorizontal: 16,
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    paddingBottom: 24,
  },
  bottomSection: {
    margin: 16,
    marginTop: 8,
  },
  questionText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 28,
  },
  messageContainer: {
    maxWidth: '85%',
    marginVertical: 6,
    padding: 16,
    borderRadius: 20,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderBottomRightRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  botMessageText: {
    color: 'rgba(255, 255, 255, 0.95)',
  },
  userMessageText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  optionsContainer: {
    gap: 12,
  },
  buttonContainer: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default ChatBot;