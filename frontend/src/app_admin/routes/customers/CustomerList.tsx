import React, { useEffect, useState } from "react";
import { getUsers, USER } from "app_admin/services/adminService";

const CustomerList: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        console.error("Error al obtener los usuarios:", err);
        setError(true);
      }
    };

    loadUsers();
  }, []);

  if (!USER || USER.role !== "admin") {
    return <div className="text-center text-red-600 py-10">Acceso denegado</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">No se pudieron cargar los usuarios</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-[#820000] mb-6">Clientes registrados</h2>
      <table className="w-full text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Nombre</th>
            <th className="p-2">Email</th>
            <th className="p-2">Activo</th>
            <th className="p-2">Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-t">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.active ? "Sí" : "No"}</td>
              <td className="p-2">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { CustomerList };
