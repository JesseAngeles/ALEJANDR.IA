import React from "react";

const FrequentCustomers: React.FC = () => {
  const data = [
    { name: "Ana Pérez", email: "ana@gmail.com", orders: 6, total: 3289 },
    { name: "Juan Gómez", email: "juan@gmail.com", orders: 5, total: 2987 },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-[#820000] mb-6">Clientes frecuentes</h2>
      <table className="w-full text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Nombre</th>
            <th className="p-2">Correo</th>
            <th className="p-2">Pedidos</th>
            <th className="p-2">Total comprado</th>
          </tr>
        </thead>
        <tbody>
          {data.map((c, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{c.name}</td>
              <td className="p-2">{c.email}</td>
              <td className="p-2">{c.orders}</td>
              <td className="p-2 text-teal-600 font-semibold">${c.total}.00</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { FrequentCustomers };
