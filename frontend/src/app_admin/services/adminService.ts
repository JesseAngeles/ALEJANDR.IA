const API_URL = 'http://localhost:8080/admin';

export const addAdmin = async (adminData: any, token: string) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 
    },
    body: JSON.stringify(adminData),
  });

  if (!response.ok) throw new Error('Error al agregar el administrador');
  return await response.json();
};

export const getUsers = async (token: string) => {
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Detalles del backend:", errorText);
    throw new Error('Error al obtener los usuarios');
  }

  return await response.json();
};
