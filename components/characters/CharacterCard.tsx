import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Character } from '@/interface/character.interface';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface CharacterCardProps {
  character: Character;
  onPress: (characterId: number) => void;
}

export function CharacterCard({ character, onPress }: CharacterCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(character.id)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: `https://api.a0.dev/assets/image?text=${character.name} from dragon ball&seed=${character.id}`,
          }}
          style={styles.image}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.gradient}
        >
          <Text style={styles.name}>{character.name}</Text>
        </LinearGradient>
      </View>

      <View style={styles.infoContainer}>
        {character.originPlanet && (
          <View style={styles.infoRow}>
            <Ionicons name="planet-outline" size={16} color="#FF6B00" />
            <Text style={styles.infoText}>{character.originPlanet.name}</Text>
          </View>
        )}
        <View style={styles.infoRow}>
          <Ionicons name="flash" size={16} color="#FFC107" />
          <Text style={styles.infoText}>
            {character.maxKi?.toLocaleString() || "Unknown"}
          </Text>
        </View>
      </View>

      {character.transformations && character.transformations.length > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {character.transformations.length} forms
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    justifyContent: 'flex-end',
    padding: 12,
  },
  name: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  infoContainer: {
    padding: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    color: '#CCC',
    marginLeft: 8,
    fontSize: 14,
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,107,0,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
}); 