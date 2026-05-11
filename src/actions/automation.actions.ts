"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function getOrgIdForAutomation() {
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
    throw new Error("No organization found. Please complete onboarding.");
  }

  return dbUser.organizations[0].organizationId;
}

export async function getAutomationsAction() {
  try {
    const orgId = await getOrgIdForAutomation();
    
    const automations = await prisma.automation.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: 'desc' }
    });

    return { success: true, data: automations };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

import { revalidatePath } from "next/cache";

export async function createAutomationAction(data: any) {
  try {
    const orgId = await getOrgIdForAutomation();

    const created = await prisma.automation.create({
      data: {
        name: data.name,
        description: data.description,
        triggerType: data.triggerType,
        triggerConfig: data.triggerConfig || {},
        actionType: data.actionType,
        actionConfig: data.actionConfig || {},
        isActive: data.isActive ?? true,
        organizationId: orgId,
      }
    });

    revalidatePath("/automations");
    return { success: true, data: created };
  } catch (error: any) {
    console.error("CRITICAL AUTOMATION ERROR:", error);
    return { success: false, error: error.message };
  }
}

export async function toggleAutomationAction(id: string, isActive: boolean) {
  try {
    const orgId = await getOrgIdForAutomation();
    
    // Ensure the automation belongs to the org
    const existing = await prisma.automation.findFirst({
      where: { id, organizationId: orgId }
    });

    if (!existing) throw new Error("Automation not found");

    const updated = await prisma.automation.update({
      where: { id },
      data: { isActive }
    });

    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteAutomationAction(id: string) {
  try {
    const orgId = await getOrgIdForAutomation();
    
    const existing = await prisma.automation.findFirst({
      where: { id, organizationId: orgId }
    });

    if (!existing) throw new Error("Automation not found");

    await prisma.automation.delete({ where: { id } });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
