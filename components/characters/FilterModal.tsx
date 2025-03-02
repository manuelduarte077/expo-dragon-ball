import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Planet } from '@/interface/planet.interface';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onClearFilters: () => void;
  selectedPlanet: number | null;
  onSelectPlanet: (planetId: number | null) => void;
  planets: Planet[];
}

export function FilterModal({
  visible,
  onClose,
  onClearFilters,
  selectedPlanet,
  onSelectPlanet,
  planets,
}: FilterModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Filter Characters</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <Text style={styles.filterLabel}>Filter by Planet:</Text>
          <ScrollView style={styles.planetsList}>
            <TouchableOpacity
              style={[
                styles.planetItem,
                selectedPlanet === null && styles.selectedPlanetItem,
              ]}
              onPress={() => onSelectPlanet(null)}
            >
              <Text style={styles.planetName}>All Planets</Text>
            </TouchableOpacity>

            {planets.map((planet) => (
              <TouchableOpacity
                key={planet.id}
                style={[
                  styles.planetItem,
                  selectedPlanet === planet.id && styles.selectedPlanetItem,
                ]}
                onPress={() => onSelectPlanet(planet.id)}
              >
                <Text style={styles.planetName}>{planet.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.clearButton} onPress={onClearFilters}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.applyButton} onPress={onClose}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  planetsList: {
    maxHeight: 300,
  },
  planetItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedPlanetItem: {
    backgroundColor: 'rgba(255,107,0,0.1)',
  },
  planetName: {
    fontSize: 16,
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  clearButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  applyButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FF6B00',
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 