import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoadingScreen from '../components/LoadingScreen';
import NameForm from '../components/NameForm';
import ChatBot from '../components/ChatBot';
import StatisticsPage from '../components/StatisticsPage';

type AppState = 'loading' | 'nameForm' | 'chat' | 'statistics';

const Layout = () => {
  const [appState, setAppState] = useState<AppState>('loading');
  const [userName, setUserName] = useState<string>('');
  const [userAge, setUserAge] = useState<number>(25);

  useEffect(() => {
    setTimeout(() => {
      setAppState('nameForm'); // Go to name form after loading
    }, 2000);
  }, []);

  const handleNameSubmit = (name: string, age: number) => {
    setUserName(name);
    setUserAge(age);
    setAppState('chat');
  };

  const handleShowStatistics = () => {
    setAppState('statistics');
  };

  const handleGoBackToChat = () => {
    setAppState('chat');
  };

  const handleStartOver = () => {
    setUserName('');
    setUserAge(25);
    setAppState('nameForm');
  };

  const renderCurrentScreen = () => {
    switch (appState) {
      case 'loading':
        return <LoadingScreen />;
      case 'nameForm':
        return <NameForm onNameSubmit={handleNameSubmit} />;
      case 'chat':
        return (
          <ChatBot 
            userName={userName}
            userAge={userAge}
            onShowStatistics={handleShowStatistics}
            onStartOver={handleStartOver}
          />
        );
      case 'statistics':
        return <StatisticsPage onGoBack={handleGoBackToChat} />;
      default:
        return <LoadingScreen />;
    }
  };

  return (
    <SafeAreaProvider>
      {renderCurrentScreen()}
    </SafeAreaProvider>
  );
};

export default Layout;