"use client"

import { useState } from "react"
import { approveUserAction, rejectUserAction } from "./actions"

export default function UserApprovalControls({ userId }) {
    const [loading, setLoading] = useState(false)

    const handleApprove = async () => {
        if (!confirm("¿Deseas activar el acceso para este usuario?")) return
        setLoading(true)
        try {
            await approveUserAction(userId)
        } catch (error) {
            alert("Error al aprobar usuario")
        } finally {
            setLoading(false)
        }
    }

    const handleReject = async () => {
        if (!confirm("¿Deseas rechazar y eliminar esta solicitud de registro?")) return
        setLoading(true)
        try {
            await rejectUserAction(userId)
        } catch (error) {
            alert("Error al rechazar usuario")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
                onClick={handleReject} 
                disabled={loading}
                className="btn-outline" 
                style={{ borderColor: 'var(--error)', color: 'var(--error)', fontSize: '0.85rem' }}
            >
                {loading ? '...' : '❌ Rechazar'}
            </button>
            <button 
                onClick={handleApprove} 
                disabled={loading}
                className="btn-primary" 
                style={{ backgroundColor: 'var(--success)', borderColor: 'var(--success)', fontSize: '0.85rem' }}
            >
                {loading ? '...' : '✅ Aprobar Acceso'}
            </button>
        </div>
    )
}
