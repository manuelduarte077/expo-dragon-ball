import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { toast } from "sonner-native";
import { useStore } from "../core/store/store";
import { Character } from "@/interface/character.interface";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const { width } = Dimensions.get("window");

type RootStackParamList = {
  CharacterDetail: { characterId: number };
};

export default function CharactersScreen() {
  const {
    characters,
    planets,
    fetchCharacters,
    fetchPlanets,
    isLoading,
    error,
  } = useStore();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState<number | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([fetchCharacters(), fetchPlanets()]);
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (characters) {
      applyFilters();
    }
  }, [searchQuery, selectedPlanet, characters]);

  const applyFilters = () => {
    let filtered = [...characters];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((character) =>
        character.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply planet filter
    if (selectedPlanet) {
      filtered = filtered.filter(
        (character) => character.originPlanet?.id === selectedPlanet
      );
    }

    setFilteredCharacters(filtered);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedPlanet(null);
    setFilteredCharacters(characters);
    setShowFilters(false);
  };

  const renderCharacterCard = ({ item }: { item: Character }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("CharacterDetail", { characterId: item.id })
      }
    >
      <View style={styles.cardImageContainer}>
        <Image
          source={{
            uri:
              item.image ||
              `https://api.a0.dev/assets/image?text=dragon ball character ${item.name}&seed=${item.id}`,
          }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        {item.isAlive === false && (
          <View style={styles.deceasedBadge}>
            <Text style={styles.deceasedText}>Deceased</Text>
          </View>
        )}
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardRace}>{item.race || "Unknown Race"}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardPlanet}>
            {item.originPlanet?.name || "Unknown Planet"}
          </Text>
          <View style={styles.powerContainer}>
            <MaterialIcons name="bolt" size={16} color="#FFC107" />
            <Text style={styles.powerLevel}>
              {item.ki ? `${item.ki}` : "Unknown"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFilterModal = () => (
    <Modal
      visible={showFilters}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowFilters(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Characters</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
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
              onPress={() => setSelectedPlanet(null)}
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
                onPress={() => setSelectedPlanet(planet.id)}
              >
                <Text style={styles.planetName}>{planet.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const loadMoreCharacters = async () => {
    if (isLoading || filteredCharacters.length === characters.length) return;

    try {
      await fetchCharacters();
      applyFilters();
    } catch (error) {
      toast.error("Error loading more characters");
    }
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#1a1a2e", "#16213e", "#1a1a2e"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Characters</Text>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <Ionicons name="filter" size={22} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search characters..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          ) : null}
        </View>

        {selectedPlanet && (
          <View style={styles.activeFilterContainer}>
            <Text style={styles.activeFilterText}>
              Planet:{" "}
              {planets.find((p) => p.id === selectedPlanet)?.name || "Unknown"}
            </Text>
            <TouchableOpacity onPress={() => setSelectedPlanet(null)}>
              <Ionicons name="close-circle" size={16} color="white" />
            </TouchableOpacity>
          </View>
        )}

        {filteredCharacters.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={60} color="#666" />
            <Text style={styles.emptyText}>No characters found</Text>
            <TouchableOpacity
              style={styles.clearFilterButton}
              onPress={clearFilters}
            >
              <Text style={styles.clearFilterButtonText}>Clear Filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredCharacters}
            renderItem={renderCharacterCard}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.characterList}
            showsVerticalScrollIndicator={false}
            onEndReached={loadMoreCharacters}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() =>
              isLoading && characters.length > 0 ? (
                <ActivityIndicator color="#FF6B00" style={{ padding: 20 }} />
              ) : null
            }
          />
        )}

        {renderFilterModal()}
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
  },
  loadingText: {
    color: "white",
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    padding: 20,
  },
  errorText: {
    color: "white",
    marginBottom: 20,
    fontSize: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#FF6B00",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  filterButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 25,
    margin: 16,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    color: "white",
    fontSize: 16,
  },
  activeFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,107,0,0.7)",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  activeFilterText: {
    color: "white",
    marginRight: 8,
    fontSize: 14,
  },
  characterList: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 15,
    margin: 8,
    overflow: "hidden",
    width: (width - 50) / 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardImageContainer: {
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: 150,
    backgroundColor: "#333",
  },
  deceasedBadge: {
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "rgba(255, 0, 0, 0.8)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomLeftRadius: 10,
  },
  deceasedText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  cardContent: {
    padding: 12,
  },
  cardName: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cardRace: {
    color: "#BBB",
    fontSize: 14,
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  cardPlanet: {
    color: "#AAA",
    fontSize: 12,
    flex: 1,
  },
  powerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  powerLevel: {
    color: "#FFC107",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  planetsList: {
    maxHeight: 300,
  },
  planetItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedPlanetItem: {
    backgroundColor: "rgba(255,107,0,0.1)",
  },
  planetName: {
    fontSize: 16,
    color: "#333",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  clearButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  clearButtonText: {
    color: "#666",
    fontWeight: "bold",
  },
  applyButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#FF6B00",
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  applyButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "#AAA",
    fontSize: 18,
    marginTop: 10,
    marginBottom: 20,
  },
  clearFilterButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  clearFilterButtonText: {
    color: "#FF6B00",
    fontWeight: "bold",
  },
});
