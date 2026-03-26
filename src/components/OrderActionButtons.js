"use client"

import { useTransition } from "react"
import { validateOrder, rejectOrder } from "@/app/admin/actions"

export default function OrderActionButtons({ orderId }) {
    const [isPending, startTransition] = useTransition()

    return (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
                onClick={() => startTransition(() => validateOrder(orderId))}
                disabled={isPending}
                className="btn-success"
            >
                {isPending ? "..." : "Validar"}
            </button>
            <button
                onClick={() => startTransition(() => rejectOrder(orderId))}
                disabled={isPending}
                className="btn-outline"
                style={{ borderColor: 'var(--error)', color: 'var(--error)' }}
            >
                {isPending ? "..." : "Rechazar"}
            </button>
        </div>
    )
}
