import type { Book } from "@/assets/types/book";

export type OrderStatus = "Entregado" | "Enviado" | "Cancelado";

export type OrderHistoryItem = Book & {
    status: OrderStatus;
};

let orderStorage: OrderHistoryItem[] = [
    {
        id: 1,
        titulo: "CUCHARA Y MEMORIA",
        autor: "BENITO TAIBO",
        imagen: "/cuchara-memoria.jpg",
        precio: 569,
        cantidad: 1,
        status: "Entregado",
    },
    {
        id: 2,
        titulo: "FRANCO",
        autor: "PAUL PRESTON",
        imagen: "/franco.jpg",
        precio: 569,
        cantidad: 1,
        status: "Enviado",
    },
    {
        id: 3,
        titulo: "ALAS DE ÓNIX",
        autor: "REBECCA YARROS",
        imagen: "/alas-onix.jpg",
        precio: 569,
        cantidad: 1,
        status: "Cancelado",
    },
];

export const orderHistoryService = {
    getAll: async (): Promise<OrderHistoryItem[]> => {
        return orderStorage;
    },

    resetMock: (data: OrderHistoryItem[]) => {
        orderStorage = [...data];
    },
};
