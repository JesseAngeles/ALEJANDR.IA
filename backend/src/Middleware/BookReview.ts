import { Book } from "../Interfaces/Book"
require('dotenv').config();

export function updateRating(book: Book): number {
    const ratings = book.reviews.map(r => r.rating)

    if (ratings.length == 0)
        return 0

    const suma = ratings.reduce((acumulador, valor) => acumulador + valor, 0)
    return suma / ratings.length
}

// export function updateSummary(book: Book): string {
//     if (book.reviews.length % 1 == 0)
//         // TODO  conexion con el microsoervicio para el resumen de reviews
//         return "mensaje de pruebas"


//     return book.reviewSumary
// }

// Este método ahora es asíncrono porque usa `fetch`

const SUMMARY_SERVICE_URL = process.env.SUMMARY_SERVICE_URL!

export async function updateSummary(book: Book): Promise<string> {
    if (book.reviews.length === 0) {
        return book.reviewSumary 
    }

    try {
        const response = await fetch(`${SUMMARY_SERVICE_URL}/${book.ISBN}`)
        if (!response.ok) {
            console.error("Error al contactar con el microservicio:", response.statusText)
            return book.reviewSumary
        }

        const data = await response.json()
        book.reviewSumary = data.summary
        return book.reviewSumary
    } catch (error) {
        console.error("Error en la petición al microservicio:", error)
        return book.reviewSumary
    }
}
