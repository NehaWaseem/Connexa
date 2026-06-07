const API_BASE = 'http://localhost:8080/api';

function jsonHeaders(token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function registerUser(data) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Registration failed');
  return response.json();
}

export async function loginUser(data) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Login failed');
  return response.json();
}

export async function getProfile(token) {
  const response = await fetch(`${API_BASE}/user/profile`, { headers: jsonHeaders(token) });
  if (!response.ok) throw new Error('Unable to load profile');
  return response.json();
}

export async function fetchContacts(token, page = 0, search = '') {
  const url = new URL(`${API_BASE}/contacts`, window.location.origin);
  url.searchParams.set('page', page);
  url.searchParams.set('size', 10);
  if (search) url.searchParams.set('search', search);
  const response = await fetch(url, { headers: jsonHeaders(token) });
  if (!response.ok) throw new Error('Unable to load contacts');
  return response.json();
}

export async function saveContact(token, contact) {
  const method = contact.id ? 'PUT' : 'POST';
  const url = contact.id ? `${API_BASE}/contacts/${contact.id}` : `${API_BASE}/contacts`;
  const response = await fetch(url, {
    method,
    headers: jsonHeaders(token),
    body: JSON.stringify(contact),
  });
  if (!response.ok) throw new Error('Unable to save contact');
  return response.json();
}

export async function deleteContact(token, id) {
  const response = await fetch(`${API_BASE}/contacts/${id}`, {
    method: 'DELETE',
    headers: jsonHeaders(token),
  });
  if (!response.ok) throw new Error('Unable to delete contact');
  return response.ok;
}

export async function changePassword(token, data) {
  const response = await fetch(`${API_BASE}/auth/change-password`, {
    method: 'POST',
    headers: jsonHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Unable to change password');
  return response.json();
}
