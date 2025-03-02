import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CharactersScreen from '../screens/CharactersScreen';
import CharacterDetailScreen from '../screens/CharacterDetailScreen';

const Stack = createNativeStackNavigator();

export default function CharactersStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Characters" component={CharactersScreen} />
      <Stack.Screen name="CharacterDetail" component={CharacterDetailScreen} />
    </Stack.Navigator>
  );
}