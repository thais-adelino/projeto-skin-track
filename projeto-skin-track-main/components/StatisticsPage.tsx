import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import GradientBackground from './ui/GradientBackground';
import Card from './ui/Card';
import { API_BASE_URL } from '../constants/Config';

interface SkinTypeStatistic {
  skin_type: string;
  count: number;
  percentage: number;
}

interface StatisticsData {
  statistics: SkinTypeStatistic[];
  total: number;
}

interface Props {
  onGoBack: () => void;
}

const skinTypeLabels = {
  oily: "Oleosa",
  combination: "Mista", 
  normal: "Normal",
  dry: "Seca",
  sensitive: "Sensível"
};

const skinTypeColors = {
  oily: "rgba(255, 255, 255, 0.6)", // Consistent grey tone
  combination: "rgba(255, 255, 255, 0.5)", // Slightly lighter grey
  normal: "rgba(255, 255, 255, 0.7)", // Slightly darker grey
  dry: "rgba(255, 255, 255, 0.4)", // Lighter grey
  sensitive: "rgba(255, 255, 255, 0.8)", // Darker grey
};

const StatisticsPage: React.FC<Props> = ({ onGoBack }) => {
  const [data, setData] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStatistics = async () => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/statistics`);
      
      if (!response.ok) {
        throw new Error('Falha ao carregar estatísticas');
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Error fetching statistics:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStatistics();
  };

  if (loading) {
    return (
      <GradientBackground>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Carregando estatísticas...</Text>
        </View>
      </GradientBackground>
    );
  }

  if (error) {
    return (
      <GradientBackground>
        <View style={styles.centerContainer}>
          <Card variant="glass" style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchStatistics}>
              <Text style={styles.retryButtonText}>Tentar Novamente</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
              <Text style={styles.backButtonText}>Voltar</Text>
            </TouchableOpacity>
          </Card>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#ffffff"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButtonHeader} onPress={onGoBack}>
              <Text style={styles.backButtonHeaderText}>Voltar</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Qual é minha pele?</Text>
            <Text style={styles.subtitle}>Estatísticas da Comunidade</Text>
            <Text style={styles.totalUsers}>
              {data?.total || 0} usuárias analisadas
            </Text>
          </View>

          {data && data.statistics.length > 0 ? (
            <View style={styles.statisticsContainer}>
              {data.statistics.map((stat, index) => {
                const skinTypeKey = stat.skin_type as keyof typeof skinTypeLabels;
                const label = skinTypeLabels[skinTypeKey] || stat.skin_type;
                const color = skinTypeColors[skinTypeKey] || '#ffffff';
                
                return (
                  <Card key={stat.skin_type} variant="glass" style={styles.statCard}>
                    <View style={styles.statHeader}>
                      <View style={styles.statLabelContainer}>
                        <View style={[styles.colorIndicator, { backgroundColor: color }]} />
                        <Text style={styles.statLabel}>Pele {label}</Text>
                      </View>
                      <Text style={styles.statPercentage}>{stat.percentage}%</Text>
                    </View>
                    
                    <View style={styles.barContainer}>
                      <View 
                        style={[
                          styles.bar, 
                          { 
                            width: `${stat.percentage}%`,
                            backgroundColor: color,
                          }
                        ]} 
                      />
                    </View>
                    
                    <Text style={styles.statCount}>
                      {stat.count} {stat.count === 1 ? 'usuária' : 'usuárias'}
                    </Text>
                  </Card>
                );
              })}
            </View>
          ) : (
            <Card variant="glass" style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                Ainda não há dados suficientes para mostrar estatísticas.
              </Text>
              <Text style={styles.emptySubtext}>
                Seja uma das primeiras a fazer a análise!
              </Text>
            </Card>
          )}

          <Card variant="default" style={styles.footerCard}>
            <Text style={styles.footerText}>
              Os dados são atualizados em tempo real conforme mais usuárias fazem a análise.
            </Text>
          </Card>
        </View>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  backButtonHeader: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backButtonHeaderText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 12,
  },
  totalUsers: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '500',
  },
  statisticsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    // Card styles are handled by the Card component
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  statLabel: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '700',
  },
  statPercentage: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '800',
  },
  barContainer: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    marginBottom: 8,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  statCount: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'right',
    fontWeight: '500',
  },
  emptyCard: {
    alignItems: 'center',
    marginBottom: 32,
  },
  emptyText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '400',
  },
  footerCard: {
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '400',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 18,
    marginTop: 16,
    fontWeight: '500',
  },
  errorCard: {
    alignItems: 'center',
    maxWidth: 300,
  },
  errorText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '600',
  },
  retryButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    minWidth: 120,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    minWidth: 120,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default StatisticsPage;
