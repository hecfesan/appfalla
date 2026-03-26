"use client"

import { useState } from "react"
import { useTokensAction } from "@/app/usar/actions"

const PRESETS = [1, 2, 3, 4, 5]

export default function UseTokensForm({ currentBalance }) {
    const [tokens, setTokens] = useState(1)
    const [isManual, setIsManual] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const handleUse = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess("")

        try {
            if (tokens <= 0 || tokens > currentBalance) throw new Error("Cantidad no válida.")
            await useTokensAction(tokens)
            setSuccess(`Se ha enviado una solicitud de canje por ${tokens} token(s). Pendiente de validación en barra.`)
            setTokens(1)
            setIsManual(false)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const selectPreset = (val) => {
        setTokens(val)
        setIsManual(false)
    }

    return (
        <form onSubmit={handleUse} className="purchase-form">
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="form-group mb-4" style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Elige cuántos tokens vas a canjear:</label>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                    {PRESETS.map((preset) => (
                        <button
                            key={preset}
                            type="button"
                            className={`preset-btn ${tokens === preset && !isManual ? 'active' : ''}`}
                            onClick={() => selectPreset(preset)}
                        >
                            {preset}
                        </button>
                    ))}
                    <button
                        type="button"
                        className={`preset-btn ${isManual ? 'active' : ''}`}
                        onClick={() => setIsManual(true)}
                    >
                        Otra
                    </button>
                </div>

                {isManual && (
                    <input
                        type="number"
                        min="1"
                        max={currentBalance || 1}
                        value={tokens}
                        onChange={(e) => setTokens(Number(e.target.value))}
                        style={{ width: '100%', padding: '1rem', fontSize: '1.25rem', borderRadius: '8px', border: '1px solid var(--primary)', background: 'var(--bg)', color: 'var(--text)' }}
                    />
                )}
            </div>

            <button
                type="submit"
                disabled={loading || tokens <= 0 || tokens > currentBalance}
                className="btn-primary w-full"
            >
                {loading ? "Procesando..." : "Solicitar Canje"}
            </button>
        </form>
    )
}
