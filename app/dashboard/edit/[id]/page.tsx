import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import EditCardForm from "@/components/EditCardForm";

export default async function EditCardPage({
  params
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const card = await prisma.weddingCard.findUnique({
    where: { id: params.id }
  });

  if (!card) {
    notFound();
  }

  return (
    <main className="container" style={{ padding: "30px 0 60px" }}>
      <div style={{ marginBottom: 20 }}>
        <Link href="/dashboard" className="btn-secondary" style={{ width: "auto" }}>
          Back to Dashboard
        </Link>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h1 className="page-title">Edit Wedding Card</h1>
        <p className="muted">
          Update customer information, wedding details, public link content, and enquiry info.
        </p>
      </div>

      <EditCardForm card={card} />
    </main>
  );
}
