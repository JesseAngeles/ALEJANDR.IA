// Función para validar el formato de una tarjeta bancaria
export function luhn(numero: string): boolean {
    // 1. Solo dígitos.
    if (!/^\d+$/.test(numero))
        return false

    const digitos = numero.split('').reverse().map(Number);

    let suma = 0;

    digitos.forEach((digito, index) => {
        let valor = digito;

        // 2. Duplica cada segundo dígito de la derecha
        if ((index + 1) % 2 === 0) {
            valor *= 2;
            if (valor > 9)
                valor -= 9
        }

        // 3. Suma los dígitos
        suma += valor
    })

    // 4. Verifica si la suma es múltiplo de 10
    return suma % 10 === 0;
}