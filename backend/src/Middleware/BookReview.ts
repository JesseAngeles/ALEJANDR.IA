import { Book } from "../Interfaces/Book"

export function updateRating(book: Book): number {
    const ratings = book.reviews.map(r => r.rating)

    if (ratings.length == 0)
        return 0

    const suma = ratings.reduce((acumulador, valor) => acumulador + valor, 0)
    return suma / ratings.length
}

export function updateSummary(book: Book): string {
    if (book.reviews.length % 5 == 0)
        // TODO  conexion con el microsoervicio para el resumen de reviews
        return "mensaje de pruebas"

    return book.reviewSumary
}