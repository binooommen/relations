
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { getPersonsByUserId } from '../api/persons';
import EditPersonScreen from './EditPersonScreen';
import PersonDetailScreen from './PersonDetailScreen';
import AddPersonScreen from './AddPersonScreen';

export default function WelcomeScreen({ user, onSettings, onSignOut }) {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [editingPerson, setEditingPerson] = useState(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getPersonsByUserId(user.id)
      .then(data => { if (mounted) { setPersons(data); setLoading(false); } })
      .catch(e => { if (mounted) { setError(e.message); setLoading(false); } });
    return () => { mounted = false; };
  }, [user.id]);

  if (adding) {
    return <AddPersonScreen
      user={user}
      onSave={person => {
        setAdding(false);
        setPersons(ps => [...ps, person]);
        setSelectedPerson(person);
      }}
      onCancel={() => setAdding(false)}
    />;
  }
  if (editingPerson) {
    return <EditPersonScreen
      person={editingPerson}
      onSave={updated => {
        setEditingPerson(null);
        setSelectedPerson(updated);
        setPersons(ps => ps.map(p => p.id === updated.id ? updated : p));
      }}
      onCancel={() => setEditingPerson(null)}
    />;
  }
  if (selectedPerson) {
    return <PersonDetailScreen person={selectedPerson} onBack={() => setSelectedPerson(null)} onEdit={setEditingPerson} />;
  }

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
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30, width: '100%', justifyContent: 'space-between' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Your Persons</Text>
        <Button title="Add Person" onPress={() => setAdding(true)} />
      </View>
      {loading && <Text>Loading...</Text>}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      {!loading && !error && (
        <FlatList
          data={persons}
          keyExtractor={item => item.id.toString()}
          style={{ width: '100%', marginTop: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSelectedPerson(item)}>
              <View style={styles.personRow}>
                <Text style={styles.personName}>{item.name}</Text>
                <Text style={styles.personEmail}>{item.email}</Text>
              </View>
            </TouchableOpacity>
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
