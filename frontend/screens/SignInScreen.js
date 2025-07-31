import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image } from 'react-native';
import { signIn } from '../api/auth';

export default function SignInScreen({ onSignIn, onSwitch }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    const data = await signIn(username, password);
    if (data.success && data.user) {
      onSignIn(data.user);
    } else {
      Alert.alert('Error', data.error || 'Failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>Relations</Text>
      <Image
        source={require('../assets/images/logo.jpg')}
        style={styles.logo}
        resizeMode="contain"
        accessibilityLabel="App Logo"
      />
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign In" onPress={handleSignIn} />
      <Text style={styles.toggle} onPress={onSwitch}>
        No account? Sign Up
      </Text>
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
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#222',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  toggle: {
    color: 'blue',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});

