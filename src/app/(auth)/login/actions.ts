"use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { loginSchema, LoginValues } from "@/lib/validation";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verify } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";

export async function login(
  credentials: LoginValues,
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

export async function loginWithGoogle(
  idToken: string,
  uid: string,
  displayName: string,
  email: string | null,
  photoURL: string | null,
): Promise<{ error?: string }> {
  try {
    // Verify the Firebase ID token on the server
    // For now, we'll trust the client and use the provided data
    // In production, you should verify the token using Firebase Admin SDK

    // Use Firebase UID as the googleId
    const googleId = uid;

    // Check if user exists with this Google ID
    let user = await prisma.user.findUnique({
      where: { googleId },
    });

    if (!user) {
      // Check if user exists with this email
      if (email) {
        user = await prisma.user.findFirst({
          where: {
            email: {
              equals: email,
              mode: "insensitive",
            },
          },
        });
      }

      if (!user) {
        // Create new user
        const userId = generateIdFromEntropySize(10);
        const username = email
          ? email.split("@")[0] + Math.floor(Math.random() * 1000)
          : `user_${generateIdFromEntropySize(8)}`;

        // Ensure username is unique
        let finalUsername = username;
        let usernameExists = await prisma.user.findFirst({
          where: { username: finalUsername },
        });
        let counter = 1;
        while (usernameExists) {
          finalUsername = `${username}_${counter}`;
          usernameExists = await prisma.user.findFirst({
            where: { username: finalUsername },
          });
          counter++;
        }

        await prisma.$transaction(async (tx) => {
          await tx.user.create({
            data: {
              id: userId,
              username: finalUsername,
              displayName: displayName || finalUsername,
              email: email || null,
              googleId,
              avatarUrl: photoURL || null,
            },
          });
          await streamServerClient.upsertUser({
            id: userId,
            username: finalUsername,
            name: displayName || finalUsername,
            image: photoURL || undefined,
          });
        });

        user = await prisma.user.findUnique({
          where: { id: userId },
        });
      } else {
        // Update existing user with Google ID
        await prisma.user.update({
          where: { id: user.id },
          data: {
            googleId,
            avatarUrl: photoURL || user.avatarUrl,
            displayName: displayName || user.displayName,
          },
        });
      }
    } else {
      // Update user info if needed
      await prisma.user.update({
        where: { id: user.id },
        data: {
          avatarUrl: photoURL || user.avatarUrl,
          displayName: displayName || user.displayName,
        },
      });
    }

    if (!user) {
      return {
        error: "Failed to create user account",
      };
    }

    // Create session
    const session = await lucia.createSession(user.id, {});
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
    console.error("Google login error:", error);
    return {
      error: "Something went wrong! please try again",
    };
  }
}
