import type { User } from "@/assets/types/user";

export const userService = {
    getProfile: async (): Promise<User> => {
        const response = await fetch("/api/user/profile");
        if (!response.ok) {
            throw new Error("Error fetching user profile.");
        }
        return await response.json();
    },

    updateProfile: async (userData: Partial<User>): Promise<void> => {
        const response = await fetch("/api/user/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error("Error updating user profile.");
        }
    },
};
