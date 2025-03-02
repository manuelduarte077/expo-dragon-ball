import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { toast } from "sonner-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorView } from "@/components/ui/ErrorView";
import { SearchBar } from "@/components/ui/SearchBar";
import { CharacterCard } from "@/components/characters/CharacterCard";
import { FilterModal } from '@/components/characters/FilterModal';
import { useApiStore } from "@/core/store/api.store";

type RootStackParamList = {
  CharacterDetail: { characterId: number };
};

export default function CharactersScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { characters, planets, fetchCharacters, fetchPlanets, isLoading, error } = useApiStore();
  const [filteredCharacters, setFilteredCharacters] = useState(characters);
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
    if (searchQuery) {
      filtered = filtered.filter((character) =>
        character.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
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

  const handleCharacterPress = (characterId: number) => {
    navigation.navigate("CharacterDetail", { characterId });
  };

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
    return <ErrorView message={error} onRetry={fetchCharacters} />;
  }

  return (
    <LinearGradient colors={["#1a1a2e", "#16213e", "#1a1a2e"]} style={styles.container}>
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

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search characters..."
        />

        {selectedPlanet && (
          <View style={styles.activeFilterContainer}>
            <Text style={styles.activeFilterText}>
              Planet: {planets.find((p) => p.id === selectedPlanet)?.name || "Unknown"}
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
            <TouchableOpacity style={styles.clearFilterButton} onPress={clearFilters}>
              <Text style={styles.clearFilterButtonText}>Clear Filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredCharacters}
            renderItem={({ item }) => (
              <CharacterCard character={item} onPress={handleCharacterPress} />
            )}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.characterList}
            showsVerticalScrollIndicator={false}
            onEndReached={loadMoreCharacters}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() =>
              isLoading && characters.length > 0 ? (
                <LoadingSpinner message="Loading more characters..." />
              ) : null
            }
          />
        )}

        <FilterModal
          visible={showFilters}
          onClose={() => setShowFilters(false)}
          onClearFilters={clearFilters}
          selectedPlanet={selectedPlanet}
          onSelectPlanet={setSelectedPlanet}
          planets={planets}
        />
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
});
