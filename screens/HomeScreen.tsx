import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <ImageBackground 
      source={{ uri: 'https://api.a0.dev/assets/image?text=dragon%20ball%20z%20background%20with%20dragon%20balls%20scattered&aspect=9:16' }}
      style={styles.container}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.title}>Dragon Ball</Text>
            <Text style={styles.subtitle}>Universe Explorer</Text>
          </View>
          
          <View style={styles.menuContainer}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate('Characters')}
            >
              <LinearGradient
                colors={['#ff7e00', '#ff5003']}
                style={styles.menuItemGradient}
              >
                <MaterialCommunityIcons name="account-group" size={40} color="white" />
                <Text style={styles.menuText}>Characters</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate('Planets')}
            >
              <LinearGradient
                colors={['#3d67ff', '#2c4dbf']}
                style={styles.menuItemGradient}
              >
                <FontAwesome5 name="planet" size={40} color="white" />
                <Text style={styles.menuText}>Planets</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Powered by Dragon Ball API</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  subtitle: {
    fontSize: 24,
    color: '#FFA500',
    marginTop: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  menuItem: {
    width: '48%',
    height: 180,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  menuItemGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  menuText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  footerText: {
    color: 'rgba(255,255,255,0.7)',
  }
});