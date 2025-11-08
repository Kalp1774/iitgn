// Extend Express Request type to include user info from JWT
declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userRole?: string;
    }
  }
}

export {};

