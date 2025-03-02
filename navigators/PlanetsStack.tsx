import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PlanetsScreen from "../screens/PlanetsScreen";
import PlanetDetailScreen from "@/screens/PlanetDetailScreen";

const Stack = createNativeStackNavigator();

export default function PlanetsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Planets"
        component={PlanetsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PlanetDetail"
        component={PlanetDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
