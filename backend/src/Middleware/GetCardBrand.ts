export function getCardBrand(number: string): "VISA" | "MasterCard" | "American Express" {
    if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(number)) {
        return "VISA";
    } else if (/^(5[1-5][0-9]{14}|2(2[2-9][0-9]{12}|[3-6][0-9]{13}|7[01][0-9]{12}|720[0-9]{12}))$/.test(number)) {
        return "MasterCard";
    } else {
        return "American Express";
    }
}
