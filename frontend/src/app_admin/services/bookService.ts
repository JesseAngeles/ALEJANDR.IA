const API_URL = 'http://localhost:8080/books';

export const fetchBooks = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Error al obtener libros');
  return await response.json();
};

export const fetchBookByISBN = async (isbn: string) => {
  const response = await fetch(`${API_URL}/${isbn}`);
  if (!response.ok) throw new Error('Error al obtener el libro');
  return await response.json();
};

export const createBook = async (bookData: any) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData),
  });
  if (!response.ok) throw new Error('Error al crear el libro');
  return await response.json();
};

export const updateBook = async (isbn: string, bookData: any) => {
  const response = await fetch(`${API_URL}/${isbn}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData),
  });
  if (!response.ok) throw new Error('Error al actualizar el libro');
  return await response.json();
};

export const deleteBook = async (isbn: string) => {
  const response = await fetch(`${API_URL}/${isbn}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Error al eliminar el libro');
};
