import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchBookByISBN, updateBook } from "app_admin/services/bookService";
import { FaArrowLeft } from "react-icons/fa";
import { useAuth } from "@/app_admin/context/AdminAuthContext"; // Asegúrate de que la ruta sea correcta

const EditBook: React.FC = () => {
  const { id } = useParams(); // id = ISBN
  const navigate = useNavigate();
  const { token } = useAuth(); // Obtener el token desde el contexto de autenticación
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    author: "",
    ISBN: "",
    category: "",
    price: "",
    stock: "",
    image: "",
  });

  useEffect(() => {
    if (!id || !token) return;

    fetchBookByISBN(id,token)
      .then((book) => {
        setForm({
          title: book.title || "",
          author: book.author || "",
          ISBN: book.ISBN || "",
          category: book.category || "",
          price: book.price?.toString() || "",
          stock: book.stock?.toString() || "",
          image: book.image || "",
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

    if (!token) {
      console.error("No token found");
      alert("Debe estar autenticado para editar un libro.");
      return;
    }

    try {
      await updateBook(form.ISBN, {
        title: form.title,
        author: form.author,
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        image: form.image,
        ISBN: form.ISBN,
      }, token); // Pasa el token aquí para la autorización
      alert("Libro actualizado exitosamente");
      navigate("/admin/libros");
    } catch (error: any) {
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
          Guardar cambios
        </button>
      </form>
    </div>
  );
};

export { EditBook };
