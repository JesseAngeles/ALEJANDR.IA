import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Enero", value: 100 },
  { name: "Febrero", value: 120 },
  { name: "Marzo", value: 150 },
  { name: "Abril", value: 180 },
  { name: "Mayo", value: 200 },
  { name: "Junio", value: 250 },
  { name: "Julio", value: 275 },
  { name: "Agosto", value: 300 },
  { name: "Septiembre", value: 320 },
  { name: "Octubre", value: 340 },
  { name: "Noviembre", value: 360 },
  { name: "Diciembre", value: 380 },
];

const SalesByPeriod: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-[#820000] mb-6">Ventas por periodo</h2>
      <div className="flex gap-4 mb-4">
        <input type="date" className="border px-3 py-2 rounded" defaultValue="2024-12-15" />
        <input type="date" className="border px-3 py-2 rounded" defaultValue="2025-01-15" />
        <input type="text" placeholder="Mostrar por: Día" className="border px-3 py-2 rounded" />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#6495ED" />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-6 space-y-1 text-lg">
        <p><strong>Total vendido:</strong> $10574.00</p>
        <p><strong>Total de pedidos:</strong> 21</p>
        <p><strong>Promedio por pedido:</strong> $503.52</p>
      </div>
    </div>
  );
};

export { SalesByPeriod };