import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession(authOptions as any);
	if (!session || (session.user as any)?.role !== "admin") redirect("/sign-in");
	return <section className="space-y-6">{children}</section>;
}
