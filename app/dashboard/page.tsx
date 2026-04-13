import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import DashboardForm from "@/components/DashboardForm";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const cards = await prisma.weddingCard.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      customerName: true,
      customerEmail: true,
      customerPhone: true,
      brideFullName: true,
      groomFullName: true,
      eventDate: true,
      eventTime: true,
      isPublished: true,
      createdAt: true
    }
  });

  return (
    <main className="container" style={{ padding: "30px 0 60px" }}>
      <div
        className="topbar"
        style={{ border: 0, background: "transparent", marginBottom: 20 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap"
          }}
        >
          <div>
            <h1 className="page-title" style={{ marginBottom: 6 }}>
              Dashboard
            </h1>
            <p className="muted" style={{ margin: 0 }}>
              Logged in as {session.user.name} ({(session.user as any).username})
            </p>
          </div>

          <LogoutButton />
        </div>
      </div>

      <DashboardForm
        initialCards={cards.map((c) => ({
          ...c,
          createdAt: c.createdAt.toISOString()
        }))}
      />
    </main>
  );
}