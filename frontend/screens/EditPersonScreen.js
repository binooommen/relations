import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { updatePerson } from '../api/updatePerson';

export default function EditPersonScreen({ person, onSave, onCancel }) {
  const [form, setForm] = useState({ ...person });
  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
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
      {/* Profile pic editing can be added here if needed */}
      <View style={styles.buttonRow}>
        <Button title="Cancel" onPress={onCancel} color="#888" disabled={saving} />
        <Button title={saving ? 'Saving...' : 'Save'} onPress={handleSave} disabled={saving} />
      </View>
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
});
