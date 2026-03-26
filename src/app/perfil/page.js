import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ProfileForm from "@/components/ProfileForm"
import Link from "next/link"

export default async function PerfilPage() {
    const session = await auth()

    if (!session) redirect("/login")

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    })

    return (
        <main className="dashboard">
            <Link href="/" className="nav-link" style={{ display: 'inline-block', marginBottom: '1rem', padding: '0.5rem 0', color: 'var(--primary)' }}>
                &larr; Volver al Panel
            </Link>
            <section className="admin-section">
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Mis Datos Personales</h3>
                <ProfileForm user={user} />
            </section>
        </main>
    )
}
