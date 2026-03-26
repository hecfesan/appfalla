"use client"

import { useTransition } from "react"
import { makeAdmin } from "@/app/superadmin/actions"

export default function MakeAdminButton({ userId }) {
    const [isPending, startTransition] = useTransition()

    return (
        <button
            onClick={() => startTransition(() => makeAdmin(userId))}
            disabled={isPending}
            className="btn-outline"
        >
            {isPending ? "Procesando..." : "Hacer Administrador"}
        </button>
    )
}
