import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  userAge: number;
  onShowStatistics: () => void;
  onStartOver: () => void;
}

const ChatBot: React.FC<Props> = ({ userName, userAge, onShowStatistics, onStartOver }) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const {
    currentQuestion,
    handleResponse,
    isFinished,
    getSkinAnalysis,
    saveUserData,
    messages = [],
  } = useChatLogic(userName);

  // Compute styles based on platform
  const containerStyle = Platform.OS === 'web' 
    ? [styles.container, { paddingBottom: insets.bottom }, styles.containerWeb]
    : [styles.container, { paddingBottom: insets.bottom }];
  
  const chatContainerStyle = Platform.OS === 'web'
    ? [styles.chatContainer, styles.chatContainerWeb]
    : styles.chatContainer;
    
  const chatContentStyle = Platform.OS === 'web'
    ? [styles.chatContent, styles.chatContentWeb]
    : styles.chatContent;
    
  const bottomSectionStyle = Platform.OS === 'web'
    ? { ...styles.bottomSection, ...styles.bottomSectionWeb }
    : styles.bottomSection;

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
        userAge={userAge}
        onShowStatistics={onShowStatistics}
        onStartOver={onStartOver}
        saveUserData={saveUserData}
      />
    );
  }

  return (
    <GradientBackground>
      <View style={containerStyle}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Qual é minha pele?</Text>
          <Text style={styles.headerSubtitle}>Consulta de Análise da Pele</Text>
        </View>

        <View style={styles.chatWrapper}>
          <ScrollView
            ref={scrollViewRef}
            style={chatContainerStyle}
            contentContainerStyle={chatContentStyle}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={false}
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
        
        <Card variant="glass" style={bottomSectionStyle}>
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
  containerWeb: {
    height: '100%',
    maxHeight: '100%',
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
    minHeight: 0, // Ensures proper flex behavior
  },
  chatContainer: {
    flex: 1,
  },
  chatContainerWeb: {
    maxHeight: 400, // Limit height on web to prevent overflow
  },
  chatContent: {
    padding: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },
  chatContentWeb: {
    minHeight: 'auto', // Allow content to size naturally on web
  },
  bottomSection: {
    margin: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  bottomSectionWeb: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
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