import RegisterForm from "@/components/RegisterForm"
import Link from "next/link"

export default function RegisterPage() {
    return (
        <main className="auth-container">
            <div className="auth-card">
                <h1>Crear Cuenta</h1>
                <RegisterForm />
                <p className="auth-switch">
                    ¿Ya tienes cuenta? <Link href="/login">Inicia sesión aquí</Link>
                </p>
            </div>
        </main>
    )
}
