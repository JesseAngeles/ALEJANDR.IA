import React, { useEffect, useState } from "react";
import { getClients } from "../../services/reportsService"; // Ajusta la ruta según tu proyecto

interface Client {
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
}

const FrequentCustomers: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getClients();
        setClients(data);
      } catch (error) {
        console.error("Error al cargar clientes frecuentes:", error);
      }
    };

    fetchClients();
  }, []);

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
          {clients.map((c, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{c.name}</td>
              <td className="p-2">{c.email}</td>
              <td className="p-2">{c.orders}</td>
              <td className="p-2 text-teal-600 font-semibold">${c.totalSpent.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { FrequentCustomers };
