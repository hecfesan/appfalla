"use client"

export default function PrintButton() {
    return (
        <button 
            onClick={() => window.print()} 
            className="btn-primary" 
            style={{ backgroundColor: 'var(--text-muted)', borderColor: 'var(--text-muted)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}
        >
            🖨️ Imprimir Lista
        </button>
    )
}
