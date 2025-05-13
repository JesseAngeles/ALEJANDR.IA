const API_URL = `${import.meta.env.VITE_ENDPOINT}/book`;

export const fetchBooks = async (token: string) => {
  const response = await fetch(API_URL, {
    headers: {
      'Authorization': `Bearer ${token}`, 
    },
  });
  if (!response.ok) throw new Error('Error al obtener los libros');
  return await response.json();
};

export const fetchBookByISBN = async (isbn: string, token: string) => {
  const response = await fetch(`${API_URL}/${isbn}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 
    },
  });
  if (!response.ok) throw new Error('Error al obtener el libro');
  return await response.json();
};

export const createBook = async (bookData: any, token: string) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 
    },
    body: JSON.stringify(bookData),
  });
  if (!response.ok) throw new Error('Error al crear el libro');
  return await response.json();
};

export const updateBook = async (isbn: string, bookData: any, token: string) => {
  const response = await fetch(`${API_URL}/${isbn}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 
    },
    body: JSON.stringify(bookData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Detalles del error del backend:", errorText);
    throw new Error(errorText);
  }

  return await response.json();
};

export const deleteBook = async (isbn: string, token: string) => {
  const response = await fetch(`${API_URL}/${isbn}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`, 
    },
  });
  if (!response.ok) throw new Error('Error al eliminar el libro');
};

