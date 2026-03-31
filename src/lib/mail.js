import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const domain = process.env.NEXTAUTH_URL

export const sendPasswordResetEmail = async (email, token) => {
    const resetLink = `${domain}/reset-password?token=${token}`

    await resend.emails.send({
        from: "AppFalla <onboarding@resend.dev>",
        to: email,
        subject: "Restablece tu contraseña",
        html: `<p>Haz clic <a href="${resetLink}">aquí</a> para restablecer tu contraseña.</p>`
    })
}

export const sendWelcomeEmail = async (email, name, username) => {
    await resend.emails.send({
        from: "AppFalla <onboarding@resend.dev>",
        to: email,
        subject: "¡Bienvenido a AppFalla!",
        html: `
            <h1>¡Bienvenido, ${name}!</h1>
            <p>Gracias por registrarte en la aplicación de gestión de tokens de la falla.</p>
            <p>Tu nombre de usuario es: <strong>${username}</strong></p>
            <p>Ya puedes empezar a comprar y usar tus tokens desde el dashboard.</p>
        `
    })
}
