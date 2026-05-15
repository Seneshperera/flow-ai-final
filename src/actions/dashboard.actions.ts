"use server";

import prisma from "@/lib/prisma";
import { getActiveOrgId } from "@/lib/org-context";
import { startOfDay, subDays } from "date-fns";

export async function getDashboardStats() {
  try {
    const orgId = await getActiveOrgId();

    // 1. Total Products
    const totalProducts = await prisma.product.count({
      where: { organizationId: orgId }
    });

    // 2. Low Stock Count
    const lowStockCount = await prisma.inventory.count({
      where: {
        organizationId: orgId,
        quantity: { lte: 10 } // Using 10 as default threshold
      }
    });

    // 3. Total Revenue & Profit (Last 30 days)
    const thirtyDaysAgo = subDays(new Date(), 30);
    const sales = await prisma.sale.findMany({
      where: {
        organizationId: orgId,
        createdAt: { gte: thirtyDaysAgo }
      }
    });
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalProfit = sales.reduce((sum, sale) => sum + sale.profit, 0);

    // 4. Expenses
    const expenses = await prisma.expense.findMany({
      where: {
        organizationId: orgId,
        date: { gte: thirtyDaysAgo }
      }
    });
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // 5. Net Profit
    const netProfit = totalProfit - totalExpenses;

    // 6. Active Users (Org Members)
    const activeUsers = await prisma.organizationMember.count({
      where: { organizationId: orgId }
    });

    // 7. Chart Data (Last 7 days)
    const sevenDaysAgo = startOfDay(subDays(new Date(), 6));
    const recentSales = await prisma.sale.findMany({
      where: {
        organizationId: orgId,
        createdAt: { gte: sevenDaysAgo }
      }
    });

    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayStart = startOfDay(date);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const daySales = recentSales.filter(s => s.createdAt >= dayStart && s.createdAt <= dayEnd);
      const dayRevenue = daySales.reduce((sum, sale) => sum + sale.totalAmount, 0);
      const dayProfit = daySales.reduce((sum, sale) => sum + sale.profit, 0);

      chartData.push({
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        revenue: dayRevenue,
        profit: dayProfit,
        users: activeUsers
      });
    }

    return {
      success: true,
      data: {
        revenue: totalRevenue,
        profit: netProfit,
        totalProducts,
        lowStockCount,
        activeUsers,
        chartData
      }
    };
  } catch (error: any) {
    console.error("Dashboard Stats Error:", error);
    return { success: false, error: error.message };
  }
}
