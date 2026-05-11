import Sidebar from "@/components/Sidebar";
import ModalProvider from "@/components/ModalProvider";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clerkUser = await currentUser();
  if (clerkUser) {
    try {
      await prisma.user.upsert({
        where: { clerkId: clerkUser.id },
        update: {
          email: clerkUser.emailAddresses[0]?.emailAddress || "",
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          imageUrl: clerkUser.imageUrl,
        },
        create: {
          clerkId: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress || "",
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          imageUrl: clerkUser.imageUrl,
        }
      });
    } catch (e) {
      console.error("Failed to sync user to neon db", e);
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <ModalProvider />
      <Sidebar />
      <main className="flex-1 ml-64 p-8 relative overflow-hidden">
        {/* Ambient background for dashboard */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
        <div className="relative z-10">{children}</div>
      </main>
    </div>
  );
}
