"use server"

import prisma from "@/lib/prisma";
import { getActiveOrgId } from "@/lib/org-context";

export async function getPOSProducts() {
  const orgId = await getActiveOrgId();

  return await prisma.product.findMany({
    where: { organizationId: orgId },
    include: { inventories: true },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getCustomers() {
  const orgId = await getActiveOrgId();

  return await prisma.customer.findMany({
    where: { organizationId: orgId },
    orderBy: { name: 'asc' }
  });
}

export async function createSale(data: {
  total: number;
  tax: number;
  discount: number;
  paymentMethod: string;
  amountPaid: number;
  customerId?: string;
  items: { productId: string; quantity: number; price: number; cost: number }[];
  delivery?: {
    personnelName?: string;
    personnelPhone?: string;
    address?: string;
  };
}) {
  const orgId = await getActiveOrgId();

  // Calculate profit: Sum of (price - cost) * quantity
  const profit = data.items.reduce((acc, item) => acc + ((item.price - (item.cost || 0)) * item.quantity), 0) - data.discount;

  return await prisma.$transaction(async (tx) => {
    // 1. Create Sale
    const sale = await tx.sale.create({
      data: {
        totalAmount: data.total,
        tax: data.tax,
        discount: data.discount,
        profit: profit,
        paymentMethod: data.paymentMethod,
        organizationId: orgId,
        customerId: data.customerId,
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            cost: item.cost
          }))
        }
      }
    });

    // 2. Handle Delivery if requested
    if (data.delivery) {
      await tx.delivery.create({
        data: {
          saleId: sale.id,
          personnelName: data.delivery.personnelName,
          personnelPhone: data.delivery.personnelPhone,
          deliveryAddress: data.delivery.address,
          status: "PENDING"
        }
      });
    }

    // 3. Handle Dues if it's a partial payment
    if (data.customerId && data.amountPaid < data.total) {
      const dueAmount = data.total - data.amountPaid;
      await tx.customer.update({
        where: { id: data.customerId },
        data: { balance: { increment: dueAmount } }
      });
    }

    // 4. Update Inventory
    for (const item of data.items) {
      const inventory = await tx.inventory.findFirst({
        where: { productId: item.productId, organizationId: orgId }
      });

      if (inventory) {
        await tx.inventory.update({
          where: { id: inventory.id },
          data: { quantity: { decrement: item.quantity } }
        });
      }
    }

    return sale;
  });
}
