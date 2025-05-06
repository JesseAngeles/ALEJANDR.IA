import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBook } from "app_admin/services/bookService";
import { FaArrowLeft } from "react-icons/fa";
import { useAuth } from "@/app_admin/context/AdminAuthContext"; 

const AddBook: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth(); 
  const [form, setForm] = useState({
    title: "",
    author: "",
    ISBN: "",
    category: "",
    price: "",
    stock: "",
    image: "", 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      console.error("No token found");
      alert("Debe estar autenticado para agregar un libro.");
      return;
    }

    try {
      await createBook({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      }, token); 
      alert("Libro añadido correctamente");
      navigate("/admin/libros");
    } catch (error) {
      console.error("Error al añadir el libro:", error);
      alert("Hubo un error al añadir el libro.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-black mb-6 hover:underline"
      >
        <FaArrowLeft className="mr-2 text-black" />
        Regresar
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
          name="ISBN"
          value={form.ISBN}
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
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Precio"
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock"
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="URL de la portada (opcional)"
          className="w-full border rounded px-3 py-2"
        />

        <button
          type="submit"
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded"
        >
          Guardar libro
        </button>
      </form>
    </div>
  );
};

export { AddBook };

