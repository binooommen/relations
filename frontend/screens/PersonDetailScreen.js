import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Button } from 'react-native';

export default function PersonDetailScreen({ person, onBack, onEdit }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{person.name}</Text>
      {person.profile_pic && (
        <Image
          source={{ uri: `data:image/png;base64,${person.profile_pic}` }}
          style={styles.profilePic}
        />
      )}
      <Text style={styles.label}>Email: <Text style={styles.value}>{person.email}</Text></Text>
      <Text style={styles.label}>Phone: <Text style={styles.value}>{person.phone_number}</Text></Text>
      <Text style={styles.label}>DOB: <Text style={styles.value}>{person.dob}</Text></Text>
      <Text style={styles.label}>Time of Birth: <Text style={styles.value}>{person.time_of_birth}</Text></Text>
      <Text style={styles.label}>Address: <Text style={styles.value}>{person.address}</Text></Text>
      <Text style={styles.label}>Date of Death: <Text style={styles.value}>{person.date_of_death || '-'}</Text></Text>
      <View style={styles.buttonRow}>
        <Button title="Back" onPress={onBack} />
        <Button title="Edit" onPress={() => onEdit(person)} />
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
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
  value: {
    fontWeight: 'normal',
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 30,
  },
});
