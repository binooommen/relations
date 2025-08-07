export async function getRelationships() {
  const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001'}/relationships`);
  const data = await res.json();
  return data.relationships || [];
}