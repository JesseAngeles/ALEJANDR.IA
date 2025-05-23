import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { getSales } from "../../services/reportsService"; // Ajusta la ruta si es distinta

const SalesByPeriod: React.FC = () => {
  const [from, setFrom] = useState("2025-01-01");
  const [to, setTo] = useState("2025-12-31");
  const [groupBy, setGroupBy] = useState("day");
  const [chartData, setChartData] = useState<{ date: string, sales: number }[]>([]);
  const [totalSum, setTotalSum] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [average, setAverage] = useState<number>(0);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const data = await getSales(from, to, groupBy);
        setChartData(data.chartData || []);
        setTotalSum(data.totalSum || 0);
        setCount(data.count || 0);
        setAverage(data.average || 0);
      } catch (error) {
        console.error("Error al cargar las ventas por periodo:", error);
      }
    };

    fetchSales();
  }, [from, to, groupBy]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-[#820000] mb-6">Ventas por periodo</h2>
      <div className="flex gap-4 mb-4">
        <input
          type="date"
          className="border px-3 py-2 rounded"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <input
          type="date"
          className="border px-3 py-2 rounded"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <select
          className="border px-3 py-2 rounded"
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value)}
        >
          <option value="day">Día</option>
          <option value="month">Mes</option>
          <option value="year">Año</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="sales" fill="#6495ED" />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 space-y-1 text-lg">
        <p><strong>Total vendido:</strong> ${totalSum.toFixed(2)}</p>
        <p><strong>Total de pedidos:</strong> {count}</p>
        <p><strong>Promedio por pedido:</strong> ${average.toFixed(2)}</p>
      </div>
    </div>
  );
};

export { SalesByPeriod };
