"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginForm() {
    const router = useRouter()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        const formData = new FormData(e.target)
        const username = formData.get("username")
        const password = formData.get("password")

        try {
            const res = await signIn("credentials", {
                username,
                password,
                redirect: false,
            })

            if (res?.error) {
                setError("Usuario o contraseña incorrectos")
            } else {
                router.push("/")
                router.refresh()
            }
        } catch (err) {
            setError("Error al iniciar sesión")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
                <label htmlFor="username">Nombre de usuario</label>
                <input id="username" name="username" type="text" required />
            </div>
            <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input id="password" name="password" type="password" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary auth-btn">
                {loading ? "Iniciando..." : "Entrar"}
            </button>
        </form>
    )
}
