import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchBookByISBN, updateBook } from "app_admin/services/bookService";
import { FaArrowLeft } from "react-icons/fa";

const EditBook: React.FC = () => {
  const { id } = useParams(); // id es el ISBN
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    publisher: "",
    year: "",
    size: "",
    pages: "",
    binding: "",
  });

  useEffect(() => {
    if (!id) return;

    fetchBookByISBN(id)
      .then((book) => {
        setForm({
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          category: book.category || "",
          publisher: book.publisher || "",
          year: book.year || "",
          size: book.size || "",
          pages: book.pages || "",
          binding: book.binding || "",
        });
      })
      .catch((error) => {
        console.error("Error al obtener el libro:", error);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateBook(form.isbn, form);
      alert("Libro actualizado exitosamente");
      navigate("/admin/libros");
    } catch (error) {
      console.error("Error al actualizar el libro:", error);
      alert("Hubo un error al actualizar el libro.");
    }
  };

  if (loading) {
    return <div className="text-center py-10">Cargando datos del libro...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-black mb-6 hover:underline"
      >
        <FaArrowLeft className="mr-2 text-black" />
        Regresar
      </button>

      <h2 className="text-2xl font-bold text-[#820000] mb-6">Editar libro</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Nombre del libro"
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="author"
          value={form.author}
          onChange={handleChange}
          placeholder="Autor"
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="isbn"
          value={form.isbn}
          onChange={handleChange}
          placeholder="ISBN"
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Categoría"
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="publisher"
          value={form.publisher}
          onChange={handleChange}
          placeholder="Editorial"
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="year"
          value={form.year}
          onChange={handleChange}
          placeholder="Año de edición"
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="size"
          value={form.size}
          onChange={handleChange}
          placeholder="Medidas"
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="pages"
          value={form.pages}
          onChange={handleChange}
          placeholder="Número de páginas"
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="binding"
          value={form.binding}
          onChange={handleChange}
          placeholder="Encuadernación"
          className="w-full border rounded px-3 py-2"
        />

        <button
          type="submit"
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
};

export { EditBook };
