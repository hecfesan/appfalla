"use client"

import { useState } from "react"
import { updateProfileAction } from "@/app/perfil/actions"

export default function ProfileForm({ user }) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const handleUpdate = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess("")

        const formData = new FormData(e.target)
        const name = formData.get("name")
        const password = formData.get("password")

        try {
            if (password && password.length < 6) { throw new Error("La contraseña debe tener al menos 6 caracteres") }
            await updateProfileAction({ name, password })
            setSuccess("Tus datos han sido actualizados correctamente.")
            e.target.reset()
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleUpdate} className="auth-form" style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="form-group">
                <label>Nombre de usuario</label>
                <input type="text" value={user.username} disabled style={{ opacity: 0.5, cursor: 'not-allowed' }} />
            </div>

            <div className="form-group">
                <label htmlFor="name">Nombre visible</label>
                <input type="text" id="name" name="name" defaultValue={user.name} />
            </div>

            <div className="form-group">
                <label htmlFor="password">Nueva contraseña (opcional)</label>
                <input type="password" id="password" name="password" placeholder="Déjalo en blanco para no cambiarla" />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-4">
                {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
        </form>
    )
}
