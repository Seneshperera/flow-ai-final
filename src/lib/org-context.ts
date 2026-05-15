import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { getSession } from "./auth-utils";

export async function getActiveOrgId() {
  // Try Clerk first
  try {
    const { orgId } = await auth();
    if (orgId) return orgId;
  } catch (e) {
    // Clerk might fail due to clock skew or keys
  }
  
  // Check for custom session
  const session = await getSession();
  
  if (!session) {
    // If no custom session, try Clerk's currentUser as fallback
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    let dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      include: {
        organizations: {
          include: { organization: true }
        }
      }
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          clerkId: user.id,
          email: user.emailAddresses[0].emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        include: { organizations: true }
      });
    }

    if (dbUser.organizations.length === 0) {
      const personalOrg = await prisma.organization.create({
        data: {
          name: `${user.firstName || 'My'} Organization`,
          slug: `personal-${user.id}-${Date.now()}`,
          members: {
            create: {
              userId: dbUser.id,
              role: "OWNER"
            }
          }
        }
      });
      return personalOrg.id;
    }

    return dbUser.organizations[0].organizationId;
  }

  // Handle custom session user
  const dbUser = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      organizations: {
        include: { organization: true }
      }
    }
  });

  if (!dbUser || dbUser.organizations.length === 0) {
    throw new Error("No organization found for custom session");
  }

  return dbUser.organizations[0].organizationId;
}
