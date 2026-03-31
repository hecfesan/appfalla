import LoginForm from "@/components/LoginForm"
import Link from "next/link"

export default function LoginPage() {
    return (
        <main className="auth-container">
            <div className="auth-card">
                <h1>Iniciar Sesión</h1>
                <LoginForm />
                <p className="auth-switch">
                    <Link href="/forgot-password" style={{ color: 'var(--primary)', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>
                        ¿Olvidaste tu contraseña?
                    </Link>
                    ¿No tienes cuenta? <Link href="/register">Regístrate aquí</Link>
                </p>
            </div>
        </main>
    )
}
