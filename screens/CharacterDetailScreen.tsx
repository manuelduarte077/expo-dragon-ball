import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  Dimensions,
  Animated
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { toast } from 'sonner-native';

const { width } = Dimensions.get('window');

export default function CharacterDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { characterId } = route.params;
  
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modelLoading, setModelLoading] = useState(false);
  const [showModel, setShowModel] = useState(false);
  
  // 3D model rotation animation
  const rotateX = useRef(new Animated.Value(0)).current;
  const rotateY = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await fetch(`https://dragonball-api.com/api/characters/${characterId}`);
        if (!response.ok) throw new Error('Failed to fetch character details');
        const data = await response.json();
        setCharacter(data);
      } catch (err) {
        setError(err.message);
        toast.error('Error loading character details');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [characterId]);

  const handleShowModel = () => {
    setModelLoading(true);
    setShowModel(true);
    
    // Simulate loading the 3D model
    setTimeout(() => {
      setModelLoading(false);
      
      // Start rotation animation
      Animated.loop(
        Animated.timing(rotateY, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        })
      ).start();
    }, 2000);
  };

  const handleGesture = (event) => {
    // Handle 3D model rotation based on gesture
    rotateX.setValue(event.nativeEvent.translationY / 100);
    rotateY.setValue(event.nativeEvent.translationX / 100);
  };

  const formatTransformations = () => {
    if (!character || !character.transformations || character.transformations.length === 0) {
      return null;
    }
    
    return (
      <View style={styles.sectionContent}>
        {character.transformations.map((transformation, index) => (
          <View key={index} style={styles.transformationItem}>
            <LinearGradient
              colors={['#ff7e00', '#ff9500']}
              style={styles.transformationBadge}
            >
              <Text style={styles.transformationBadgeText}>{index + 1}</Text>
            </LinearGradient>
            <Text style={styles.transformationName}>{transformation.name}</Text>
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
        <Text style={styles.loadingText}>Loading character details...</Text>
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

  const spin = rotateY.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const tiltX = rotateX.interpolate({
    inputRange: [-1, 1],
    outputRange: ['30deg', '-30deg'],
  });

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
          <Text style={styles.headerTitle}>{character.name}</Text>
          <View style={styles.placeholder} />
        </View>
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Image
              source={{ 
                uri: character.image || `https://api.a0.dev/assets/image?text=dragon ball character ${character.name}&seed=${character.id}` 
              }}
              style={styles.characterImage}
              resizeMode="cover"
            />
            
            <LinearGradient
              colors={['transparent', 'rgba(26, 26, 46, 0.8)', '#1a1a2e']}
              style={styles.heroGradient}
            >
              <View style={styles.characterNameContainer}>
                <Text style={styles.characterName}>{character.name}</Text>
                {character.isAlive === false && (
                  <View style={styles.deceasedBadge}>
                    <Text style={styles.deceasedText}>Deceased</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.characterInfoRow}>
                <View style={styles.infoChip}>
                  <MaterialCommunityIcons name="dna" size={16} color="#FF6B00" />
                  <Text style={styles.infoText}>{character.race || 'Unknown Race'}</Text>
                </View>
                
                {character.gender && (
                  <View style={styles.infoChip}>
                    <Ionicons 
                      name={character.gender.toLowerCase() === 'male' ? 'male' : 'female'} 
                      size={16} 
                      color="#4a69ff" 
                    />
                    <Text style={styles.infoText}>{character.gender}</Text>
                  </View>
                )}
                
                {character.ki && (
                  <View style={styles.infoChip}>
                    <MaterialCommunityIcons name="flash" size={16} color="#FFC107" />
                    <Text style={styles.infoText}>Power: {character.ki}</Text>
                  </View>
                )}
              </View>

              <TouchableOpacity 
                style={styles.viewModelButton}
                onPress={handleShowModel}
                disabled={showModel}
              >
                <FontAwesome5 name="cube" size={16} color="white" style={styles.buttonIcon} />
                <Text style={styles.viewModelButtonText}>View 3D Model</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
          
          {/* 3D Model Viewer */}
          {showModel && (
            <View style={styles.modelContainer}>
              {modelLoading ? (
                <View style={styles.modelLoading}>
                  <ActivityIndicator size="large" color="#FF6B00" />
                  <Text style={styles.modelLoadingText}>Loading 3D model...</Text>
                </View>
              ) : (
                <PanGestureHandler onGestureEvent={handleGesture}>
                  <Animated.View 
                    style={[
                      styles.modelWrapper,
                      { 
                        transform: [
                          { rotateY: spin },
                          { rotateX: tiltX }
                        ] 
                      }
                    ]}
                  >
                    <Image
                      source={{ 
                        uri: `https://api.a0.dev/assets/image?text=3d model of ${character.name} from dragon ball z in T-pose&seed=${character.id}` 
                      }}
                      style={styles.modelImage}
                      resizeMode="contain"
                    />
                  </Animated.View>
                </PanGestureHandler>
              )}
              <Text style={styles.modelInstructions}>
                Rotate with your finger to view all angles
              </Text>
            </View>
          )}
          
          {/* Character Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>
              {character.description || 'No description available for this character.'}
            </Text>
          </View>
          
          {/* Planet Info */}
          {character.originPlanet && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Origin Planet</Text>
              <TouchableOpacity 
                style={styles.planetCard}
                onPress={() => navigation.navigate('PlanetDetail', { planetId: character.originPlanet.id })}
              >
                <Image
                  source={{ 
                    uri: `https://api.a0.dev/assets/image?text=planet ${character.originPlanet.name} from dragon ball&seed=${character.originPlanet.id}` 
                  }}
                  style={styles.planetImage}
                  resizeMode="cover"
                />
                <View style={styles.planetInfo}>
                  <Text style={styles.planetName}>{character.originPlanet.name}</Text>
                  <Text style={styles.viewPlanetText}>View Details</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#AAA" />
              </TouchableOpacity>
            </View>
          )}
          
          {/* Transformations */}
          {formatTransformations() && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Transformations</Text>
              {formatTransformations()}
            </View>
          )}
          
          {/* Affiliations */}
          {character.affiliation && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Affiliation</Text>
              <View style={styles.affiliationChip}>
                <Text style={styles.affiliationText}>{character.affiliation}</Text>
              </View>
            </View>
          )}
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
    backgroundColor: '#FF6B00',
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
    height: 400,
  },
  characterImage: {
    width: '100%',
    height: 400,
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
  characterNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  characterName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 10,
  },
  deceasedBadge: {
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  deceasedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  characterInfoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  infoText: {
    color: 'white',
    marginLeft: 5,
    fontSize: 14,
  },
  viewModelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B00',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  viewModelButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modelContainer: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    margin: 16,
    padding: 16,
    alignItems: 'center',
    overflow: 'hidden',
    height: 350,
  },
  modelLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modelLoadingText: {
    color: 'white',
    marginTop: 10,
  },
  modelWrapper: {
    width: width - 64,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modelImage: {
    width: '100%',
    height: '100%',
  },
  modelInstructions: {
    color: '#AAA',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  section: {
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  sectionContent: {
    marginTop: 8,
  },
  descriptionText: {
    color: '#DDD',
    fontSize: 16,
    lineHeight: 24,
  },
  planetCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
  },
  planetImage: {
    width: 80,
    height: 80,
  },
  planetInfo: {
    flex: 1,
    padding: 12,
  },
  planetName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  viewPlanetText: {
    fontSize: 14,
    color: '#FF6B00',
  },
  transformationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  transformationBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transformationBadgeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  transformationName: {
    color: 'white',
    fontSize: 16,
  },
  affiliationChip: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  affiliationText: {
    color: 'white',
    fontSize: 16,
  },
});