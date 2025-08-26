import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User as UserPrisma } from "@prisma/client";
import { Request } from "express";

interface ExtendedRequest extends Request {
  user: UserPrisma;
}

export const User = createParamDecorator(
  (data: keyof UserPrisma | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<ExtendedRequest>();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
