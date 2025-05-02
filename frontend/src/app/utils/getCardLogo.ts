export function getCardLogo(brand: string): string {
    switch (brand) {
        case "visa":
            return "/src/assets/icons/visa.webp";
        case "mastercard":
            return "/src/assets/icons/mastercard.webp";
        default:
            return "/src/assets/icons/default-card.webp";
    }
}
