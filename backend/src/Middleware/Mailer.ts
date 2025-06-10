import nodemailer from "nodemailer";

/**
 * Envía un correo electrónico inmediatamente.
 * @param to Destinatario
 * @param subject Asunto
 * @param html Contenido HTML completo
 */
export async function sendNow(to: string, subject: string, html: string) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        await transporter.sendMail({
            from: `"ALEJANDR.IA" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log(`Email sent to ${to} [${subject}]`);
    } catch (error) {
        console.error(`Error sending email to ${to}: ${error}`);
    }
}

/**
 * Envía varios correos electrónicos en secuencia, cada uno con un delay y permitiendo ejecutar un callback tras cada envío.
 * @param emails Array de correos {to, subject, html, delay, onSent?}
 */
export async function sendInSequence(
    emails: {
        to: string,
        subject: string,
        html: string,
        delay?: number, // en milisegundos
        onSent?: () => Promise<void> | void // función a ejecutar después de enviar y esperar el delay
    }[]
) {
    for (const { to, subject, html, delay, onSent } of emails) {
        await sendNow(to, subject, html);
        if (onSent) await onSent();
        if (delay && delay > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}
