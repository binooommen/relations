import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  Switch,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getPeopleRelationshipsByPersonId, addPeopleRelationship } from '../api/people_relationships';
import { getRelationships } from '../api/relationships';
import { getPersonsByUserId } from '../api/persons';

export default function EditPersonScreen({ person, user, onSave, onCancel }) {
  if (!person || !user) return <Text>Loading...</Text>;

  const [editPerson, setEditPerson] = useState(person);
  const [relationships, setRelationships] = useState([]);
  const [allRelationships, setAllRelationships] = useState([]);
  const [allPersons, setAllPersons] = useState([]);
  const [newRel, setNewRel] = useState({ people_id: '', relationship_id: '', date: '', description: '', current: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEditPerson(person);
    getPeopleRelationshipsByPersonId(person.id).then(setRelationships);
    getRelationships().then(setAllRelationships);
    getPersonsByUserId(user.id).then(persons => {
      setAllPersons(persons.filter(p => p.id !== person.id));
    });
    setNewRel({ people_id: '', relationship_id: '', date: '', description: '', current: true });
  }, [person.id, user.id]);

  const handleAddRelationship = async () => {
    if (!newRel.relationship_id || !newRel.people_id) return;
    setSaving(true);
    try {
      const rel = await addPeopleRelationship({
        people_id: newRel.people_id,
        relationship_id: newRel.relationship_id,
        date: newRel.date,
        description: newRel.description,
        current: newRel.current,
      });
      setRelationships(rs => [...rs, rel]);
      setNewRel({ people_id: '', relationship_id: '', date: '', description: '', current: true });
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.outer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
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
          {relationships.length === 0 ? (
            <Text style={styles.empty}>No relationships</Text>
          ) : (
            <View style={styles.relationshipList}>
              {relationships.map(item => (
                <View key={item.id} style={styles.relationshipRow}>
                  <Text style={styles.relationshipName}>{item.relationship_name}</Text>
                  {item.description ? <Text style={styles.relationshipMeta}>{item.description}</Text> : null}
                  {item.date ? <Text style={styles.relationshipMeta}>{item.date}</Text> : null}
                  <Text style={styles.relationshipMeta}>{item.current ? 'Current' : 'Past'}</Text>
                </View>
              ))}
            </View>
          )}

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
            <Text style={styles.switchLabel}>Current</Text>
            <Switch
              value={newRel.current}
              onValueChange={v => setNewRel(r => ({ ...r, current: v }))}
            />
          </View>
          <Button
            title="Add Relationship"
            onPress={handleAddRelationship}
            disabled={saving || !newRel.relationship_id || !newRel.people_id}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  outer: { flex: 1, backgroundColor: '#f2f4f6' },
  scroll: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 4
  },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#d0d5dc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fafafa'
  },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 4, marginBottom: 8 },
  sectionTitle: { fontWeight: '600', fontSize: 18, marginTop: 26, marginBottom: 10 },
  empty: { fontStyle: 'italic', color: '#666', marginBottom: 8 },
  relationshipList: { marginBottom: 4 },
  relationshipRow: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  relationshipName: { fontWeight: '600', marginBottom: 2 },
  relationshipMeta: { color: '#555', marginBottom: 2 },
  picker: {
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#d0d5dc',
    marginBottom: 12
  },
  switchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 12 },
  switchLabel: { fontSize: 16 }
});
