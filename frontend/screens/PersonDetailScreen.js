import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Button, FlatList } from 'react-native';
import { getPeopleRelationshipsByPersonId } from '../api/people_relationships';

export default function PersonDetailScreen({ person, onEdit, onBack }) {
  const [relationships, setRelationships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getPeopleRelationshipsByPersonId(person.id)
      .then(data => { if (mounted) { setRelationships(data); setLoading(false); } })
      .catch(() => setLoading(false));
    return () => { mounted = false; };
  }, [person.id]);

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
      <Text style={styles.sectionTitle}>Relationships</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : relationships.length === 0 ? (
        <Text>No relationships found.</Text>
      ) : (
        <FlatList
          data={relationships}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.relationshipRow}>
              <Text style={styles.relationshipName}>{item.relationship_name}</Text>
              <Text style={styles.relationshipDesc}>{item.description}</Text>
              <Text style={styles.relationshipDate}>{item.date}</Text>
              <Text style={styles.relationshipCurrent}>{item.current ? 'Current' : 'Past'}</Text>
            </View>
          )}
        />
      )}
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
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 24,
    marginBottom: 8,
  },
  relationshipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  relationshipName: {
    flex: 1,
    fontWeight: 'bold',
  },
  relationshipDesc: {
    flex: 2,
  },
  relationshipDate: {
    flex: 1,
  },
  relationshipCurrent: {
    flex: 1,
    textAlign: 'right',
  },
});
