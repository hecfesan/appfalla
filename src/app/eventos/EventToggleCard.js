"use client"

import { useState } from "react"
import { toggleEventSubscription } from "./actions"

export default function EventToggleCard({ event, initiallyEnrolled }) {
    const [isEnrolled, setIsEnrolled] = useState(initiallyEnrolled)
    const [loading, setLoading] = useState(false)

    const handleToggle = async () => {
        setLoading(true)
        try {
            await toggleEventSubscription(event.id, isEnrolled)
            setIsEnrolled(!isEnrolled)
        } catch (error) {
            console.error("Failed to toggle subscription", error)
            alert("No se pudo actualizar tu estado. Intenta de nuevo.")
        } finally {
            setLoading(false)
        }
    }

    const dateStr = new Date(event.date).toLocaleDateString("es-ES", { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })

    return (
        <div style={{
            background: 'var(--surface)',
            padding: '1.25rem',
            borderRadius: '16px',
            border: `1px solid ${isEnrolled ? '#8B5CF6' : 'var(--border)'}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '1rem'
        }}>
            <div>
                <h3 style={{ margin: '0 0 0.25rem 0', color: isEnrolled ? '#8B5CF6' : 'var(--text)', fontSize: '1.2rem' }}>
                    {event.title}
                </h3>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                    📅 {dateStr}
                </div>
                {event.location && (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                        📍 {event.location}
                    </div>
                )}
                {event.description && (
                    <p style={{ marginTop: '0.8rem', marginBottom: '0', fontSize: '0.95rem', color: 'var(--text)' }}>{event.description}</p>
                )}
            </div>

            <button
                onClick={handleToggle}
                disabled={loading}
                className={isEnrolled ? "btn-danger" : "btn-primary"}
                style={{
                    backgroundColor: isEnrolled ? 'transparent' : '#8B5CF6',
                    borderColor: isEnrolled ? '#EF4444' : '#8B5CF6',
                    color: isEnrolled ? '#EF4444' : 'white',
                    padding: '0.6rem 1rem',
                    fontSize: '0.9rem',
                    width: '100%',
                    transition: 'all 0.2s'
                }}
            >
                {loading ? "Actualizando..." : (isEnrolled ? "Desapuntarse" : "¡Me Apunto!")}
            </button>
        </div>
    )
}
