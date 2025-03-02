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
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { toast } from 'sonner-native';

export default function PlanetDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { planetId } = route.params;
  
  const [planet, setPlanet] = useState(null);
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [residentsLoading, setResidentsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlanetData = async () => {
      try {
        // Fetch planet details
        const planetResponse = await fetch(`https://web.dragonball-api.com/api/planets/${planetId}`);
        if (!planetResponse.ok) throw new Error('Failed to fetch planet details');
        const planetData = await planetResponse.json();
        setPlanet(planetData);
        
        // Fetch characters to find residents of this planet
        setResidentsLoading(true);
        const charactersResponse = await fetch('https://web.dragonball-api.com/api/characters?limit=100');
        if (!charactersResponse.ok) throw new Error('Failed to fetch characters');
        const charactersData = await charactersResponse.json();
        
        // Filter characters by planet
        const planetResidents = charactersData.filter(
          character => character.originPlanet && character.originPlanet.id === planetId
        );
        setResidents(planetResidents);
        setResidentsLoading(false);
      } catch (err) {
        setError(err.message);
        toast.error('Error loading planet details');
      } finally {
        setLoading(false);
      }
    };

    fetchPlanetData();
  }, [planetId]);

  const renderCharacterCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.characterCard}
      onPress={() => navigation.navigate('CharacterDetail', { characterId: item.id })}
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
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
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
          <Text style={styles.headerTitle}>{planet.name}</Text>
          <View style={styles.placeholder} />
        </View>
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Planet Hero Section */}
          <View style={styles.heroSection}>
            <Image
              source={{ 
                uri: `https://api.a0.dev/assets/image?text=planet ${planet.name} from dragon ball landscape view from space&seed=${planet.id}` 
              }}
              style={styles.planetImage}
              resizeMode="cover"
            />
            
            <LinearGradient
              colors={['transparent', 'rgba(26, 26, 46, 0.8)', '#1a1a2e']}
              style={styles.heroGradient}
            >
              <View style={styles.planetNameContainer}>
                <Text style={styles.planetName}>{planet.name}</Text>
                {planet.isDestroyed && (
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
              <FontAwesome5 name="globe-americas" size={22} color="#3367FF" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Description</Text>
                <Text style={styles.infoValue}>
                  {planet.description || 'No description available for this planet.'}
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
                <FontAwesome5 name="user-slash" size={32} color="#666" />
                <Text style={styles.noResidentsText}>No known residents</Text>
              </View>
            )}
          </View>
          
          {/* Additional Information */}
          <View style={styles.orbSection}>
            <Text style={styles.orbSectionTitle}>Planet Animation</Text>
            <View style={styles.orbContainer}>
              <Image
                source={{ 
                  uri: `https://api.a0.dev/assets/image?text=animated rotating planet ${planet.name} from dragon ball&seed=${planet.id + 10}` 
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