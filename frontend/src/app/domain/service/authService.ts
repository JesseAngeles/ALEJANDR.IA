const API_URL = `${import.meta.env.VITE_ENDPOINT}/user`;

export const authService = {
    login: async (email: string, password: string): Promise<string> => {
        const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            throw new Error("Login failed");
        }

        const data = await res.json();
        return data.token; // Guarda esto en localStorage o context
    },
};
