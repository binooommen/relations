export async function getPeopleRelationshipsByPersonId(personId) {
  const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001'}/people_relationships/person/${personId}`);
  const data = await res.json();
  return data.people_relationships || [];
}

export async function addPeopleRelationship(rel) {
  const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001'}/people_relationships`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rel),
  });
  const data = await res.json();
  return data.people_relationship;
}