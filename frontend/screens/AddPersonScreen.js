import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { addPerson } from '../api/addPerson';

export default function AddPersonScreen({ user, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    dob: '',
    time_of_birth: '',
    profile_pic: '',
    address: '',
    email: '',
    phone_number: '',
    date_of_death: '',
    user_id: user.id
  });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

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

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    try {
      const person = await addPerson(form);
      onSave(person);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Person</Text>
      <TextInput style={styles.input} placeholder="Name*" value={form.name} onChangeText={v => handleChange('name', v)} />
      <TextInput style={styles.input} placeholder="DOB (YYYY-MM-DD)" value={form.dob} onChangeText={v => handleChange('dob', v)} />
      <TextInput style={styles.input} placeholder="Time of Birth (HH:MM:SS)" value={form.time_of_birth} onChangeText={v => handleChange('time_of_birth', v)} />
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
          <Text style={{ color: '#007bff' }}>Upload Profile Picture</Text>
        </TouchableOpacity>
      </View>
      <TextInput style={styles.input} placeholder="Address" value={form.address} onChangeText={v => handleChange('address', v)} />
      <TextInput style={styles.input} placeholder="Email" value={form.email} onChangeText={v => handleChange('email', v)} />
      <TextInput style={styles.input} placeholder="Phone Number" value={form.phone_number} onChangeText={v => handleChange('phone_number', v)} />
      <TextInput style={styles.input} placeholder="Date of Death (YYYY-MM-DD)" value={form.date_of_death} onChangeText={v => handleChange('date_of_death', v)} />
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <View style={styles.buttonRow}>
        <Button title="Cancel" onPress={onCancel} disabled={saving} />
        <Button title={saving ? "Saving..." : "Save"} onPress={handleSubmit} disabled={saving} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
});
