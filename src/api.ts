// src/api.ts
// Utility functions for communicating with the Flask backend

const BASE_URL = 'http://localhost:5000';

export async function fetchOutbreakData() {
  const res = await fetch(`${BASE_URL}/data`);
  return res.json();
}

export async function predictCholera(features: number[]) {
  const res = await fetch(`${BASE_URL}/predict/cholera`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ features }),
  });
  return res.json();
}

export async function predictMalaria(features: number[]) {
  const res = await fetch(`${BASE_URL}/predict/malaria`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ features }),
  });
  return res.json();
}
