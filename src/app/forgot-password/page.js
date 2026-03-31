"use client"

import { useState } from "react"
import Link from "next/link"
import { forgotPasswordAction } from "./actions"

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setError("")
        setMessage("")

        const formData = new FormData(e.target)
        const result = await forgotPasswordAction(formData)

        if (result.error) {
            setError(result.error)
        } else {
            setMessage(result.success)
        }
        setLoading(false)
    }

    return (
        <main className="auth-container">
            <div className="auth-card">
                <h1>Recuperar Contraseña</h1>
                <p className="text-muted" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                    Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                </p>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="error-message">{error}</div>}
                    {message && <div className="success-message" style={{ color: 'var(--success)', marginBottom: '1rem', textAlign: 'center' }}>{message}</div>}

                    {!message && (
                        <>
                            <div className="form-group">
                                <label htmlFor="email">Correo Electrónico</label>
                                <input id="email" name="email" type="email" required placeholder="ejemplo@correo.com" />
                            </div>
                            <button type="submit" disabled={loading} className="btn-primary auth-btn">
                                {loading ? "Enviando..." : "Enviar Enlace"}
                            </button>
                        </>
                    )}
                </form>

                <p className="auth-switch">
                    <Link href="/login">Volver al inicio de sesión</Link>
                </p>
            </div>
        </main>
    )
}
