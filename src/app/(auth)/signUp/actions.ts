import { cookies } from 'next/headers';
"use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { signUpValues, signUpSchema } from "@/lib/validation";
import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { redirect } from "next/navigation";
import { isRedirectError } from 'next/dist/client/components/redirect';

export async function signUp(
  credentials: signUpValues,
): Promise<{ error: string }> {
  try {
    const { username, email, password } = signUpSchema.parse(credentials);

    //Hash the password
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    //generate an id for new user
    const userId = generateIdFromEntropySize(10);

    //check the user with this username or email exists or not
    const existingUsername = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (existingUsername) {
      return {
        error: "username already taken",
      };
    }

    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (existingEmail) {
      return {
        error: "email already taken",
      };
    }

    //after check the existing,create a new user in db
    await prisma.user.create({
      data: {
        id: userId,
        username,
        displayName: username,
        passwordHash,
        email,
      },
    });

    const session = await lucia.createSession(userId,{})
    const sessionCookie = lucia.createSessionCookie(session.id)

    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

    return redirect("/")
  } catch (error) {
    if(isRedirectError(error)) throw error;
    console.error(error);
    return {
      error: "Something went wrong!",
    };
  }
}
