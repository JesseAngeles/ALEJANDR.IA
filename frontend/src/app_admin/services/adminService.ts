
const API_URL = 'http://localhost:8080/admin';

const TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MGViNTQ2NjYzYzJjMTJmMWQyZTczMSIsImVtYWlsIjoiYWxlamFuZHJpYS5jb250YWN0YW5vc0BnbWFpbC5jb20iLCJuYW1lIjoiQWxlamFuZHJJQSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0NjIzNTQxNCwiZXhwIjoxNzQ2MjM5MDE0fQ.xZLGT8uUWohASe5_6PgBXzRudBQ-6CVPYwt5SFvPX_I';


export const USER = {
  id: "608eb546663c2c12f1d2e731",
  email: "alejandria.contactanos@gmail.com",
  name: "AlejandrIA",
  role: "admin"
};

export const addAdmin = async (adminData: any) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': TOKEN,
    },
    body: JSON.stringify(adminData),
  });

  if (!response.ok) throw new Error('Error al agregar el administrador');
  return await response.json();
};

export const getUsers = async () => {
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': TOKEN,
    } 
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Detalles del backend:", errorText);
    throw new Error('Error al obtener los usuarios');
  }

  return await response.json();
};