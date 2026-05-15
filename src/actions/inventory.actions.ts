"use server";

import prisma from "@/lib/prisma";
import { Product as UIProduct } from "@/store/useInventoryStore";
import { getActiveOrgId } from "@/lib/org-context";
import { revalidatePath } from "next/cache";

async function getOrgId() {
  return await getActiveOrgId();
}

export async function getInventoryAction() {
  try {
    const orgId = await getOrgId();
    
    const dbProducts = await prisma.product.findMany({
      where: { organizationId: orgId },
      include: {
        inventories: true,
        supplier: true,
        brand: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const products: UIProduct[] = dbProducts.map((p: any) => {
      const stock = p.inventories[0]?.quantity || 0;
      let status: "In Stock" | "Low Stock" | "Out of Stock" = "In Stock";
      if (stock === 0) status = "Out of Stock";
      else if (stock <= (p.inventories[0]?.lowStockAlert || 10)) status = "Low Stock";

      return {
        id: p.id,
        sku: p.sku,
        name: p.name,
        category: p.category || "General",
        stock: stock,
        status: status,
        price: p.price,
        cost: p.cost,
        supplier: p.supplier?.name || "Unknown",
        trend: (p.trend as "up" | "down") || "up"
      };
    });

    return { success: true, data: products };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function addProductAction(product: Omit<UIProduct, "id">) {
  try {
    const orgId = await getOrgId();

    // Find or create supplier if provided
    let supplierId: string | undefined;
    if (product.supplier) {
      const supplier = await prisma.supplier.findFirst({
        where: { name: product.supplier, organizationId: orgId }
      }) || await prisma.supplier.create({
        data: { name: product.supplier, organizationId: orgId }
      });
      supplierId = supplier.id;
    }

    const created = await prisma.$transaction(async (tx) => {
      return await tx.product.create({
        data: {
          sku: product.sku,
          name: product.name,
          price: product.price,
          cost: product.cost,
          category: product.category,
          supplierId: supplierId,
          trend: product.trend,
          organizationId: orgId,
          inventories: {
            create: {
              quantity: product.stock,
              organizationId: orgId
            }
          }
        },
        include: { inventories: true }
      });
    });

    revalidatePath("/inventory");
    revalidatePath("/pos");

    const stock = created.inventories[0]?.quantity || 0;
    return { 
      success: true, 
      data: {
        ...product,
        id: created.id,
        stock
      } 
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateProductAction(id: string, data: Partial<UIProduct>) {
  try {
    const orgId = await getOrgId();
    const productUpdate: any = {};
    if (data.name) productUpdate.name = data.name;
    if (data.sku) productUpdate.sku = data.sku;
    if (data.price) productUpdate.price = data.price;
    if (data.cost) productUpdate.cost = data.cost;
    if (data.category) productUpdate.category = data.category;
    if (data.trend) productUpdate.trend = data.trend;

    if (data.supplier) {
      const supplier = await prisma.supplier.findFirst({
        where: { name: data.supplier, organizationId: orgId }
      }) || await prisma.supplier.create({
        data: { name: data.supplier, organizationId: orgId }
      });
      productUpdate.supplierId = supplier.id;
    }

    const updated = await prisma.product.update({
      where: { id },
      data: productUpdate,
      include: { inventories: true }
    });

    // Update inventory stock if passed
    if (data.stock !== undefined && updated.inventories[0]) {
      await prisma.inventory.update({
        where: { id: updated.inventories[0].id },
        data: { quantity: data.stock }
      });
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteProductAction(id: string) {
  try {
    await prisma.product.delete({ where: { id } });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
