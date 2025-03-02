import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface Transformation {
  id: number;
  name: string;
  ki?: number;
}

interface TransformationDetailScreenProps {
  transformationId: number;
}

export default function TransformationDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { transformationId } = route.params as TransformationDetailScreenProps;
  const [loading, setLoading] = useState(true);
  const [transformation, setTransformation] = useState<Transformation | null>(null);

  useEffect(() => {
    const fetchTransformation = async () => {
      try {
        const response = await fetch(`https://dragonball-api.com/api/transformations/${transformationId}`);
        if (!response.ok) throw new Error('Failed to fetch transformation');
        const data = await response.json();
        setTransformation(data);
      } catch (error) {
        console.error('Error fetching transformation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransformation();
  }, [transformationId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transformation</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Hero Image */}
          <Image
            source={{ 
              uri: `https://api.a0.dev/assets/image?text=transformation ${transformation?.name}&seed=${transformationId}` 
            }}
            style={styles.transformationImage}
            resizeMode="cover"
          />

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.transformationName}>{transformation?.name}</Text>
            <View style={styles.powerLevel}>
              <Ionicons name="flash" size={24} color="#FFC107" />
              <Text style={styles.powerText}>
                Power Level: {transformation?.ki?.toLocaleString() || 'Unknown'}
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  transformationImage: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
    margin: 16,
  },
  transformationName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  powerLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 12,
    borderRadius: 12,
  },
  powerText: {
    color: '#FFC107',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 