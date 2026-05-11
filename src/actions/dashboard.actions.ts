"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function getDashboardStats() {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      include: {
        organizationMembers: {
          include: { organization: true }
        }
      }
    });

    if (!dbUser) throw new Error("User not found in DB");

    // Fetch real data (e.g., inventory count, low stock, etc.)
    // For now we'll do basic counts. If there's no organization, we'll return zeroes.
    const orgId = dbUser.organizationMembers[0]?.organizationId;

    let totalProducts = 0;
    let lowStockCount = 0;

    if (orgId) {
      totalProducts = await prisma.product.count({
        where: { inventory: { organizationId: orgId } }
      });

      lowStockCount = await prisma.product.count({
        where: {
          inventory: { organizationId: orgId },
          quantity: { lte: 10 } // Example threshold
        }
      });
    }

    // Mocking revenue since we don't have an invoices/orders table yet
    const revenue = 45231.89; 
    const activeUsers = 1;

    // We generate some chart data based on DB (mocked for revenue)
    const chartData = [
      { name: "Mon", revenue: 4000, users: activeUsers },
      { name: "Tue", revenue: 3000, users: activeUsers },
      { name: "Wed", revenue: 2000, users: activeUsers },
      { name: "Thu", revenue: 2780, users: activeUsers },
      { name: "Fri", revenue: 1890, users: activeUsers },
      { name: "Sat", revenue: 2390, users: activeUsers },
      { name: "Sun", revenue: 3490, users: activeUsers },
    ];

    return {
      success: true,
      data: {
        revenue,
        totalProducts,
        lowStockCount,
        activeUsers,
        chartData
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
