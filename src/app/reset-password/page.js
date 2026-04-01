"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { resetPasswordAction } from "./actions"

function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setError("")
        setMessage("")

        const formData = new FormData(e.target)
        const password = formData.get("password")
        const confirmPassword = formData.get("confirmPassword")

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden")
            setLoading(false)
            return
        }

        const result = await resetPasswordAction({ password }, token)

        if (result.error) {
            setError(result.error)
        } else {
            setMessage(result.success)
        }
        setLoading(false)
    }

    if (!token) {
        return (
            <main className="auth-container">
                <div className="auth-card">
                    <h1>Error</h1>
                    <p className="error-message">Token de restablecimiento faltante.</p>
                    <p className="auth-switch">
                        <Link href="/login">Volver al inicio de sesión</Link>
                    </p>
                </div>
            </main>
        )
    }

    return (
        <main className="auth-container">
            <div className="auth-card">
                <h1>Nueva Contraseña</h1>
                <p className="text-muted" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                    Introduce tu nueva contraseña debajo.
                </p>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="error-message">{error}</div>}
                    {message && (
                        <div className="success-message" style={{ color: 'var(--success)', marginBottom: '1rem', textAlign: 'center' }}>
                            {message}
                        </div>
                    )}

                    {!message && (
                        <>
                            <div className="form-group">
                                <label htmlFor="password">Nueva Contraseña</label>
                                <input id="password" name="password" type="password" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                                <input id="confirmPassword" name="confirmPassword" type="password" required />
                            </div>
                            <button type="submit" disabled={loading} className="btn-primary auth-btn">
                                {loading ? "Restableciendo..." : "Cambiar Contraseña"}
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

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <main className="auth-container">
                <div className="auth-card">
                    <p>Cargando...</p>
                </div>
            </main>
        }>
            <ResetPasswordForm />
        </Suspense>
    )
}
