// ProductRecommendations.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import GradientBackground from './ui/GradientBackground';
import Card from './ui/Card';

interface Props {
  skinType: string;
  characteristics: {
    oily: number;
    combination: number;
    normal: number;
    dry: number;
    sensitive: number;
  };
  userName: string;
  onShowStatistics: () => void;
  onStartOver: () => void;
  saveUserData: (name: string, skinType: string, characteristics: any) => Promise<any>;
}

const recommendations = {
  oily: {
    description: "Sua pele produz excesso de oleosidade, o que pode resultar em poros dilatados e tendência a acne.",
    products: [
      "Gel de limpeza com ácido salicílico",
      "Tônico adstringente sem álcool",
      "Hidratante oil-free",
      "Protetor solar de toque seco",
      "Máscara de argila 1-2x por semana"
    ]
  },
  combination: {
    description: "Sua pele apresenta características mistas, com áreas oleosas (geralmente zona T) e áreas normais ou secas.",
    products: [
      "Sabonete facial suave",
      "Tônico balanceador",
      "Hidratante leve para áreas secas",
      "Protetor solar gel-creme",
      "Máscaras específicas para cada região"
    ]
  },
  normal: {
    description: "Sua pele é bem equilibrada, sem oleosidade excessiva ou ressecamento significativo.",
    products: [
      "Sabonete facial neutro",
      "Hidratante leve",
      "Protetor solar diário",
      "Sérum de vitamina C",
      "Máscara hidratante semanal"
    ]
  },
  dry: {
    description: "Sua pele tende a ser ressecada, podendo apresentar descamação e sensação de repuxamento.",
    products: [
      "Sabonete facial cremoso",
      "Tônico hidratante",
      "Creme hidratante rico",
      "Protetor solar hidratante",
      "Óleo facial noturno"
    ]
  },
  sensitive: {
    description: "Sua pele é reativa e pode ficar irritada facilmente com produtos ou fatores ambientais.",
    products: [
      "Sabonete facial sem fragrância",
      "Hidratante calmante",
      "Protetor solar mineral",
      "Sérum anti-inflamatório",
      "Máscara calmante"
    ]
  }
};

const skinTypeLabels = {
  oily: "Oleosa",
  combination: "Mista",
  normal: "Normal",
  dry: "Seca",
  sensitive: "Sensível"
};

const ProductRecommendations: React.FC<Props> = ({ 
  skinType, 
  characteristics, 
  userName, 
  onShowStatistics, 
  onStartOver,
  saveUserData 
}) => {
  const [saving, setSaving] = useState(false);
  const recommendation = recommendations[skinType as keyof typeof recommendations];
  const maxValue = Math.max(...Object.values(characteristics));

  // Save user data when component mounts
  useEffect(() => {
    const saveData = async () => {
      setSaving(true);
      try {
        await saveUserData(userName, skinType, characteristics);
      } catch (error) {
        console.error('Failed to save user data:', error);
      } finally {
        setSaving(false);
      }
    };

    saveData();
  }, [userName, skinType, characteristics, saveUserData]);

  return (
    <GradientBackground>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Qual é minha pele?</Text>
            <Text style={styles.welcomeText}>Olá, {userName}!</Text>
          </View>
          
          <Card variant="glass" style={styles.resultCard}>
            <Text style={styles.resultTitle}>Sua Análise de Pele</Text>
            <View style={styles.typeContainer}>
              <Text style={styles.skinType}>
                Pele {skinTypeLabels[skinType as keyof typeof skinTypeLabels]}
              </Text>
            </View>
          </Card>

          <Card variant="default" style={styles.characteristicsCard}>
            <Text style={styles.subtitle}>Seu Perfil de Pele</Text>
            <View style={styles.characteristicsContainer}>
              {Object.entries(characteristics).map(([type, value]) => (
                <View key={type} style={styles.characteristicRow}>
                  <Text style={styles.characteristicLabel}>
                    {skinTypeLabels[type as keyof typeof skinTypeLabels]}
                  </Text>
                  <View style={styles.barContainer}>
                    <View 
                      style={[
                        styles.bar, 
                        { width: `${(value / maxValue) * 100}%` },
                        type === skinType && styles.primaryBar
                      ]} 
                    />
                  </View>
                  <Text style={styles.characteristicValue}>{Math.round((value / maxValue) * 100)}%</Text>
                </View>
              ))}
            </View>
          </Card>

          <Card variant="default" style={styles.descriptionCard}>
            <Text style={styles.descriptionTitle}>Sua Análise</Text>
            <Text style={styles.description}>{recommendation.description}</Text>
          </Card>

          <Card variant="default" style={styles.productsCard}>
            <Text style={styles.subtitle}>Produtos Recomendados</Text>
            {recommendation.products.map((product, index) => (
              <View key={index} style={styles.productItem}>
                <Text style={styles.productText}>{product}</Text>
              </View>
            ))}
          </Card>

          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={styles.statisticsButton} 
              onPress={onShowStatistics}
            >
              <Text style={styles.buttonText}>Estatísticas da Comunidade</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.startOverButton} 
              onPress={onStartOver}
            >
              <Text style={styles.buttonText}>Nova Análise</Text>
            </TouchableOpacity>
          </View>

          {saving && (
            <Card variant="default" style={styles.savingCard}>
              <Text style={styles.savingText}>Salvando seus dados...</Text>
            </Card>
          )}
        </View>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  welcomeText: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '600',
  },
  resultCard: {
    marginBottom: 20,
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  typeContainer: {
    backgroundColor: 'transparent',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  skinType: {
    fontSize: 24,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  characteristicsCard: {
    marginBottom: 20,
  },
  characteristicsContainer: {
    gap: 16,
  },
  characteristicRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  characteristicLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    width: 90,
    fontSize: 16,
    fontWeight: '600',
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 4,
  },
  primaryBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Consistent grey tone
  },
  characteristicValue: {
    color: '#ffffff',
    width: 50,
    fontSize: 16,
    textAlign: 'right',
    fontWeight: '600',
  },
  descriptionCard: {
    marginBottom: 20,
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
    fontWeight: '400',
  },
  productsCard: {
    marginBottom: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  productItem: {
    marginBottom: 12,
    paddingLeft: 8,
  },
  productText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
    fontWeight: '500',
  },
  actionButtonsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  statisticsButton: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  startOverButton: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  savingCard: {
    alignItems: 'center',
  },
  savingText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ProductRecommendations;