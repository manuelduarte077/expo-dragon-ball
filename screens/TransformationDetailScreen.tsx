import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity, 
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { dragonBallAPI } from '@/services/api.service';
import { Transformation } from '@/interface/transformation.interface';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  CharactersTab: {
    screen: string;
    params: { characterId: number };
  };
};

interface TransformationDetailScreenProps {
  transformationId: number;
}

export default function TransformationDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { transformationId } = route.params as TransformationDetailScreenProps;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transformation, setTransformation] = useState<Transformation | null>(null);

  const fetchTransformation = useCallback(async () => {
    try {
      setLoading(true);
      const data = await dragonBallAPI.getTransformationById(transformationId);
      setTransformation(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [transformationId]);

  useEffect(() => {
    fetchTransformation();
  }, [fetchTransformation]);

  const handleCharacterPress = () => {
    if (transformation?.character?.id) {
      navigation.navigate('CharactersTab', {
        screen: 'CharacterDetail',
        params: { characterId: transformation.character.id }
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
        <Text style={styles.loadingText}>Loading transformation details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchTransformation}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Image
            source={{ 
              uri: transformation?.image || `https://api.a0.dev/assets/image?text=transformation ${transformation?.name}&seed=${transformationId}` 
            }}
            style={styles.transformationImage}
            resizeMode="cover"
          />

          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.heroGradient}
          >
            <View style={styles.transformationNameContainer}>
              <Text style={styles.transformationName}>{transformation?.name}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Power Level Card */}
        <View style={styles.infoContainer}>
          <View style={styles.powerLevel}>
            <Ionicons name="flash" size={24} color="#FFC107" />
            <Text style={styles.powerText}>
              Power Level: {transformation?.ki || 'Unknown'}
            </Text>
          </View>
        </View>

        {/* Character Info */}
        {transformation?.character && (
          <TouchableOpacity style={styles.section} onPress={handleCharacterPress}>
            <Text style={styles.sectionTitle}>Character</Text>
            <View style={styles.characterInfo}>
              <Image 
                source={{ uri: transformation.character.image }}
                style={styles.characterImage}
              />
              <View style={styles.characterDetails}>
                <Text style={styles.characterName}>{transformation.character.name}</Text>
                <Text style={styles.characterRace}>{transformation.character.race}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="white" />
            </View>
          </TouchableOpacity>
        )}

        {/* Description */}
        {transformation?.character?.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>
              {transformation.character.description}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Back Button */}
      <TouchableOpacity
        style={styles.floatingBackButton}
        onPress={() => navigation.goBack()}
      >
        <View style={styles.backButtonContainer}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 20,
  },
  errorText: {
    color: 'white',
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  heroSection: {
    width: '100%',
    height: 600,
    position: 'relative',
  },
  transformationImage: {
    width: '100%',
    height: 600,
    position: 'absolute',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    justifyContent: 'flex-end',
    padding: 16,
  },
  transformationNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transformationName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 10,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    margin: 16,
    borderRadius: 16,
  },
  powerLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  powerText: {
    color: '#FFC107',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  section: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  descriptionText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
  },
  characterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  characterImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  characterDetails: {
    flex: 1,
    marginLeft: 12,
  },
  characterName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  characterRace: {
    color: '#AAA',
    fontSize: 14,
  },
  floatingBackButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backButtonContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
}); 