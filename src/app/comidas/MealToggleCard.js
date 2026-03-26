"use client"

import { useState } from "react"
import { toggleMealSubscription } from "./actions"

export default function MealToggleCard({ meal, initialSubscribed }) {
    const [isSubscribed, setIsSubscribed] = useState(initialSubscribed)
    const [loading, setLoading] = useState(false)

    const handleToggle = async () => {
        setLoading(true)
        try {
            const operation = !isSubscribed
            const res = await toggleMealSubscription(meal.id, operation)
            if (res.success) {
                setIsSubscribed(operation)
            }
        } catch (err) {
            alert("Error: " + err.message)
        } finally {
            setLoading(false)
        }
    }

    const dateStr = new Date(meal.date).toLocaleDateString("es-ES", { weekday: 'long', day: 'numeric', month: 'long' })
    const timeStr = new Date(meal.date).toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit' })

    return (
        <div className="order-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: isSubscribed ? 'rgba(16, 185, 129, 0.1)' : 'var(--surface)', borderColor: isSubscribed ? '#10B981' : 'var(--border)' }}>
            <div className="order-info">
                <strong style={{ fontSize: '1.2rem', color: isSubscribed ? '#10B981' : 'var(--text)' }}>
                    {meal.dishName}
                </strong>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginLeft: '0.5rem' }}>
                    ({meal.type === 'ADULT' ? 'Adulto' : 'Niño'})
                </span>
                <div className="order-details" style={{ marginTop: '0.3rem', color: 'var(--text-muted)' }}>
                    📅 {dateStr} a las {timeStr}
                </div>
                <div style={{ marginTop: '0.5rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    Precio: {meal.price.toFixed(2)} €
                </div>
            </div>

            <div>
                <button
                    onClick={handleToggle}
                    disabled={loading}
                    className="btn-primary"
                    style={{
                        backgroundColor: isSubscribed ? '#EF4444' : '#10B981',
                        borderColor: isSubscribed ? '#EF4444' : '#10B981',
                        minWidth: '130px',
                        padding: '0.8rem 1rem'
                    }}
                >
                    {loading ? "..." : isSubscribed ? "Desapuntarse" : "¡Me Apunto!"}
                </button>
            </div>
        </div>
    )
}
