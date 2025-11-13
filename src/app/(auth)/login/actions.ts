"use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { loginSchema, loginValues } from "@/lib/validation";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verify } from "@node-rs/argon2";

export async function login(
  credentials: loginValues,
): Promise<{ error: string }> {
  try {
    const { username, password } = loginSchema.parse(credentials);

    const existingUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (!existingUser || !existingUser.passwordHash) {
      return {
        error: "Invalid username or password",
      };
    }

    const validePassword = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
      outputLen: 32,
    });

    if (!validePassword) {
      return {
        error: "Invalid username or password",
      };
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return redirect("/");
  } catch (error) {
    // Re-throw redirect errors
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      error.digest === "NEXT_REDIRECT"
    ) {
      throw error;
    }
    console.log(error);
    return {
      error: "Something went wrong! please try again",
    };
  }
}
