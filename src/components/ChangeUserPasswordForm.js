"use client"

import { useState } from "react"
import { changeUserPassword } from "@/app/superadmin/actions"

export default function ChangeUserPasswordForm({ userId, userName }) {
    const [isEditing, setIsEditing] = useState(false)
    const [newPassword, setNewPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!newPassword) return

        setLoading(true)
        setMessage("")
        try {
            await changeUserPassword(userId, newPassword)
            setMessage("✅ Contraseña actualizada")
            setNewPassword("")
            setTimeout(() => {
                setIsEditing(false)
                setMessage("")
            }, 2000)
        } catch (err) {
            setMessage("❌ " + err.message)
        } finally {
            setLoading(false)
        }
    }

    if (!isEditing) {
        return (
            <button 
                onClick={() => setIsEditing(true)}
                className="btn-outline"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
            >
                Cambiar Contraseña
            </button>
        )
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem' }}>
            <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nueva clave..."
                required
                style={{ 
                    padding: '0.4rem 0.8rem', 
                    fontSize: '0.8rem', 
                    borderRadius: '6px', 
                    border: '1px solid var(--border)',
                    background: 'var(--bg)',
                    color: 'var(--text)',
                    width: '120px'
                }}
            />
            <button 
                type="submit" 
                disabled={loading}
                className="btn-primary"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
            >
                {loading ? "..." : "OK"}
            </button>
            <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="btn-outline"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
            >
                X
            </button>
            {message && <span style={{ fontSize: '0.75rem', marginLeft: '0.5rem' }}>{message}</span>}
        </form>
    )
}
