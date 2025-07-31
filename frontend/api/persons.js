// Fetch persons linked to a user by user_id
export async function getPersonsByUserId(userId) {
  const res = await fetch(`http://localhost:3001/persons?user_id=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch persons');
  const data = await res.json();
  return data.people;
}
