import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // For demo purposes - accept any password for known emails
        const demoUsers = [
          { id: '1', email: 'admin@example.com', name: 'Admin User', role: 'ADMIN' },
          { id: '2', email: 'operator@example.com', name: 'Security Operator', role: 'OPERATOR' },
          { id: '3', email: 'viewer@example.com', name: 'Viewer User', role: 'VIEWER' },
        ]

        const demoUser = demoUsers.find(u => u.email === credentials.email)
        if (demoUser) {
          return {
            id: demoUser.id,
            email: demoUser.email,
            name: demoUser.name,
            role: demoUser.role,
          }
        }

        // Try database lookup as fallback
        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          if (user) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            }
          }
        } catch (error) {
          console.log('Database error, using demo mode:', error)
        }

        return null
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
}
