import { tokenService } from "./tokenService";

export const apiFetch = async (
    url: string,
    options: RequestInit = {}
): Promise<any> => {
    const token = tokenService.getToken();

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url, { ...options, headers });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "API request failed");
    }

    return res.json();
};
