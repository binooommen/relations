// Update a person by id
export async function updatePerson(id, data) {
  const res = await fetch(`http://localhost:3001/persons/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update person');
  return await res.json();
}
