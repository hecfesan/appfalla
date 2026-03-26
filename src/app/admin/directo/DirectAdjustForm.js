"use client"

import { useState } from "react"
import { adjustTokensAction } from "./actions"

export default function DirectAdjustForm() {
    const [userId, setUserId] = useState("")
    const [amount, setAmount] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess("")

        try {
            if (!userId || isNaN(Number(userId))) throw new Error("ID de usuario no válido.")
            if (!amount || isNaN(Number(amount))) throw new Error("Cantidad no válida.")

            const res = await adjustTokensAction(Number(userId), Number(amount))
            if (res.success) {
                setSuccess(res.message)
                setUserId("")
                setAmount("")
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="purchase-form">
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="form-group mb-4" style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    ID Numérico del Usuario:
                </label>
                <input
                    type="number"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Ej: 3"
                    required
                    style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                />
            </div>

            <div className="form-group mb-4" style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Tokens a Añadir / Restar:
                </label>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Usa un número positivo para sumar tokens (ej: 5) o un número negativo para restar (ej: -2).
                </p>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Ej: 5 o -3"
                    required
                    style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                />
            </div>

            <button
                type="submit"
                disabled={loading || !userId || !amount}
                className="btn-primary w-full"
                style={{ backgroundColor: '#F59E0B', borderColor: '#F59E0B' }}
            >
                {loading ? "Procesando..." : "Aplicar Ajuste"}
            </button>
        </form>
    )
}
