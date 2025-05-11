const API_URL = "http://localhost:8080/report";

// Obtener las ventas con parámetros (from, to, groupBy)
export const getSales = async (from: string, to: string, groupBy: string) => {
  try {
    const queryParams = new URLSearchParams({ from, to, groupBy }).toString();
    const response = await fetch(`${API_URL}/sales?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Detalles del backend:", errorText);
      throw new Error("Error al obtener las ventas");
    }

    const result = await response.json();
    return {
      chartData: result.chartData || [],
      totalSum: result.totalSum || 0,
      count: result.count || 0,
      average: result.average || 0,
    };
  } catch (error) {
    console.error("Error al obtener las ventas:", error);
    throw new Error("Error al obtener las ventas");
  }
};

// Obtener los libros
export const getBooks = async () => {
  try {
    const response = await fetch(`${API_URL}/books`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Detalles del backend:", errorText);
      throw new Error("Error al obtener los libros");
    }

    const result = await response.json();
    return result.books;
  } catch (error) {
    console.error("Error al obtener los libros:", error);
    throw new Error("Error al obtener los libros");
  }
};

// Obtener los clientes
export const getClients = async () => {
  try {
    const response = await fetch(`${API_URL}/clients`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Detalles del backend:", errorText);
      throw new Error("Error al obtener los clientes");
    }

    const result = await response.json();
    return result.clients;
  } catch (error) {
    console.error("Error al obtener los clientes:", error);
    throw new Error("Error al obtener los clientes");
  }
};

// Obtener los estados
export const getStates = async () => {
  try {
    const response = await fetch(`${API_URL}/states`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Detalles del backend:", errorText);
      throw new Error("Error al obtener los estados");
    }

    const result = await response.json();
    return result.states;
  } catch (error) {
    console.error("Error al obtener los estados:", error);
    throw new Error("Error al obtener los estados");
  }
};
