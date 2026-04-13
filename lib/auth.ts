import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";

import { db } from "@/lib/db";

export type AuthorizedAdminUser = {
  id: string;
  email: string;
  role: UserRole;
};

export async function authorizeAdminWithCredentials(input: {
  email?: string;
  password?: string;
}): Promise<AuthorizedAdminUser | null> {
  const email = input.email?.trim().toLowerCase();
  const password = input.password;

  if (!email || !password) {
    return null;
  }

  const user = await db.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      passwordHash: true,
      role: true,
    },
  });

  if (!user || user.role !== UserRole.ADMIN) {
    return null;
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isValidPassword) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
}
