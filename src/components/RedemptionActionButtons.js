"use client"

import { useTransition } from "react"
import { validateRedemption, rejectRedemption } from "@/app/admin/canjes/actions"

export default function RedemptionActionButtons({ id }) {
    const [isPending, startTransition] = useTransition()

    return (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
                onClick={() => startTransition(() => validateRedemption(id))}
                disabled={isPending}
                className="btn-success"
            >
                {isPending ? "..." : "Validar Canje"}
            </button>
            <button
                onClick={() => startTransition(() => rejectRedemption(id))}
                disabled={isPending}
                className="btn-outline"
                style={{ borderColor: 'var(--error)', color: 'var(--error)' }}
            >
                {isPending ? "..." : "Rechazar"}
            </button>
        </div>
    )
}
