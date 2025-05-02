import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBook } from "app_admin/services/bookService"; 
import { FaArrowLeft } from "react-icons/fa";

const AddBook: React.FC = () => {
  const navigate = useNavigate();

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newBook = await createBook(form);
      console.log("Libro creado exitosamente:", newBook);
      navigate("/admin/libros");
    } catch (error) {
      console.error("Error al crear el libro:", error);
      alert("Hubo un error al crear el libro.");
    }
  };

  return (
  <div className="max-w-5xl mx-auto px-4 py-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-black hover:underline mb-4"
      >
        <FaArrowLeft className="mr-2 text-black" />
        <span className="text-black font-medium">Regresar</span>
      </button>

      <h2 className="text-2xl font-bold text-[#820000] mb-6">Añadir libro</h2>
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
        <div className="flex justify-center mt-4">
        <button
          type="submit"
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded"
        >
          Guardar libro
        </button>
        </div>
      </form>
    </div>
  );
};

export { AddBook };
