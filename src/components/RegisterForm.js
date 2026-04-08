"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterForm() {
    const router = useRouter()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        const formData = new FormData(e.target)
        const data = Object.fromEntries(formData)
        const { username, name, password } = data

        if (!username || !name || !password) {
            setError("Todos los campos son obligatorios")
            setLoading(false)
            return
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, name, password }),
            })
            const result = await res.json()

            if (!res.ok) {
                throw new Error(result.error || "Algo salió mal al registrarse")
            }

            router.push("/login?registered=true")
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
                <label htmlFor="name">Nombre Completo</label>
                <input id="name" name="name" type="text" required />
            </div>
            <div className="form-group">
                <label htmlFor="username">Nombre de usuario</label>
                <input id="username" name="username" type="text" required />
            </div>
            <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input id="password" name="password" type="password" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary auth-btn">
                {loading ? "Registrando..." : "Registrarse"}
            </button>
        </form>
    )
}
