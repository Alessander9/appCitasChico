import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";

/** Protege todo /admin: solo admins pasan. */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin");
  if (session.role !== "admin") redirect("/");

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
