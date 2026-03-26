"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createEventAction } from "./actions"

export default function CreateEventForm() {
    const [title, setTitle] = useState("")
    const [date, setDate] = useState("")
    const [time, setTime] = useState("")
    const [description, setDescription] = useState("")
    const [location, setLocation] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        if (!title.trim() || !date || !time) {
            setError("Título, fecha y hora son obligatorios.")
            setLoading(false)
            return
        }

        const dateISO = new Date(`${date}T${time}`).toISOString()

        try {
            await createEventAction(title, dateISO, description, location)
            router.push("/admin/eventos")
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="use-tokens-form">
            {error && <div className="error-message" style={{ marginBottom: '1rem', color: 'var(--error)' }}>{error}</div>}

            <div className="input-group">
                <label>Título del Evento *</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej. Volta a peu, Concierto..."
                    className="preset-btn manual"
                    style={{ textAlign: 'left', padding: '0.8rem' }}
                    required
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <div className="input-group">
                    <label>Fecha *</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="preset-btn manual"
                        style={{ textAlign: 'left', padding: '0.8rem' }}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Hora *</label>
                    <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="preset-btn manual"
                        style={{ textAlign: 'left', padding: '0.8rem' }}
                        required
                    />
                </div>
            </div>

            <div className="input-group" style={{ marginTop: '1rem' }}>
                <label>Lugar</label>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ej. Casal, Plaza..."
                    className="preset-btn manual"
                    style={{ textAlign: 'left', padding: '0.8rem' }}
                />
            </div>

            <div className="input-group" style={{ marginTop: '1rem' }}>
                <label>Descripción</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detalles sobre el evento..."
                    className="preset-btn manual"
                    style={{ textAlign: 'left', padding: '0.8rem', minHeight: '80px', resize: 'vertical' }}
                />
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ backgroundColor: '#8B5CF6', borderColor: '#8B5CF6', marginTop: '1.5rem', width: '100%' }}>
                {loading ? 'Creando...' : 'Dar de alta evento'}
            </button>
        </form>
    )
}
