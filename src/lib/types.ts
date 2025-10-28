import { Prisma } from "@/generated/prisma";

export const UserDataSelect = {
    id: true,
    username: true,
    displayName: true,
    avatarUrl: true,
} satisfies Prisma.UserSelect;

export type UserData = Prisma.UserGetPayload<{
    select: typeof UserDataSelect;
}>;

export const PostDataInclude ={
    user:{
        select: UserDataSelect,
      },
} satisfies Prisma.PostInclude;


export type PostData = Prisma.PostGetPayload<{
    include: typeof PostDataInclude;
}>;