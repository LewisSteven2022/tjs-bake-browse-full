import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

export const authOptions: NextAuthOptions = {
	session: { strategy: "jwt" },
	providers: [
		Credentials({
			name: "Email & Password",
			credentials: {
				email: { label: "Email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(creds) {
				const parsed = schema.safeParse(creds);
				if (!parsed.success) return null;
				const { email, password } = parsed.data;
				const { data, error } = await db.oneUserByEmail(email);
				if (error || !data) return null;
				const ok = await bcrypt.compare(password, data.password_hash);
				if (!ok) return null;
				return {
					id: data.id,
					email: data.email,
					name: data.name,
					role: data.role,
				};
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }: any) {
			if (user) {
				token.role = (user as any).role;
				// Ensure we carry the user id through to the session
				token.id = (user as any).id;
			}
			return token;
		},
		async session({ session, token }: any) {
			(session.user as any).role = token.role;
			// Expose id on session.user for server routes
			(session.user as any).id = (token as any).id || (token as any).sub;
			return session;
		},
	},
};
