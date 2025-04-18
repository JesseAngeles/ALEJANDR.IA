import { Card } from "../Interfaces/Card"
import { Direction } from "../Interfaces/Direction"

export function returnCard(card: Card | undefined): any {
    if (!card)
        return null

    return {
        "_id": card._id,
        "titular": card.titular,
        "last4": card.number.slice(-4),
        "expirationMonth": card.expirationMonth,
        "expirationYear": card.expirationYear
    }
}

export function returnDirection(direction: Direction | undefined): any {
    if (!direction)
        return null

    return {
        "_id": direction._id,
        "name": direction.name,
        "number": direction.number,
        "street": direction.street,
        "city": direction.city,
        "zip_code": direction.zip_code,
        "state": direction.state
    }
}

export function returnUser(user: any | undefined): any {
    if (!user)
        return null

    return {
        "_id": user._id,
        "name": user.name,
        "email": user.email,
        "active": user.active
    }
}

export function returnFullUser(user: any | undefined): any {
    if (!user)
        return null

    return {
        "_id": user._id,
        "name": user.name,
        "email": user.email,
        "active": user.active,
        "cards": user.cards,
        "directions": user.directions
    }
}