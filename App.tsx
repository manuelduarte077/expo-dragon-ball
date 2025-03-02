import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toaster } from 'sonner-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CharactersStack from './navigators/CharactersStack';
import PlanetsStack from './navigators/PlanetsStack';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider style={styles.container}>
        <Toaster />
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarActiveTintColor: '#FF6B00',
              tabBarInactiveTintColor: 'gray',
              tabBarIcon: ({ color, size }) => {
                if (route.name === 'CharactersTab') {
                  return <Ionicons name="people-outline" size={size} color={color} />;
                } else if (route.name === 'PlanetsTab') {
                  return <FontAwesome5 name="globe" size={size} color={color} />;
                }
              },
            })}
          >
            <Tab.Screen
              name="CharactersTab"
              component={CharactersStack}
              options={{ title: 'Characters' }}
            />
            <Tab.Screen
              name="PlanetsTab"
              component={PlanetsStack}
              options={{ title: 'Planets' }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});