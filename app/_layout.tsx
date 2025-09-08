import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import LoadingScreen from '../components/LoadingScreen';
import NameForm from '../components/NameForm';
import ChatBot from '../components/ChatBot';
import StatisticsPage from '../components/StatisticsPage';

type AppState = 'loading' | 'nameForm' | 'chat' | 'statistics';

const Layout = () => {
  const [appState, setAppState] = useState<AppState>('loading');
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    setTimeout(() => {
      setAppState('nameForm'); // Go to name form after loading
    }, 2000);
  }, []);

  const handleNameSubmit = (name: string) => {
    setUserName(name);
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
    <SafeAreaView style={{ flex: 1 }}>
      {renderCurrentScreen()}
    </SafeAreaView>
  );
};

export default Layout;