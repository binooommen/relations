import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TextInput, Picker, Switch, StyleSheet, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { updatePerson } from '../api/updatePerson';
import { getPeopleRelationshipsByPersonId, addPeopleRelationship } from '../api/people_relationships';
import { getRelationships } from '../api/relationships';

export default function EditPersonScreen({ person, onSave, onCancel }) {
  const [form, setForm] = useState({ ...person });
  const [saving, setSaving] = useState(false);
  const [relationships, setRelationships] = useState([]);
  const [allRelationships, setAllRelationships] = useState([]);
  const [newRel, setNewRel] = useState({ relationship_id: '', date: '', description: '', current: true });

  useEffect(() => {
    getPeopleRelationshipsByPersonId(person.id).then(setRelationships);
    getRelationships().then(setAllRelationships);
  }, [person.id]);

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });
    if (!result.canceled && result.assets && result.assets[0].base64) {
      setForm(f => ({ ...f, profile_pic: result.assets[0].base64 }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePerson(person.id, form);
      onSave({ ...form });
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddRelationship = async () => {
    if (!newRel.relationship_id) return;
    setSaving(true);
    const rel = await addPeopleRelationship({
      people_id: person.id,
      ...newRel,
    });
    setRelationships(rs => [...rs, rel]);
    setNewRel({ relationship_id: '', date: '', description: '', current: true });
    setSaving(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Person</Text>
      <TextInput style={styles.input} value={form.name} onChangeText={v => handleChange('name', v)} placeholder="Name" />
      <TextInput style={styles.input} value={form.email} onChangeText={v => handleChange('email', v)} placeholder="Email" />
      <TextInput style={styles.input} value={form.phone_number} onChangeText={v => handleChange('phone_number', v)} placeholder="Phone Number" />
      <TextInput style={styles.input} value={form.dob} onChangeText={v => handleChange('dob', v)} placeholder="DOB (YYYY-MM-DD)" />
      <TextInput style={styles.input} value={form.time_of_birth} onChangeText={v => handleChange('time_of_birth', v)} placeholder="Time of Birth (HH:MM:SS)" />
      <TextInput style={styles.input} value={form.address} onChangeText={v => handleChange('address', v)} placeholder="Address" />
      <TextInput style={styles.input} value={form.date_of_death} onChangeText={v => handleChange('date_of_death', v)} placeholder="Date of Death (YYYY-MM-DD)" />
      <View style={{ width: '100%', alignItems: 'center', marginBottom: 12 }}>
        {form.profile_pic ? (
          <Image
            source={{ uri: `data:image/png;base64,${form.profile_pic}` }}
            style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 8 }}
          />
        ) : (
          <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#eee', marginBottom: 8 }} />
        )}
        <TouchableOpacity onPress={pickImage} style={{ marginBottom: 8 }}>
          <Text style={{ color: '#007bff' }}>Change Profile Picture</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonRow}>
        <Button title="Cancel" onPress={onCancel} color="#888" disabled={saving} />
        <Button title={saving ? 'Saving...' : 'Save'} onPress={handleSave} disabled={saving} />
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
      <Button title="Add Relationship" onPress={handleAddRelationship} disabled={saving || !newRel.relationship_id} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
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
