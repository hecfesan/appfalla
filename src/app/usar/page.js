import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import UseTokensForm from "@/components/UseTokensForm"

export default async function UsarPage() {
    const session = await auth()

    if (!session) redirect("/login")
    const isLocalAdminName = session.user.name === "Super Admin Local"
    if (!session.user.isApproved && session.user.role === "CONSUMER" && !isLocalAdminName) redirect("/waiting-approval")

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    })

    return (
        <main className="dashboard">
            <Link href="/" className="nav-link" style={{ display: 'inline-block', marginBottom: '1rem', padding: '0.5rem 0', color: 'var(--primary)' }}>
                &larr; Volver al Panel
            </Link>
            <section className="admin-section">
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Usar Tokens</h3>
                <div className="balance-card" style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Saldo Actual</h2>
                    <div className="balance-amount" style={{ fontSize: '3rem' }}>{user.tokenBalance}</div>
                </div>
                <UseTokensForm currentBalance={user.tokenBalance} />
            </section>
        </main>
    )
}
