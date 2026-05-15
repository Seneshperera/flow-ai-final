"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { encrypt } from "@/lib/auth-utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) {
    return { error: "Invalid email or password" };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return { error: "Invalid email or password" };
  }

  // Create the session
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId: user.id, email: user.email, expires });

  // Save the session in a cookie
  (await cookies()).set("flow-session", session, { 
    expires, 
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });

  redirect("/onboarding");
}

export async function register(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "User already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
    },
  });

  // Create personal organization automatically
  await prisma.organization.create({
    data: {
      name: `${firstName}'s Workspace`,
      slug: `org-${user.id}-${Date.now()}`,
      members: {
        create: {
          userId: user.id,
          role: "OWNER",
        },
      },
    },
  });

  // Create the session
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId: user.id, email: user.email, expires });

  (await cookies()).set("flow-session", session, { 
    expires, 
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });

  redirect("/onboarding");
}

export async function logout() {
  (await cookies()).set("flow-session", "", { expires: new Date(0) });
  redirect("/login");
}
