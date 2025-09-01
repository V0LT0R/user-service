import { Role } from '@prisma/client';

declare global {
  namespace Express {
    interface User {
      id: string;
      role: Role;
    }
    // добавим в Request
    interface Request {
      user?: User;
    }
  }
}

export {};
