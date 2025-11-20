"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { getUserDataSelect } from "@/lib/types";
import {
  updateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lib/validation";

export async function updateUserProfile(values: UpdateUserProfileValues) {
  const validatedValues = updateUserProfileSchema.parse(values);

  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  // Check if username is already taken by another user
  if (validatedValues.username !== user.username) {
    const existingUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: validatedValues.username,
          mode: "insensitive",
        },
        NOT: {
          id: user.id,
        },
      },
    });

    if (existingUser) {
      throw new Error("Username already taken");
    }
  }

  const updatedUser = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: user.id },
      data: validatedValues,
      select: getUserDataSelect(user.id),
    });
    await streamServerClient.partialUpdateUser({
      id: user.id,
      set: {
        username: validatedValues.username,
        name: validatedValues.displayName,
      },
    });
    return updatedUser;
  });

  return updatedUser;
}
