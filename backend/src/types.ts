import type { Role } from "@prisma/client";

export type AuthUser = {
  id: string;
  userId: string;
  role: Role;
  customerId?: string | null;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
