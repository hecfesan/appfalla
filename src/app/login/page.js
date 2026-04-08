import LoginForm from "@/components/LoginForm"
import Link from "next/link"

export default function LoginPage() {
    return (
        <main className="auth-container">
            <div className="auth-card">
                <h1>Iniciar Sesión</h1>
                <LoginForm />
                <p className="auth-switch">
                    ¿No tienes cuenta? <Link href="/register">Regístrate aquí</Link>
                </p>
            </div>
        </main>
    )
}
