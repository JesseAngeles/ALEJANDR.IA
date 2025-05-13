export function getCardLogo(brand: string): string {
    switch (brand) {
        case "VISA":
            return "/src/assets/icons/visa.webp";
        case "MasterCard":
            return "/src/assets/icons/mastercard.webp";
        case "american express":
            return "/src/assets/icons/American.webp";
        default:
            return "/src/assets/icons/American.webp";
    }
}
