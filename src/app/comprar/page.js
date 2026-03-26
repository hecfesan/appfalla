import { auth } from "@/auth"
import { redirect } from "next/navigation"
import TokenPurchaseForm from "@/components/TokenPurchaseForm"
import Link from "next/link"

export default async function ComprarPage() {
    const session = await auth()

    if (!session) redirect("/login")

    return (
        <main className="dashboard">
            <Link href="/" className="nav-link" style={{ display: 'inline-block', marginBottom: '1rem', padding: '0.5rem 0', color: 'var(--primary)' }}>
                &larr; Volver al Panel
            </Link>
            <section className="purchase-section">
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Comprar Tokens</h3>
                <TokenPurchaseForm />
            </section>
        </main>
    )
}
