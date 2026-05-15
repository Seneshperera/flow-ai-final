"use server";

import prisma from "@/lib/prisma";
import { getActiveOrgId } from "@/lib/org-context";
import { revalidatePath } from "next/cache";

export async function getCustomers() {
  try {
    const orgId = await getActiveOrgId();
    return await prisma.customer.findMany({
      where: { organizationId: orgId },
      include: {
        sales: true,
        payments: true,
      },
      orderBy: { name: "asc" },
    });
  } catch (error: any) {
    console.error("Get Customers Error:", error);
    return [];
  }
}

export async function addCustomer(data: {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}) {
  try {
    const orgId = await getActiveOrgId();
    const customer = await prisma.customer.create({
      data: {
        ...data,
        organizationId: orgId,
      },
    });
    revalidatePath("/customers");
    return { success: true, data: customer };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function addDuePayment(data: {
  customerId: string;
  amount: number;
  paymentMethod: string;
  note?: string;
}) {
  try {
    const orgId = await getActiveOrgId();
    
    // Atomic Transaction for payment and balance update
    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.duePayment.create({
        data: {
          customerId: data.customerId,
          amount: data.amount,
          paymentMethod: data.paymentMethod,
          note: data.note,
        },
      });

      await tx.customer.update({
        where: { id: data.customerId },
        data: { balance: { decrement: data.amount } },
      });

      return payment;
    });

    revalidatePath("/customers");
    revalidatePath("/pos");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
