
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, FlatList } from 'react-native';
import { getPersonsByUserId } from '../api/persons';

export default function WelcomeScreen({ user, onSettings, onSignOut }) {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getPersonsByUserId(user.id)
      .then(data => { if (mounted) { setPersons(data); setLoading(false); } })
      .catch(e => { if (mounted) { setError(e.message); setLoading(false); } });
    return () => { mounted = false; };
  }, [user.id]);

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
      <Text style={{ fontWeight: 'bold', marginTop: 30, fontSize: 18 }}>Your Persons</Text>
      {loading && <Text>Loading...</Text>}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      {!loading && !error && (
        <FlatList
          data={persons}
          keyExtractor={item => item.id.toString()}
          style={{ width: '100%', marginTop: 10 }}
          renderItem={({ item }) => (
            <View style={styles.personRow}>
              <Text style={styles.personName}>{item.name}</Text>
              <Text style={styles.personEmail}>{item.email}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={{ color: '#888' }}>No persons linked to your account.</Text>}
        />
      )}
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
  personRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
    width: '100%',
    paddingHorizontal: 8,
  },
  personName: {
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
  },
  personEmail: {
    color: '#666',
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
  },
});
