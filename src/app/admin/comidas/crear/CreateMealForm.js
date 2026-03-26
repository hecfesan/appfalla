"use client"

import { useState, useEffect } from "react"
import { createMealAction, getDishesAction } from "./actions"

export default function CreateMealForm() {
    const [dishes, setDishes] = useState([])
    const [selectedDish, setSelectedDish] = useState("")

    const [dishName, setDishName] = useState("")
    const [dateStr, setDateStr] = useState("")
    const [timeStr, setTimeStr] = useState("14:30")
    
    // Adult and Child prices
    const [priceAdult, setPriceAdult] = useState("")
    const [priceChild, setPriceChild] = useState("")

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        getDishesAction().then(res => {
            setDishes(res)
            if (res.length === 0) {
                setSelectedDish("NEW")
            }
        }).catch(console.error)
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        const finalDishName = selectedDish === "NEW" ? dishName : selectedDish

        if (!priceAdult && !priceChild) {
            setError("Debes indicar al menos un precio (adulto o niño).")
            setLoading(false)
            return
        }

        try {
            const datetime = new Date(`${dateStr}T${timeStr}:00`).toISOString()
            const res = await createMealAction(finalDishName, datetime, priceAdult, priceChild)
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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Plato:</label>
                
                {dishes.length > 0 && (
                    <select 
                        value={selectedDish} 
                        onChange={(e) => {
                            setSelectedDish(e.target.value)
                            if (e.target.value !== "NEW") setDishName("")
                        }}
                        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', marginBottom: selectedDish === "NEW" ? '1rem' : '0' }}
                    >
                        <option value="" disabled>-- Selecciona un plato guardado --</option>
                        {dishes.map(d => <option key={d} value={d}>{d}</option>)}
                        <option value="NEW" style={{ fontWeight: 'bold', color: 'var(--primary)' }}>+ Nueva comida manual...</option>
                    </select>
                )}

                {(selectedDish === "NEW" || dishes.length === 0) && (
                    <input
                        type="text"
                        value={dishName}
                        onChange={(e) => setDishName(e.target.value)}
                        placeholder="Ej: Paella Valenciana"
                        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                    />
                )}
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

            <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Precios de los menús (€):</label>
                <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>Deja en blanco el que no quieras ofrecer para esta comida.</p>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Menú Adulto</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={priceAdult}
                            onChange={(e) => setPriceAdult(e.target.value)}
                            placeholder="Ej: 5.50"
                            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Menú Infantil</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={priceChild}
                            onChange={(e) => setPriceChild(e.target.value)}
                            placeholder="Ej: 3.50"
                            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                        />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading || (!dishName && selectedDish === "NEW") || !dateStr || (!priceAdult && !priceChild)}
                className="btn-primary w-full"
                style={{ backgroundColor: '#10B981', borderColor: '#10B981', fontSize: '1.1rem', padding: '1rem' }}
            >
                {loading ? "Creando..." : "Dar de Alta Comida"}
            </button>
        </form>
    )
}
