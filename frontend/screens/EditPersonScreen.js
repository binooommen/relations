import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TextInput, Switch, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getPeopleRelationshipsByPersonId, addPeopleRelationship } from '../api/people_relationships';
import { getRelationships } from '../api/relationships';
import { getPersonsByUserId } from '../api/persons';

export default function EditPersonScreen({ person, user, onSave, onCancel }) {
  if (!person || !user) {
    return <Text>Loading...</Text>;
  }

  // Use local state for editing person fields
  const [editPerson, setEditPerson] = useState(person);
  const [relationships, setRelationships] = useState([]);
  const [allRelationships, setAllRelationships] = useState([]);
  const [allPersons, setAllPersons] = useState([]);
  const [newRel, setNewRel] = useState({ people_id: '', relationship_id: '', date: '', description: '', current: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEditPerson(person); // Reset local state when person changes
    getPeopleRelationshipsByPersonId(person.id).then(setRelationships);
    getRelationships().then(setAllRelationships);
    getPersonsByUserId(user.id).then(persons => {
      setAllPersons(persons.filter(p => p.id !== person.id));
    });
    setNewRel(r => ({ ...r, people_id: '' }));
  }, [person.id, user.id]);

  const handleAddRelationship = async () => {
    if (!newRel.relationship_id || !newRel.people_id) return;
    setSaving(true);
    const rel = await addPeopleRelationship({
      people_id: newRel.people_id,
      relationship_id: newRel.relationship_id,
      date: newRel.date,
      description: newRel.description,
      current: newRel.current,
    });
    setRelationships(rs => [...rs, rel]);
    setNewRel({ people_id: '', relationship_id: '', date: '', description: '', current: true });
    setSaving(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Person</Text>
      <TextInput
        style={styles.input}
        value={editPerson.name ?? ''}
        onChangeText={v => setEditPerson(p => ({ ...p, name: v }))}
        placeholder="Name"
      />
      <TextInput
        style={styles.input}
        value={editPerson.email ?? ''}
        onChangeText={v => setEditPerson(p => ({ ...p, email: v }))}
        placeholder="Email"
      />
      <TextInput
        style={styles.input}
        value={editPerson.phone_number ?? ''}
        onChangeText={v => setEditPerson(p => ({ ...p, phone_number: v }))}
        placeholder="Phone Number"
      />
      <TextInput
        style={styles.input}
        value={editPerson.dob ?? ''}
        onChangeText={v => setEditPerson(p => ({ ...p, dob: v }))}
        placeholder="DOB (YYYY-MM-DD)"
      />
      <TextInput
        style={styles.input}
        value={editPerson.time_of_birth ?? ''}
        onChangeText={v => setEditPerson(p => ({ ...p, time_of_birth: v }))}
        placeholder="Time of Birth (HH:MM:SS)"
      />
      <TextInput
        style={styles.input}
        value={editPerson.address ?? ''}
        onChangeText={v => setEditPerson(p => ({ ...p, address: v }))}
        placeholder="Address"
      />
      <TextInput
        style={styles.input}
        value={editPerson.date_of_death ?? ''}
        onChangeText={v => setEditPerson(p => ({ ...p, date_of_death: v }))}
        placeholder="Date of Death (YYYY-MM-DD)"
      />
      <View style={styles.buttonRow}>
        <Button title="Cancel" onPress={onCancel} color="#888" disabled={saving} />
        <Button title={saving ? 'Saving...' : 'Save'} onPress={() => onSave(editPerson)} disabled={saving} />
      </View>
      <Text style={styles.sectionTitle}>Relationships</Text>
      <FlatList
        data={relationships}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.relationshipRow}>
            <Text style={styles.relationshipName}>{item.relationship_name}</Text>
            <Text>{item.description}</Text>
            <Text>{item.date}</Text>
            <Text>{item.current ? 'Current' : 'Past'}</Text>
          </View>
        )}
      />
      <Text style={styles.sectionTitle}>Add Relationship</Text>
      <Picker
        selectedValue={newRel.people_id}
        onValueChange={v => setNewRel(r => ({ ...r, people_id: v }))}
        style={styles.picker}
      >
        <Picker.Item label="Select Person" value="" />
        {allPersons.map(p => (
          <Picker.Item key={p.id} label={p.name} value={p.id} />
        ))}
      </Picker>
      <Picker
        selectedValue={newRel.relationship_id}
        onValueChange={v => setNewRel(r => ({ ...r, relationship_id: v }))}
        style={styles.picker}
      >
        <Picker.Item label="Select Relationship" value="" />
        {allRelationships.map(r => (
          <Picker.Item key={r.id} label={r.name} value={r.id} />
        ))}
      </Picker>
      <TextInput
        placeholder="Date (YYYY-MM-DD)"
        value={newRel.date}
        onChangeText={v => setNewRel(r => ({ ...r, date: v }))}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={newRel.description}
        onChangeText={v => setNewRel(r => ({ ...r, description: v }))}
        style={styles.input}
      />
      <View style={styles.switchRow}>
        <Text>Current</Text>
        <Switch
          value={newRel.current}
          onValueChange={v => setNewRel(r => ({ ...r, current: v }))}
        />
      </View>
      <Button title="Add Relationship" onPress={handleAddRelationship} disabled={saving || !newRel.relationship_id || !newRel.people_id} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  sectionTitle: { fontWeight: 'bold', fontSize: 18, marginTop: 24, marginBottom: 8 },
  relationshipRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  relationshipName: { fontWeight: 'bold', flex: 1 },
  picker: { marginVertical: 8 },
  switchRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
});
