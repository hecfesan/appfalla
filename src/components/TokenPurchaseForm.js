"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function TokenPurchaseForm() {
    const [tokens, setTokens] = useState(1)
    const [isManual, setIsManual] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState("CASH")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const router = useRouter()

    const presets = [1, 2, 5, 10, 20]

    const handleCreateOrder = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess("")

        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tokensAmount: tokens,
                    paymentMethod,
                }),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Error al crear el pedido")

            setSuccess("Pedido creado correctamente. Esperando validación.")
            router.refresh()
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleCreateOrder} className="purchase-form">
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="form-section">
                <h4>Selecciona la cantidad de tokens</h4>
                <div className="token-presets">
                    {presets.map(amount => (
                        <button
                            type="button"
                            key={amount}
                            className={`preset-btn ${!isManual && tokens === amount ? 'active' : ''}`}
                            onClick={() => {
                                setTokens(amount)
                                setIsManual(false)
                            }}
                        >
                            {amount}
                        </button>
                    ))}
                    <button
                        type="button"
                        className={`preset-btn ${isManual ? 'active' : ''}`}
                        onClick={() => setIsManual(true)}
                    >
                        Otra
                    </button>
                </div>

                {isManual && (
                    <div className="manual-input mt-4">
                        <input
                            type="number"
                            min="1"
                            max="1000"
                            value={tokens}
                            onChange={(e) => setTokens(Number(e.target.value))}
                        />
                    </div>
                )}
            </div>

            <div className="form-section">
                <h4>Método de pago</h4>
                <div className="payment-options">
                    <label className="payment-label">
                        <input
                            type="radio"
                            name="payment"
                            value="CASH"
                            checked={paymentMethod === "CASH"}
                            onChange={() => setPaymentMethod("CASH")}
                        />
                        <span>Efectivo</span>
                    </label>
                    <label className="payment-label disabled">
                        <input
                            type="radio"
                            name="payment"
                            value="ONLINE"
                            disabled
                        />
                        <span className="disabled-text">Online (Deshabilitado)</span>
                    </label>
                </div>
            </div>

            <button type="submit" disabled={loading || !tokens || tokens <= 0} className="btn-primary w-full mt-4">
                {loading ? "Procesando..." : "Comprar Tokens"}
            </button>
        </form>
    )
}
