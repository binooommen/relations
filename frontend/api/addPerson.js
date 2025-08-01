// API to add a new person
export async function addPerson(person) {
  const res = await fetch('http://localhost:3001/persons', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(person)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to add person');
  }
  const data = await res.json();
  return data.person;
}
