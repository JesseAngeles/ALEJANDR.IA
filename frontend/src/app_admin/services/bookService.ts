const API_URL = 'http://localhost:8080/book';
const TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MGViNTQ2NjYzYzJjMTJmMWQyZTczMSIsImVtYWlsIjoiYWxlamFuZHJpYS5jb250YWN0YW5vc0BnbWFpbC5jb20iLCJuYW1lIjoiQWxlamFuZHJJQSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0NjIzNTQxNCwiZXhwIjoxNzQ2MjM5MDE0fQ.xZLGT8uUWohASe5_6PgBXzRudBQ-6CVPYwt5SFvPX_I';

export const fetchBooks = async () => {
  const response = await fetch(API_URL, {
    headers: {
      'Authorization': TOKEN,
    },
  });
  if (!response.ok) throw new Error('Error al obtener los libros');
  return await response.json();
};

export const fetchBookByISBN = async (isbn: string) => {
  const response = await fetch(`${API_URL}/${isbn}`, {
    headers: {
      'Authorization': TOKEN,
    },
  });
  if (!response.ok) throw new Error('Error al obtener el libro');
  return await response.json();
};

export const createBook = async (bookData: any) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': TOKEN,
    },
    body: JSON.stringify(bookData),
  });
  if (!response.ok) throw new Error('Error al crear el libro');
  return await response.json();
};

export const updateBook = async (isbn: string, bookData: any) => {
  const response = await fetch(`${API_URL}/${isbn}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': TOKEN,
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

export const deleteBook = async (isbn: string) => {
  const response = await fetch(`${API_URL}/${isbn}`, {
    method: 'DELETE',
    headers: {
      'Authorization': TOKEN,
    },
  });
  if (!response.ok) throw new Error('Error al eliminar el libro');
};

