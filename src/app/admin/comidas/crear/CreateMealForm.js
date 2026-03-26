"use client"

import { useState, useEffect } from "react"
import { createMealAction, getDishesAction } from "./actions"

export default function CreateMealForm() {
    const [dishes, setDishes] = useState([])

    const [dishName, setDishName] = useState("")
    const [dateStr, setDateStr] = useState("")
    const [timeStr, setTimeStr] = useState("14:30")
    const [type, setType] = useState("ADULT")
    const [price, setPrice] = useState("")

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        getDishesAction().then(setDishes).catch(console.error)
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const datetime = new Date(`${dateStr}T${timeStr}:00`).toISOString()
            const res = await createMealAction(dishName, datetime, type, price)
            if (res.success) {
                window.location.href = "/admin/comidas"
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

            <div className="form-group mb-4" style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Título del Plato:</label>
                <input
                    type="text"
                    value={dishName}
                    onChange={(e) => setDishName(e.target.value)}
                    placeholder="Ej: Paella Valenciana"
                    list="dish-options"
                    required
                    style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                />
                <datalist id="dish-options">
                    {dishes.map(d => <option key={d} value={d} />)}
                </datalist>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Fecha:</label>
                    <input
                        type="date"
                        value={dateStr}
                        onChange={(e) => setDateStr(e.target.value)}
                        required
                        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                    />
                </div>
                <div style={{ flex: 0.8 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Hora:</label>
                    <input
                        type="time"
                        value={timeStr}
                        onChange={(e) => setTimeStr(e.target.value)}
                        required
                        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Tipo (Menú):</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                    >
                        <option value="ADULT">Adulto</option>
                        <option value="CHILD">Niño</option>
                    </select>
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Precio (€):</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Ej: 5.50"
                        required
                        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading || !dishName || !dateStr || !price}
                className="btn-primary w-full"
                style={{ backgroundColor: '#10B981', borderColor: '#10B981', fontSize: '1.1rem', padding: '1rem' }}
            >
                {loading ? "Creando..." : "Dar de Alta Comida"}
            </button>
        </form>
    )
}
