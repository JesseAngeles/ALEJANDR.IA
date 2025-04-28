import React from "react";

const CustomerList: React.FC = () => {
  const customers = [
    { name: "Ana Pérez", email: "ana@gmail.com", phone: "55-12345-678", date: "2024-12-01", orders: 3, spent: 1589 },
    { name: "Juan Gómez", email: "juan@gmail.com", phone: "55-876543221", date: "2025-01-10", orders: 1, spent: 499 },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-[#820000] mb-6">Clientes</h2>
      <input type="text" placeholder="Buscar clientes" className="mb-4 w-full border px-3 py-2 rounded" />
      <table className="w-full text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Nombre</th>
            <th className="p-2">Correo</th>
            <th className="p-2">Teléfono</th>
            <th className="p-2">Registro</th>
            <th className="p-2">Pedidos</th>
            <th className="p-2">Total gastado</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{c.name}</td>
              <td className="p-2">{c.email}</td>
              <td className="p-2">{c.phone}</td>
              <td className="p-2">{c.date}</td>
              <td className="p-2">{c.orders}</td>
              <td className="p-2 text-teal-600 font-semibold">${c.spent}.00</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { CustomerList };
