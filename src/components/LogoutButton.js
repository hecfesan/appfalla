"use client"

import { signOut } from "next-auth/react"

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="nav-link"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
        >
            Salir
        </button>
    )
}
