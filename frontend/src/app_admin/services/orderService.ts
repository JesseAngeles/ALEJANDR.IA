
const API_URL = "http://localhost:8080/order"; 
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

export const getOrderById = async (orderId: number, token: string) => {
  try {
    const response = await fetch(`${API_URL}/${orderId}`, {
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

export const updateOrderStatus = async (
    orderId: string,
    status: string,
    token: string
  ) => {
    const response = await fetch(`http://localhost:8080/order/state`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: orderId, state: status }), // <-- lo que espera tu backend
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Detalles del backend:", errorText);
      throw new Error("Error al actualizar el estado del pedido");
    }
  
    return await response.json();
  };
  