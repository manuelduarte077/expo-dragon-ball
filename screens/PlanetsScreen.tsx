import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useStore } from "../core/store/store";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const { width } = Dimensions.get("window");

type RootStackParamList = {
  PlanetsTab: {
    screen: string;
    params: { planetId: number };
  };
};

interface Planet {
  id: number;
  name: string;
  isDestroyed: boolean;
  description: string;
  image: string;
}

export default function PlanetsScreen() {
  const { planets, fetchPlanets, isLoading, error } = useStore();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    fetchPlanets();
  }, []);

  const renderPlanetCard = ({ item }: { item: Planet }) => (
    <TouchableOpacity
      style={styles.planetCard}
      onPress={() =>
        navigation.navigate("PlanetsTab", {
          screen: "PlanetDetail",
          params: { planetId: item.id },
        })
      }
    >
      <Image
        source={{
          uri: `https://api.a0.dev/assets/image?text=planet ${item.name} from dragon ball&seed=${item.id}`,
        }}
        style={styles.planetImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.9)"]}
        style={styles.planetGradient}
      >
        <Text style={styles.planetName}>{item.name}</Text>
        {item.isDestroyed && (
          <View style={styles.destroyedBadge}>
            <Text style={styles.destroyedText}>Destroyed</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3367FF" />
        <Text style={styles.loadingText}>Loading planets...</Text>
      </View>
    );
  }

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
          <Text style={styles.headerTitle}>Planets</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <View style={styles.infoCard}>
            <Ionicons
              name="planet"
              size={24}
              color="#3367FF"
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>
              Explore the diverse planets from the Dragon Ball universe
            </Text>
          </View>

          <FlatList
            data={planets}
            renderItem={renderPlanetCard}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.planetsList}
            showsVerticalScrollIndicator={false}
          />
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
    backgroundColor: "#3367FF",
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 8,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(51, 103, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    margin: 8,
    marginBottom: 16,
  },
  infoIcon: {
    marginRight: 16,
  },
  infoText: {
    color: "white",
    fontSize: 15,
    flex: 1,
  },
  planetsList: {
    paddingBottom: 16,
  },
  planetCard: {
    margin: 8,
    width: (width - 48) / 2,
    height: 180,
    borderRadius: 15,
    overflow: "hidden",
    position: "relative",
  },
  planetImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#333",
  },
  planetGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    justifyContent: "flex-end",
    padding: 12,
  },
  planetName: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  destroyedBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 0, 0, 0.8)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  destroyedText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});
