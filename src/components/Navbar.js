import Link from "next/link"
import { auth } from "@/auth"
import LogoutButton from "./LogoutButton"

export default async function Navbar() {
    const session = await auth()

    if (!session || !session.user) return null

    const { role, isApproved } = session.user
    const showMenu = isApproved === true

    return (
        <nav className="navbar">
            <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
                <img src="/logo.svg" alt="Logo Falla" width={40} height={40} style={{ objectFit: 'contain' }} />
                
                {showMenu ? (
                    <>
                        <Link href="/" className="nav-link">Inicio</Link>
                        <Link href="/eventos" className="nav-link">Eventos</Link>
                        <Link href="/perfil" className="nav-link">Mi Perfil</Link>
                        <Link href="/historial" className="nav-link">Historial</Link>
                        {(role === "ADMIN" || role === "SUPER_ADMIN") && (
                            <Link href="/admin" className="nav-link">Admin</Link>
                        )}
                        {role === "SUPER_ADMIN" && (
                            <Link href="/superadmin" className="nav-link">Super Admin</Link>
                        )}
                    </>
                ) : (
                    <span className="nav-link" style={{ opacity: 0.5 }}>Cuenta pendiente</span>
                )}
            </div>
            <LogoutButton />
        </nav>
    )
}
