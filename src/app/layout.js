import "./globals.css"
import Navbar from "@/components/Navbar"

export const metadata = {
  title: "Token App",
  description: "Compra y valida tokens de forma sencilla",
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
