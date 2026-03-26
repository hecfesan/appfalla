import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import PrintButton from "@/components/PrintButton"

export default async function GlobalMealSummary() {
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
        redirect("/")
    }

    const meals = await prisma.meal.findMany({
        include: {
            subscriptions: {
                include: { user: true },
                orderBy: { createdAt: "asc" }
            }
        },
        orderBy: { date: "asc" }
    })

    const totalExpectedMoney = meals.reduce((sum, meal) => sum + (meal.price * meal.subscriptions.length), 0)
    const totalAttendees = meals.reduce((sum, meal) => sum + meal.subscriptions.length, 0)

    return (
        <main className="dashboard" style={{ maxWidth: '900px' }}>
            <style>{`
                @media print {
                    .print-hide { display: none !important; }
                    .dashboard { padding: 0 !important; max-width: 100% !important; margin: 0 !important; }
                    .table-container { box-shadow: none !important; margin-top: 2rem; }
                    table { border-collapse: collapse; width: 100%; font-size: 12pt; }
                    th, td { border: 1px solid #000; padding: 6px; text-align: left; }
                    h2 { margin-top: 2rem; page-break-after: avoid; }
                }
                .table-container { margin-top: 1rem; overflow-x: auto; border: 1px solid var(--border); border-radius: 8px; }
                table { width: 100%; border-collapse: collapse; background: var(--card-bg); }
                th { background: rgba(0,0,0,0.05); padding: 12px; text-align: left; border-bottom: 2px solid var(--border); font-size: 0.9rem; text-transform: uppercase; color: var(--text-muted); }
                td { padding: 12px; border-bottom: 1px solid var(--border); }
                tr:last-child td { border-bottom: none; }
            `}</style>
            
            <div className="print-hide" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <Link href="/admin/comidas" className="nav-link" style={{ padding: '0.5rem 0', color: '#10B981' }}>
                    &larr; Volver a Gestión de Comidas
                </Link>
                <PrintButton />
            </div>

            <header className="dashboard-header text-center">
                <h1 style={{ fontSize: '2rem' }}>Resumen Global de Comidas</h1>
                <p className="text-muted">Listado consolidado de apuntados y recaudación</p>
                
                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'center' }} className="print-hide">
                    <div className="balance-card" style={{ flex: '0 1 250px', borderColor: '#10B981' }}>
                        <h2 style={{ fontSize: "1rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Total Apuntados</h2>
                        <div className="balance-amount" style={{ color: '#10B981', fontSize: '2rem' }}>{totalAttendees}</div>
                    </div>
                    <div className="balance-card" style={{ flex: '0 1 250px', borderColor: '#F59E0B' }}>
                        <h2 style={{ fontSize: "1rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Recaudación Total</h2>
                        <div className="balance-amount" style={{ color: '#F59E0B', fontSize: '2rem' }}>{totalExpectedMoney.toFixed(2)} €</div>
                    </div>
                </div>
            </header>

            {meals.length === 0 ? (
                <p className="empty-state">No hay comidas programadas.</p>
            ) : (
                <div style={{ marginTop: '3rem' }}>
                    {meals.map(meal => {
                        if (meal.subscriptions.length === 0) return null;
                        
                        return (
                            <div key={meal.id} style={{ marginBottom: '3rem', pageBreakInside: 'avoid' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem', borderBottom: '2px solid var(--primary)', paddingBottom: '0.5rem' }}>
                                    <div>
                                        <h2 style={{ fontSize: '1.4rem', margin: 0 }}>{meal.dishName}</h2>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                                            {meal.date.toLocaleDateString("es-ES", { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })} • Menú {meal.type === 'ADULT' ? 'Adulto' : 'Niño'}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ fontWeight: 'bold' }}>{meal.subscriptions.length} pax</span> • {((meal.subscriptions.length * meal.price)).toFixed(2)} €
                                    </div>
                                </div>
                                
                                <div className="table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th style={{ width: '50px' }}>Nº</th>
                                                <th>Nombre completo</th>
                                                <th>Usuario</th>
                                                <th style={{ width: '100px' }}>ID Fallero</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {meal.subscriptions.map((sub, index) => (
                                                <tr key={sub.id}>
                                                    <td style={{ fontWeight: 'bold', color: 'var(--text-muted)' }}>{index + 1}</td>
                                                    <td>{sub.user.name}</td>
                                                    <td style={{ color: 'var(--text-muted)' }}>@{sub.user.username}</td>
                                                    <td style={{ fontFamily: 'monospace' }}>#{sub.user.numericId}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </main>
    )
}
