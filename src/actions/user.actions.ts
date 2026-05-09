"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getAuthUser() {
  const user = await currentUser();
  if (!user) return null;
  
  return user;
}

export async function completeOnboarding(formData: {
  firstName: string;
  lastName: string;
  role: string;
  orgName: string;
  orgSlug: string;
}) {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      throw new Error("Unauthorized");
    }

    const email = clerkUser.emailAddresses[0].emailAddress;

    // Transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx: any) => {
      // 1. Create or update User
      const user = await tx.user.upsert({
        where: { clerkId: clerkUser.id },
        update: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          imageUrl: clerkUser.imageUrl,
        },
        create: {
          clerkId: clerkUser.id,
          email: email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          imageUrl: clerkUser.imageUrl,
        }
      });

      // 2. Create Organization
      const organization = await tx.organization.create({
        data: {
          name: formData.orgName,
          slug: formData.orgSlug,
        }
      });

      // 3. Link User to Organization as OWNER
      await tx.organizationMember.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          role: "OWNER"
        }
      });

      return { user, organization };
    });

    revalidatePath("/");
    return { success: true, data: result };

  } catch (error: any) {
    console.error("Onboarding Error:", error);
    return { success: false, error: error.message || "Failed to complete onboarding" };
  }
}
