import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { toast } from "sonner-native";
import { dragonBallAPI } from "@/services/api.service";
import { Planet } from "@/interface/planet.interface";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  PlanetsTab: {
    screen: string;
    params: { planetId: number };
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
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { planetId } = route.params as PlanetDetailScreenProps;

  const [planet, setPlanet] = useState<Planet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlanetData = async () => {
    try {
      setLoading(true);
      const planetData = await dragonBallAPI.getPlanetById(planetId);
      setPlanet(planetData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      toast.error("Error loading planet details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanetData();
  }, [planetId]);

  const handleRetry = () => {
    setError(null);
    fetchPlanetData();
  };

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
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
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
              uri: `https://api.a0.dev/assets/image?text=planet ${planet?.name} from dragon ball landscape view from space&seed=${planet?.id}`,
            }}
            style={styles.planetImage}
            resizeMode="cover"
          />

          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
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
                {planet?.description || "No description available for this planet."}
              </Text>
            </View>
          </View>
        </View>

        {/* Additional Information */}
        <View style={styles.orbSection}>
          <Text style={styles.orbSectionTitle}>Planet Animation</Text>
          <View style={styles.orbContainer}>
            <Image
              source={{
                uri: `https://api.a0.dev/assets/image?text=animated rotating planet ${planet?.name} from dragon ball&seed=${planet?.id || 1}`,
              }}
              style={styles.orbImage}
              resizeMode="contain"
            />
          </View>
        </View>
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
    backgroundColor: "#1a1a2e",
  },
  scrollView: {
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
  heroSection: {
    width: "100%",
    height: 600,
    position: "relative",
  },
  planetImage: {
    width: "100%",
    height: 600,
    position: "absolute",
  },
  heroGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    justifyContent: "flex-end",
    padding: 16,
  },
  planetNameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  planetName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginRight: 10,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 10,
  },
  destroyedBadge: {
    backgroundColor: "rgba(255, 0, 0, 0.8)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  destroyedText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  infoContainer: {
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    margin: 16,
    borderRadius: 16,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  infoTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    color: "#AAA",
    fontSize: 14,
    marginBottom: 4,
  },
  infoValue: {
    color: "white",
    fontSize: 16,
    lineHeight: 24,
  },
  orbSection: {
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
    backgroundColor: "rgba(0,0,0,0.5)",
    margin: 16,
    borderRadius: 16,
  },
  orbSectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
    textAlign: "center",
  },
  orbContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 250,
  },
  orbImage: {
    width: "100%",
    height: "100%",
  },
  floatingBackButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backButtonContainer: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
  },
});
