const API_URL = "http://localhost:8080/order"; 

// Obtener todos los pedidos
export const getOrders = async (token: string) => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Detalles del backend:", errorText);
      throw new Error("Error al obtener los pedidos");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error; 
  }
};

// Obtener los detalles de un pedido específico
export const getOrderDetails = async (orderId: string, token: string) => {
  try {
    const response = await fetch(`${API_URL}/details/${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Detalles del backend:", errorText);
      throw new Error("Error al obtener los detalles del pedido");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching order details:", error);
    throw error; 
  }
};

// Actualizar el estado de un pedido
export const updateOrderStatus = async (
  orderId: string, // El ID del pedido
  status: string, // El nuevo estado
  token: string
) => {
  try {
    const response = await fetch(`${API_URL}/state/${orderId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ state: status }), 
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Detalles del backend:", errorText);
      throw new Error("Error al actualizar el estado del pedido");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error; 
  }
};
