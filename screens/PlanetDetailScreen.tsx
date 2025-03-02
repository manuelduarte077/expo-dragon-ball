import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons,     } from "@expo/vector-icons";
import { toast } from "sonner-native";
import { DragonBallAPI } from '@/core/api/dragonball.service';
import { Planet } from '@/interface/planet.interface';
import { Character } from '@/interface/character.interface';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  PlanetsTab: {
    screen: string;
    params: { planetId: number };
  };
  CharactersStack: {
    screen: string;
    params: { characterId: number };
  };
  PlanetsStack: {
    screen: string;
    params: { planetId: number };
  };
};

interface PlanetDetailScreenProps {
  planetId: number;
}

export default function PlanetDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { planetId } = route.params as PlanetDetailScreenProps;
  
  const [planet, setPlanet] = useState<Planet | null>(null);
  const [residents, setResidents] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [residentsLoading, setResidentsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlanetData = async () => {
    try {
      setLoading(true);
      const planetData = await DragonBallAPI.getPlanetById(planetId);
      setPlanet(planetData);

      setResidentsLoading(true);
      const charactersResponse = await DragonBallAPI.getCharacters({ limit: 100 });
      
      const planetResidents = charactersResponse.items.filter(
        (character: Character) => character.originPlanet?.id === planetId
      );
      setResidents(planetResidents);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      toast.error('Error loading planet details');
    } finally {
      setLoading(false);
      setResidentsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanetData();
  }, [planetId]);

  const handleRetry = () => {
    setError(null);
    fetchPlanetData();
  };

  const renderCharacterCard = ({ item }: { item: Character }) => (
    <TouchableOpacity 
      style={styles.characterCard}
      onPress={() => navigation.navigate('CharactersStack', { screen: 'CharacterDetail', params: { characterId: item.id } })}
    >
      <Image
        source={{ 
          uri: item.image || `https://api.a0.dev/assets/image?text=dragon ball character ${item.name}&seed=${item.id}` 
        }}
        style={styles.characterImage}
        resizeMode="cover"
      />
      <View style={styles.characterInfo}>
        <Text style={styles.characterName}>{item.name}</Text>
        <Text style={styles.characterRace}>{item.race || 'Unknown Race'}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#AAA" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3367FF" />
        <Text style={styles.loadingText}>Loading planet details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={handleRetry}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e', '#1a1a2e']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{planet?.name}</Text>
          <View style={styles.placeholder} />
        </View>
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.heroSection}>
            <Image
              source={{ 
                uri: `https://api.a0.dev/assets/image?text=planet ${planet?.name} from dragon ball landscape view from space&seed=${planet?.id}` 
              }}
              style={styles.planetImage}
              resizeMode="cover"
            />
            
            <LinearGradient
              colors={['transparent', 'rgba(26, 26, 46, 0.8)', '#1a1a2e']}
              style={styles.heroGradient}
            >
              <View style={styles.planetNameContainer}>
                <Text style={styles.planetName}>{planet?.name}</Text>
                {planet?.isDestroyed && (
                  <View style={styles.destroyedBadge}>
                    <Text style={styles.destroyedText}>Destroyed</Text>
                  </View>
                )}
              </View>
            </LinearGradient>
          </View>
          
          {/* Planet Information */}
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Ionicons name="globe-outline" size={22} color="#3367FF" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Description</Text>
                <Text style={styles.infoValue}>
                  {planet?.description || 'No description available for this planet.'}
                </Text>
              </View>
            </View>
          </View>
          
          {/* Residents Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Residents</Text>
            
            {residentsLoading ? (
              <View style={styles.loadingResidents}>
                <ActivityIndicator size="small" color="#3367FF" />
                <Text style={styles.loadingResidentsText}>Loading residents...</Text>
              </View>
            ) : residents.length > 0 ? (
              <FlatList
                data={residents}
                renderItem={renderCharacterCard}
                keyExtractor={item => item.id.toString()}
                scrollEnabled={false}
                contentContainerStyle={styles.residentsList}
              />
            ) : (
              <View style={styles.noResidentsContainer}>
                <Ionicons name="people-outline" size={32} color="#666" />
                <Text style={styles.noResidentsText}>
                  No known residents
                </Text>
              </View>
            )}
          </View>
          
          {/* Additional Information */}
          <View style={styles.orbSection}>
            <Text style={styles.orbSectionTitle}>Planet Animation</Text>
            <View style={styles.orbContainer}>
              <Image
                source={{ 
                  uri: `https://api.a0.dev/assets/image?text=animated rotating planet ${planet?.name} from dragon ball&seed=${planet?.id + 10}` 
                }}
                style={styles.orbImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </ScrollView>
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
    backgroundColor: '#3367FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    zIndex: 10,
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
  scrollView: {
    flex: 1,
  },
  heroSection: {
    position: 'relative',
    height: 250,
  },
  planetImage: {
    width: '100%',
    height: 250,
    position: 'absolute',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    justifyContent: 'flex-end',
    padding: 16,
  },
  planetNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planetName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 10,
  },
  destroyedBadge: {
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  destroyedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    color: '#AAA',
    fontSize: 14,
    marginBottom: 4,
  },
  infoValue: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
  },
  section: {
    padding: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  loadingResidents: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingResidentsText: {
    color: '#AAA',
    marginLeft: 10,
  },
  residentsList: {
    paddingBottom: 8,
  },
  characterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  characterImage: {
    width: 70,
    height: 70,
    backgroundColor: '#333',
  },
  characterInfo: {
    flex: 1,
    padding: 12,
  },
  characterName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  characterRace: {
    color: '#BBB',
    fontSize: 14,
  },
  noResidentsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
  },
  noResidentsText: {
    color: '#AAA',
    fontSize: 16,
    marginTop: 12,
  },
  orbSection: {
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  orbSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  orbContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
  },
  orbImage: {
    width: '100%',
    height: '100%',
  },
});


