"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createEventAction } from "../actions"

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

        const formData = new FormData(e.currentTarget)
        const meals = []
        for (let i = 1; i <= 2; i++) {
            const name = formData.get(`meal${i}_name`)
            if (name && name.trim()) {
                meals.push({
                    dishName: name.trim(),
                    adultPrice: parseFloat(formData.get(`meal${i}_adultPrice`)) || 0,
                    childPrice: parseFloat(formData.get(`meal${i}_childPrice`)) || 0
                })
            }
        }

        try {
            await createEventAction(title, dateISO, description, location, meals)
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

            <hr style={{ margin: '2rem 0', borderColor: 'var(--border)', opacity: 0.3 }} />
            
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--primary)' }}>🍴 Comidas Asociadas</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Puedes añadir hasta 2 comidas a este evento (ej. Paella y Merienda).
            </p>

            {[1, 2].map((num) => (
                <div key={num} style={{ backgroundColor: 'var(--card-bg)', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', border: '1px solid var(--border)' }}>
                    <h4 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Comida {num}</h4>
                    <div className="input-group">
                        <label>Nombre del plato</label>
                        <input
                            type="text"
                            name={`meal${num}_name`}
                            placeholder="Ej. Paella Valenciana"
                            className="preset-btn manual"
                            style={{ textAlign: 'left', padding: '0.8rem' }}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                        <div className="input-group">
                            <label>Precio Adulto (€)</label>
                            <input
                                type="number"
                                name={`meal${num}_adultPrice`}
                                step="0.5"
                                defaultValue="0"
                                className="preset-btn manual"
                                style={{ textAlign: 'left', padding: '0.8rem' }}
                            />
                        </div>
                        <div className="input-group">
                            <label>Precio Niño (€)</label>
                            <input
                                type="number"
                                name={`meal${num}_childPrice`}
                                step="0.5"
                                defaultValue="0"
                                className="preset-btn manual"
                                style={{ textAlign: 'left', padding: '0.8rem' }}
                            />
                        </div>
                    </div>
                </div>
            ))}

            <button type="submit" disabled={loading} className="btn-primary" style={{ backgroundColor: '#8B5CF6', borderColor: '#8B5CF6', marginTop: '1.5rem', width: '100%' }}>
                {loading ? 'Creando...' : 'Dar de alta evento'}
            </button>
        </form>
    )
}
