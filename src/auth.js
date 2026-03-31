import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: { username: credentials.username }
                })

                if (!user) {
                    return null
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                )

                if (!isPasswordValid) {
                    return null
                }

                return {
                    id: user.id,
                    username: user.username,
                    name: user.name,
                    role: user.role,
                    isApproved: user.isApproved,
                }
            }
        })
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = user.role
                token.username = user.username
                token.isApproved = user.isApproved
            }
            return token
        },
        session({ session, token }) {
            if (session.user && token) {
                session.user.id = token.id
                session.user.role = token.role
                session.user.username = token.username
                session.user.isApproved = token.isApproved
            }
            return session
        }
    },
    pages: {
        signIn: '/login',
    },
    session: { strategy: "jwt" }
})
