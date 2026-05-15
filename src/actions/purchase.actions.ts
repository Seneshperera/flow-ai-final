"use server";

import prisma from "@/lib/prisma";
import { getActiveOrgId } from "@/lib/org-context";
import { revalidatePath } from "next/cache";

// SUPPLIERS
export async function getSuppliers() {
  try {
    const orgId = await getActiveOrgId();
    return await prisma.supplier.findMany({
      where: { organizationId: orgId },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    return [];
  }
}

export async function addSupplier(data: {
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
}) {
  try {
    const orgId = await getActiveOrgId();
    const supplier = await prisma.supplier.create({
      data: {
        ...data,
        organizationId: orgId,
      },
    });
    revalidatePath("/inventory");
    return { success: true, data: supplier };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// BRANDS
export async function getBrands() {
  try {
    const orgId = await getActiveOrgId();
    return await prisma.brand.findMany({
      where: { organizationId: orgId },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    return [];
  }
}

export async function addBrand(name: string) {
  try {
    const orgId = await getActiveOrgId();
    const brand = await prisma.brand.create({
      data: {
        name,
        organizationId: orgId,
      },
    });
    revalidatePath("/inventory");
    return { success: true, data: brand };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// PURCHASE ORDERS
export async function createPurchaseOrder(data: {
  supplierId: string;
  items: {
    productId: string;
    quantity: number;
    unitCost: number;
  }[];
}) {
  try {
    const orgId = await getActiveOrgId();
    
    const totalAmount = data.items.reduce((acc, item) => acc + (item.quantity * item.unitCost), 0);
    
    const order = await prisma.$transaction(async (tx) => {
      const po = await tx.purchaseOrder.create({
        data: {
          orderNumber: `PO-${Date.now()}`,
          supplierId: data.supplierId,
          organizationId: orgId,
          totalAmount,
          status: "RECEIVED", // Automatically received for this simplified flow
          items: {
            create: data.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              unitCost: item.unitCost,
              total: item.quantity * item.unitCost
            }))
          }
        }
      });

      // Update inventory for each product
      for (const item of data.items) {
        await tx.inventory.updateMany({
          where: {
            productId: item.productId,
            organizationId: orgId
          },
          data: {
            quantity: {
              increment: item.quantity
            }
          }
        });

        // Update product cost
        await tx.product.update({
          where: { id: item.productId },
          data: {
            cost: item.unitCost
          }
        });
      }

      return po;
    });

    revalidatePath("/inventory");
    return { success: true, data: order };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
