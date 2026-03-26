"use client"

import { useState } from "react"
import { deleteEventAction } from "./crear/actions"

export default function DeleteEventButton({ eventId, eventTitle }) {
    const [loading, setLoading] = useState(false)

    const handleDelete = async (e) => {
        // Prevent clicking the Link wrapper of the card
        e.preventDefault()
        e.stopPropagation()

        if (!confirm(`¿Estás seguro de que quieres eliminar el evento "${eventTitle}"? Se borrarán también todas las suscripciones.`)) {
            return
        }

        setLoading(true)
        try {
            const res = await deleteEventAction(eventId)
            if (!res.success) {
                alert("Error al eliminar el evento")
            }
        } catch (error) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <button 
            onClick={handleDelete}
            disabled={loading}
            style={{ 
                padding: '0.4rem 0.8rem', 
                backgroundColor: '#EF4444', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                fontSize: '0.8rem',
                cursor: 'pointer',
                opacity: loading ? 0.7 : 1,
                marginLeft: '1rem'
            }}
        >
            {loading ? "Borrando..." : "Borrar"}
        </button>
    )
}
