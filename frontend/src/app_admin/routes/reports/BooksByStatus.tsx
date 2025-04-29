import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Pendientes", value: 12, color: "#6495ED" },
  { name: "Enviados", value: 13, color: "#3CB371" },
  { name: "Entregados", value: 12, color: "#FF4D6D" },
  { name: "Cancelados", value: 3, color: "#FFD700" },
];

const BooksByStatus: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-[#820000] mb-6">Libros por estado</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export { BooksByStatus };