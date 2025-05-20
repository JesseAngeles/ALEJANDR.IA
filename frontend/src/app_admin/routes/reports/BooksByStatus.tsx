import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer
} from "recharts";
import { getStates } from "../../services/reportsService"; // Ajusta la ruta según tu estructura

// Colores asignados (puedes ajustar o hacerlos aleatorios si prefieres)
const COLORS = ["#6495ED", "#3CB371", "#FF4D6D", "#FFD700", "#8A2BE2", "#FF8C00"];

interface StateData {
  state: string;
  count: number;
}

const BooksByStatus: React.FC = () => {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const states: StateData[] = await getStates();
        const transformed = states.map(s => ({
          name: s.state,
          value: s.count,
        }));
        setData(transformed);
      } catch (error) {
        console.error("Error al cargar los estados:", error);
      }
    };

    fetchStates();
  }, []);

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
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
