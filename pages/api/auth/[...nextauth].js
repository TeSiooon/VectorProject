import NextAuth from "next-auth";
import client from "../../../lib/prismadb";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      type: "credentials",
      name: "Email",
      async authorize(credentials, req) {
        const isEmailValid = await client.user.findUnique({
          where: {
            email: credentials.email,
          },
          include: {
            images: true,
          },
        });

        if (!isEmailValid) {
          throw new Error("Niewlasciwy email");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          isEmailValid.password
        );

        if (!isPasswordValid) {
          throw new Error("Nieprawidlowe haslo");
        }
        delete isEmailValid.password;
        return isEmailValid;
      },
    }),
  ],
  pages: {
    signIn: "/auth/credentials-signin",
  },
  callbacks: {
    async session({ session, user, token }) {
      if (token.user) {
        session.user = { ...token.user };
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.user = { ...user };
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);
