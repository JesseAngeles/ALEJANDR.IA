import React, { useEffect, useState } from "react";
import { useAuth } from "@/app_admin/context/AdminAuthContext";
import { getUsers } from "app_admin/services/adminService"; 

const CustomerList: React.FC = () => {
  const { token } = useAuth(); 
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      if (!token) {
        console.error("Token no disponible");
        setError(true);
        return;
      }

      try {
        const data = await getUsers(token); 
        setUsers(data);
      } catch (err) {
        console.error("Error al obtener los usuarios:", err);
        setError(true);
      }
    };

    loadUsers();
  }, [token]); 

  if (!token) {
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
           
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-t">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
           

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { CustomerList };
