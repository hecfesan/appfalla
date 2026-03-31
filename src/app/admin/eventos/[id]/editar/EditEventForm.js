"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateEventAction } from "../../actions"

export default function EditEventForm({ event }) {
    // Current event data
    const eventDate = new Date(event.date)
    const initialDate = eventDate.toISOString().split('T')[0]
    const initialTime = eventDate.toTimeString().split(' ')[0].substring(0, 5)

    const [title, setTitle] = useState(event.title || "")
    const [date, setDate] = useState(initialDate)
    const [time, setTime] = useState(initialTime)
    const [description, setDescription] = useState(event.description || "")
    const [location, setLocation] = useState(event.location || "")
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
            const result = await updateEventAction(event.id, title, dateISO, description, location, meals)
            if (result.success) {
                router.push(`/admin/eventos/${event.id}`)
                router.refresh()
            }
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
            
            {[1, 2].map((num) => {
                const existingMeal = event.meals?.[num-1]
                return (
                    <div key={num} style={{ backgroundColor: 'var(--card-bg)', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', border: '1px solid var(--border)' }}>
                        <h4 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Comida {num}</h4>
                        <div className="input-group">
                            <label>Nombre del plato</label>
                            <input
                                type="text"
                                name={`meal${num}_name`}
                                defaultValue={existingMeal?.dishName || ""}
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
                                    defaultValue={existingMeal?.adultPrice || "0"}
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
                                    defaultValue={existingMeal?.childPrice || "0"}
                                    className="preset-btn manual"
                                    style={{ textAlign: 'left', padding: '0.8rem' }}
                                />
                            </div>
                        </div>
                    </div>
                )
            })}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button 
                    type="button" 
                    onClick={() => router.back()} 
                    className="btn-secondary" 
                    style={{ flex: 1 }}
                >
                    Cancelar
                </button>
                <button 
                    type="submit" 
                    disabled={loading} 
                    className="btn-primary" 
                    style={{ backgroundColor: '#8B5CF6', borderColor: '#8B5CF6', flex: 2 }}
                >
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>
        </form>
    )
}
