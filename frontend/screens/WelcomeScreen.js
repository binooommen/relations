import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';

export default function WelcomeScreen({ user, onSettings, onSignOut }) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo.jpg')}
        style={styles.logo}
        resizeMode="contain"
        accessibilityLabel="App Logo"
      />
      <Text style={styles.title}>Welcome, {user.name}!</Text>
      <Button title="Settings" onPress={onSettings} />
      <Button title="Sign Out" onPress={onSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
});
