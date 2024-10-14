import { Request, Response } from "express";
import { Session } from "express-session";

interface Sessions extends Session {
  userId: number;
}

export type MyCtx = {
  req: Request & { session: Sessions };
  res: Response;
};
