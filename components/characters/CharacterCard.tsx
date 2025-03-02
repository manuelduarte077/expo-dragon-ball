import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Character } from '@/interface/character.interface';

const { width } = Dimensions.get('window');

interface CharacterCardProps {
  character: Character;
  onPress: (characterId: number) => void;
}

export function CharacterCard({ character, onPress }: CharacterCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(character.id)}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: character.image ||
              `https://api.a0.dev/assets/image?text=dragon ball character ${character.name}&seed=${character.id}`,
          }}
          style={styles.image}
          resizeMode="cover"
        />
        {character.isAlive === false && (
          <View style={styles.deceasedBadge}>
            <Text style={styles.deceasedText}>Deceased</Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{character.name}</Text>
        <Text style={styles.race}>{character.race || 'Unknown Race'}</Text>
        <View style={styles.footer}>
          <Text style={styles.planet}>
            {character.originPlanet?.name || 'Unknown Planet'}
          </Text>
          <View style={styles.powerContainer}>
            <MaterialIcons name="bolt" size={16} color="#FFC107" />
            <Text style={styles.powerLevel}>
              {character.ki ? `${character.ki}` : 'Unknown'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 15,
    margin: 8,
    overflow: 'hidden',
    width: (width - 50) / 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: '#333',
  },
  deceasedBadge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomLeftRadius: 10,
  },
  deceasedText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    padding: 12,
  },
  name: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  race: {
    color: '#BBB',
    fontSize: 14,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  planet: {
    color: '#AAA',
    fontSize: 12,
    flex: 1,
  },
  powerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  powerLevel: {
    color: '#FFC107',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 2,
  },
}); 