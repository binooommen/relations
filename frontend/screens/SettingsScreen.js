import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { updateName } from '../api/auth';

export default function SettingsScreen({ user, onSave, onCancel }) {
  const [editName, setEditName] = useState(user.name);

  const handleSave = async () => {
    const data = await updateName(user.id, editName);
    if (data.success) {
      onSave(editName);
      Alert.alert('Success', 'Name updated!');
    } else {
      Alert.alert('Error', data.error || 'Failed to update name');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={editName}
        onChangeText={setEditName}
      />
      <Button title="Save" onPress={handleSave} />
      <Button title="Cancel" onPress={onCancel} />
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
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
