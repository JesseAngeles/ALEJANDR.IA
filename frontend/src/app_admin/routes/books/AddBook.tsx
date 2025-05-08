import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import { createBook } from "app_admin/services/bookService";
import { FaArrowLeft } from "react-icons/fa";
import { useAuth } from "@/app_admin/context/AdminAuthContext"; 
import { validateBook } from "app_admin/validation/bookValidation"; 

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
  const [errors, setErrors] = useState<any>({}); 
  const [showSuccessModal, setShowSuccessModal] = useState(false); 

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

    const updatedForm = {
      ...form,
      price: form.price ? parseFloat(form.price) : NaN,  
      stock: form.stock ? parseInt(form.stock) : NaN,  
    };

    const newErrors: any = {};

    if (isNaN(updatedForm.price)) {
      newErrors.price = 'El precio debe ser un número válido.';
    }

    if (isNaN(updatedForm.stock)) {
      newErrors.stock = 'El stock debe ser un número válido.';
    }

    if (!updatedForm.title) {
      newErrors.title = 'El título es obligatorio';
    }
    if (!updatedForm.author) {
      newErrors.author = 'El autor es obligatorio';
    }
    if (!updatedForm.ISBN) {
      newErrors.ISBN = 'El ISBN es obligatorio';
    }
    if (!updatedForm.category) {
      newErrors.category = 'La categoría es obligatoria';
    }

    if (form.image && !/^https?:\/\/[^\s]+$/.test(form.image)) {
      newErrors.image = 'La URL debe tener un formato válido.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);  
      return;
    }

    const validationErrors = validateBook(updatedForm);
    if (validationErrors.length > 0) {
      const formattedErrors = validationErrors.reduce((acc: any, err: any) => {
        acc[err.field] = err.message;
        return acc;
      }, {});
      setErrors(formattedErrors); 
      return; 
    }

    try {
      await createBook({
        ...updatedForm,
      }, token); 
      setShowSuccessModal(true); 
      setTimeout(() => navigate("/admin/libros", { state: { updated: true } }), 2000); 
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
        {errors.title && <div className="text-red-600">{errors.title}</div>}

        <input
          name="author"
          value={form.author}
          onChange={handleChange}
          placeholder="Autor"
          className="w-full border rounded px-3 py-2"
        />
        {errors.author && <div className="text-red-600">{errors.author}</div>}

        <input
          name="ISBN"
          value={form.ISBN}
          onChange={handleChange}
          placeholder="ISBN"
          className="w-full border rounded px-3 py-2"
        />
        {errors.ISBN && <div className="text-red-600">{errors.ISBN}</div>}

        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Categoría"
          className="w-full border rounded px-3 py-2"
        />
        {errors.category && <div className="text-red-600">{errors.category}</div>}

        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Precio"
          className="w-full border rounded px-3 py-2"
        />
        {errors.price && <div className="text-red-600">{errors.price}</div>}

        <input
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock"
          className="w-full border rounded px-3 py-2"
        />
        {errors.stock && <div className="text-red-600">{errors.stock}</div>}

        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="URL de la portada (opcional)"
          className="w-full border rounded px-3 py-2"
        />
        {errors.image && <div className="text-red-600">{errors.image}</div>}

        <button
          type="submit"
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded"
        >
          Guardar libro
        </button>
      </form>

 
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center max-w-sm w-full">
            <h3 className="text-lg font-semibold text-[#00000] mb-4">
              ¡Libro añadido correctamente!
            </h3>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="bg-[#007B83] text-white px-4 py-2 rounded hover:bg-[#00666e]"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export { AddBook };
