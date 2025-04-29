export function getCardLogo(brand: string): string {
    switch (brand.toLowerCase()) {
        case "visa":
            return "/src/assets/icons/visa.webp";
        case "mastercard":
            return "/src/assets/icons/mastercard.webp";
        default:
            return "/img/default-card.svg";
    }
}
