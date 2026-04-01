"use client"

import { useState } from "react"
import { toggleEventSubscription } from "./actions"

export default function EventToggleCard({ event, initiallyEnrolled, initialMealSubs = [] }) {
    const [isEnrolled, setIsEnrolled] = useState(initiallyEnrolled)
    const [loading, setLoading] = useState(false)
    
    // Initialize meal counts from existing subs or defaults
    const [mealSelections, setMealSelections] = useState(
        event.meals.map(meal => {
            const existing = initialMealSubs.find(s => s.mealId === meal.id)
            return {
                mealId: meal.id,
                dishName: meal.dishName,
                adultCount: existing ? existing.adultCount : 0,
                childCount: existing ? existing.childCount : 0,
                selected: !!existing
            }
        })
    )

    const handleToggle = async () => {
        setLoading(true)
        try {
            const data = {
                eventId: event.id,
                isEnrolled: isEnrolled,
                meals: mealSelections.filter(m => m.selected).map(m => ({
                    mealId: m.mealId,
                    adultCount: m.adultCount,
                    childCount: m.childCount
                }))
            }
            await toggleEventSubscription(data)
            setIsEnrolled(!isEnrolled)
        } catch (error) {
            console.error("Failed to toggle subscription", error)
            alert(error.message || "No se pudo actualizar tu estado. Intenta de nuevo.")
        } finally {
            setLoading(false)
        }
    }

    const updateMeal = (idx, field, val) => {
        const newMeals = [...mealSelections]
        newMeals[idx][field] = val
        if (field === 'adultCount' || field === 'childCount') {
            if (val > 0) newMeals[idx].selected = true
        }
        setMealSelections(newMeals)
    }

    const totalPrice = mealSelections
        .filter(m => m.selected)
        .reduce((acc, m) => {
            const mealData = event.meals.find(em => em.id === m.mealId)
            return acc + (m.adultCount * (mealData?.adultPrice || 0)) + (m.childCount * (mealData?.childPrice || 0))
        }, 0)

    const eventDate = new Date(event.date)
    const now = new Date()
    const diffTime = eventDate - now
    const diffDays = diffTime / (1000 * 60 * 60 * 24)
    const isLocked = isEnrolled && diffDays < 3

    const dateStr = eventDate.toLocaleDateString("es-ES", { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })

    return (
        <div style={{
            background: 'var(--surface)',
            padding: '1.25rem',
            borderRadius: '16px',
            border: `1px solid ${isEnrolled ? '#8B5CF6' : 'var(--border)'}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '1rem',
            opacity: isLocked ? 0.8 : 1,
            position: 'relative'
        }}>
            {/* Total Price Badge */}
            {totalPrice > 0 && (
                <div style={{
                    position: 'absolute',
                    top: '1.25rem',
                    right: '1.25rem',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    color: '#8B5CF6',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    zIndex: 2
                }}>
                    Total: {totalPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                </div>
            )}
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
                    <p style={{ marginTop: '0.8rem', marginBottom: '1rem', fontSize: '0.95rem', color: 'var(--text)' }}>{event.description}</p>
                )}
            </div>

            {/* Meals Section */}
            {event.meals && event.meals.length > 0 && (
                <div style={{ backgroundColor: 'rgba(139, 92, 246, 0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.1)' }}>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        🍴 ¿Te quedas a comer?
                    </h4>
                    {mealSelections.map((meal, idx) => (
                        <div key={meal.mealId} style={{ marginBottom: idx < mealSelections.length - 1 ? '1rem' : 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <input 
                                    type="checkbox" 
                                    checked={meal.selected} 
                                    disabled={isLocked}
                                    onChange={(e) => updateMeal(idx, 'selected', e.target.checked)}
                                    id={`meal-${meal.mealId}`}
                                />
                                <label htmlFor={`meal-${meal.mealId}`} style={{ fontWeight: '500', fontSize: '0.9rem' }}>{meal.dishName}</label>
                            </div>
                            
                            {meal.selected && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', paddingLeft: '1.5rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                                            Adultos
                                            {event.meals.find(m => m.id === meal.mealId)?.adultPrice > 0 && (
                                                <span style={{ 
                                                    backgroundColor: 'rgba(139, 92, 246, 0.1)', 
                                                    color: '#8B5CF6', 
                                                    padding: '0.1rem 0.4rem', 
                                                    borderRadius: '8px', 
                                                    fontSize: '0.7rem',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {event.meals.find(m => m.id === meal.mealId)?.adultPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                                                </span>
                                            )}
                                        </label>
                                        <input 
                                            type="number" 
                                            min="0" 
                                            value={meal.adultCount} 
                                            disabled={isLocked}
                                            onChange={(e) => updateMeal(idx, 'adultCount', parseInt(e.target.value) || 0)}
                                            style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                                            Niños
                                            {event.meals.find(m => m.id === meal.mealId)?.childPrice > 0 && (
                                                <span style={{ 
                                                    backgroundColor: 'rgba(34, 197, 94, 0.1)', 
                                                    color: '#16a34a', 
                                                    padding: '0.1rem 0.4rem', 
                                                    borderRadius: '8px', 
                                                    fontSize: '0.7rem',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {event.meals.find(m => m.id === meal.mealId)?.childPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                                                </span>
                                            )}
                                        </label>
                                        <input 
                                            type="number" 
                                            min="0" 
                                            value={meal.childCount} 
                                            disabled={isLocked}
                                            onChange={(e) => updateMeal(idx, 'childCount', parseInt(e.target.value) || 0)}
                                            style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {isLocked && (
                <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', textAlign: 'center' }}>
                    ⚠️ Inscripción bloqueada (quedan menos de 3 días)
                </div>
            )}

            <button
                onClick={handleToggle}
                disabled={loading || isLocked}
                className={isEnrolled ? "btn-danger" : "btn-primary"}
                style={{
                    backgroundColor: isEnrolled ? 'transparent' : '#8B5CF6',
                    borderColor: isEnrolled ? (isLocked ? 'var(--border)' : '#EF4444') : '#8B5CF6',
                    color: isEnrolled ? (isLocked ? 'var(--text-muted)' : '#EF4444') : 'white',
                    padding: '0.6rem 1rem',
                    fontSize: '0.9rem',
                    width: '100%',
                    transition: 'all 0.2s',
                    cursor: (loading || isLocked) ? 'not-allowed' : 'pointer'
                }}
            >
                {loading ? "Actualizando..." : (isEnrolled ? "Modificar / Desapuntarse" : "Confirmar Asistencia")}
            </button>
        </div>
    )
}
