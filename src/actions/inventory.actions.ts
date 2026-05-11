"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { Product as UIProduct } from "@/store/useInventoryStore";

async function getOrgId() {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: {
      organizations: {
        include: { organization: true }
      }
    }
  });

  if (!dbUser || dbUser.organizations.length === 0) {
    // If they have no org, let's create a default one for them
    const org = await prisma.organization.create({
      data: {
        name: "My Organization",
        slug: `org-${user.id}`,
        members: {
          create: {
            userId: dbUser?.id || "",
            role: "OWNER"
          }
        }
      }
    });
    return org.id;
  }

  return dbUser.organizations[0].organizationId;
}

export async function getInventoryAction() {
  try {
    const orgId = await getOrgId();
    
    const dbProducts = await prisma.product.findMany({
      where: { organizationId: orgId },
      include: {
        inventories: true
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
        supplier: p.supplier || "Unknown",
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

    const created = await prisma.product.create({
      data: {
        sku: product.sku,
        name: product.name,
        price: product.price,
        category: product.category,
        supplier: product.supplier,
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
    // Determine what to update
    const productUpdate: any = {};
    if (data.name) productUpdate.name = data.name;
    if (data.sku) productUpdate.sku = data.sku;
    if (data.price) productUpdate.price = data.price;
    if (data.category) productUpdate.category = data.category;
    if (data.supplier) productUpdate.supplier = data.supplier;
    if (data.trend) productUpdate.trend = data.trend;

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
