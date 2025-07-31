export async function signIn(username, password) {
  const res = await fetch('http://localhost:3001/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function signUp(name, username, email, password) {
  const res = await fetch('http://localhost:3001/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, username, email, password }),
  });
  return res.json();
}

export async function updateName(id, name) {
  const res = await fetch('http://localhost:3001/update-name', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, name }),
  });
  return res.json();
}
