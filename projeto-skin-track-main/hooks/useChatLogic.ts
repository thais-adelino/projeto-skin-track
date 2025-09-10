import { useState, useCallback } from 'react';
import { API_BASE_URL } from '../constants/Config';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
}

interface Question {
  id: number;
  question: string;
  options: string[];
}

interface SkinAnalysis {
  skinType: string;
  characteristics: {
    oily: number;
    combination: number;
    normal: number;
    dry: number;
    sensitive: number;
  };
}

const questions: Question[] = [
  {
    id: 1,
    question: "Como você descreveria a oleosidade da sua pele?",
    options: [
      "Muito oleosa em todo o rosto",
      "Oleosa na zona T",
      "Normal, sem oleosidade excessiva",
      "Ressecada ou com descamação",
      "Muda dependendo do clima ou estação"
    ]
  },
  {
    id: 2,
    question: "Sua pele costuma ter reações a produtos cosméticos?",
    options: [
      "Fica irritada facilmente, com vermelhidão ou coceira",
      "Algumas vezes, depende do produto",
      "Raramente ou nunca tem reações"
    ]
  },
  {
    id: 3,
    question: "Como são os poros da sua pele?",
    options: [
      "Grandes e visíveis em todo o rosto",
      "Visíveis apenas na zona T",
      "Pequenos e pouco visíveis",
      "Muito pequenos ou quase invisíveis"
    ]
  },
  {
    id: 4,
    question: "Como sua pele fica ao longo do dia?",
    options: [
      "Brilhante ou com excesso de oleosidade",
      "Mista: brilho em algumas áreas, mas normal ou seca em outras",
      "Equilibrada, com textura uniforme",
      "Seca, opaca ou com descamação"
    ]
  },
  {
    id: 5,
    question: "Você sente repuxamento na pele?",
    options: [
      "Sempre",
      "Algumas vezes",
      "Raramente ou nunca"
    ]
  },
  {
    id: 6,
    question: "Como sua pele reage ao sol?",
    options: [
      "Queima facilmente e fica vermelha",
      "Fica um pouco avermelhada, mas depois bronzeia",
      "Bronzeia facilmente e raramente queima",
      "Fica sempre muito sensível ao sol"
    ]
  },
  {
    id: 7,
    question: "Qual é sua rotina atual de cuidados com a pele?",
    options: [
      "Apenas lavo o rosto",
      "Lavo e uso um hidratante ou protetor solar",
      "Tenho uma rotina completa (limpeza, hidratação, tratamento, etc.)",
      "Não tenho uma rotina fixa"
    ]
  },
  {
    id: 8,
    question: "Qual é sua principal preocupação com a pele?",
    options: [
      "Acne ou oleosidade excessiva",
      "Ressecamento ou falta de hidratação",
      "Rugas, linhas finas ou flacidez",
      "Manchas ou tom desigual",
      "Sensibilidade ou vermelhidão"
    ]
  }
];

const useChatLogic = (userName?: string) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([{
    id: '0',
    text: userName 
      ? `Olá, ${userName}! Vou ajudar você a descobrir seu tipo de pele. Vamos começar?`
      : 'Olá! Vou ajudar você a descobrir seu tipo de pele. Vamos começar?',
    isBot: true
  }]);
  const [skinTypePoints, setSkinTypePoints] = useState({
    oily: 0,
    combination: 0,
    normal: 0,
    dry: 0,
    sensitive: 0
  });

  const processAnswer = useCallback((questionId: number, answer: string) => {
    const newPoints = { ...skinTypePoints };

    switch (questionId) {
      case 1:
        if (answer === "Muito oleosa em todo o rosto") newPoints.oily += 2;
        if (answer === "Oleosa na zona T") newPoints.combination += 1;
        if (answer === "Normal, sem oleosidade excessiva") newPoints.normal += 2;
        if (answer === "Ressecada ou com descamação") newPoints.dry += 2;
        if (answer === "Muda dependendo do clima ou estação") newPoints.sensitive += 1;
        break;
      case 2:
        if (answer === "Fica irritada facilmente, com vermelhidão ou coceira") newPoints.sensitive += 2;
        if (answer === "Algumas vezes, depende do produto") newPoints.sensitive += 1;
        if (answer === "Raramente ou nunca tem reações") newPoints.normal += 2;
        break;
      case 3:
        if (answer === "Grandes e visíveis em todo o rosto") newPoints.oily += 2;
        if (answer === "Visíveis apenas na zona T") newPoints.combination += 2;
        if (answer === "Pequenos e pouco visíveis") newPoints.normal += 2;
        if (answer === "Muito pequenos ou quase invisíveis") newPoints.dry += 1;
        break;
      case 4:
        if (answer === "Brilhante ou com excesso de oleosidade") newPoints.oily += 2;
        if (answer === "Mista: brilho em algumas áreas, mas normal ou seca em outras") newPoints.combination += 2;
        if (answer === "Equilibrada, com textura uniforme") newPoints.normal += 2;
        if (answer === "Seca, opaca ou com descamação") newPoints.dry += 2;
        break;
      case 5:
        if (answer === "Sempre") newPoints.dry += 2;
        if (answer === "Algumas vezes") newPoints.sensitive += 1;
        if (answer === "Raramente ou nunca") newPoints.normal += 1;
        break;
      case 6:
        if (answer === "Queima facilmente e fica vermelha") newPoints.sensitive += 2;
        if (answer === "Fica um pouco avermelhada, mas depois bronzeia") newPoints.sensitive += 1;
        if (answer === "Bronzeia facilmente e raramente queima") newPoints.normal += 1;
        if (answer === "Fica sempre muito sensível ao sol") newPoints.sensitive += 2;
        break;
      case 7:
        if (answer === "Apenas lavo o rosto") newPoints.oily += 1;
        if (answer === "Lavo e uso um hidratante ou protetor solar") newPoints.normal += 1;
        if (answer === "Tenho uma rotina completa (limpeza, hidratação, tratamento, etc.)") {
          newPoints.dry += 1;
          newPoints.sensitive += 1;
        }
        if (answer === "Não tenho uma rotina fixa") newPoints.sensitive += 1;
        break;
      case 8:
        if (answer === "Acne ou oleosidade excessiva") newPoints.oily += 2;
        if (answer === "Ressecamento ou falta de hidratação") newPoints.dry += 2;
        if (answer === "Rugas, linhas finas ou flacidez") newPoints.dry += 1;
        if (answer === "Manchas ou tom desigual") newPoints.sensitive += 1;
        if (answer === "Sensibilidade ou vermelhidão") newPoints.sensitive += 2;
        break;
    }

    setSkinTypePoints(newPoints);
  }, [skinTypePoints]);

  const handleResponse = useCallback((response: string) => {
    const newMessages = [
      ...messages,
      {
        id: Date.now().toString(),
        text: response,
        isBot: false
      }
    ];

    processAnswer(questions[currentQuestionIndex].id, response);
    setResponses([...responses, response]);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      newMessages.push({
        id: (Date.now() + 1).toString(),
        text: questions[currentQuestionIndex + 1].question,
        isBot: true
      });
    }
    
    setMessages(newMessages);
  }, [currentQuestionIndex, messages, responses, processAnswer]);

  const saveUserData = useCallback(async (name: string, skinType: string, characteristics: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          skinType,
          characteristics
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save user data');
      }

      const result = await response.json();
      console.log('User data saved successfully:', result);
      return result;
    } catch (error) {
      console.error('Error saving user data:', error);
      // Don't throw error to prevent app crash, just log it
      return null;
    }
  }, []);

  const getSkinAnalysis = useCallback((): SkinAnalysis => {
    const maxPoints = Math.max(...Object.values(skinTypePoints));
    const primarySkinType = Object.keys(skinTypePoints).find(
      (key) => skinTypePoints[key as keyof typeof skinTypePoints] === maxPoints
    ) || 'normal';

    return {
      skinType: primarySkinType,
      characteristics: { ...skinTypePoints }
    };
  }, [skinTypePoints]);

  return {
    currentQuestion: questions[currentQuestionIndex],
    handleResponse,
    isFinished: currentQuestionIndex === questions.length - 1 && responses.length === questions.length,
    getSkinAnalysis,
    saveUserData,
    responses,
    messages,
  };
};

export default useChatLogic; 