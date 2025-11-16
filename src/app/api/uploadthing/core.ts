import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { createUploadthing, FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

const f = createUploadthing();

export const fileRouter = {
  avatar: f({
    image: { maxFileSize: "512KB" },
  })
    .middleware(async () => {
      const { user } = await validateRequest();

      if (!user) throw new UploadThingError("Unauthorized");

      return { user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        const oldAvatarUrl = metadata.user.avatarUrl;

        if (oldAvatarUrl) {
          const appId = process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID;
          if (appId && oldAvatarUrl.includes(`/a/${appId}/`)) {
            const key = oldAvatarUrl.split(`/a/${appId}/`)[1];
            if (key) {
              await new UTApi().deleteFiles(key);
            }
          }
        }

        const appId = process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID;
        if (!appId) {
          throw new Error("NEXT_PUBLIC_UPLOADTHING_APP_ID is not set");
        }

        const newAvatarUrl = file.url.replace("/f/", `/a/${appId}/`);

        await prisma.user.update({
          where: { id: metadata.user.id },
          data: {
            avatarUrl: newAvatarUrl,
          },
        });

        return { avatarUrl: newAvatarUrl };
      } catch (error) {
        console.error("Error in avatar upload complete:", error);
        throw error;
      }
    }),
  attachment: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
    video: { maxFileSize: "64MB", maxFileCount: 5 },
  })
    .middleware(async () => {
      const { user } = await validateRequest();

      if (!user) throw new UploadThingError("Unauthorized");

      return {};
    })
    .onUploadComplete(async ({ file }) => {
      try {
        const appId = process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID;
        if (!appId) {
          throw new Error("NEXT_PUBLIC_UPLOADTHING_APP_ID is not set");
        }

        if (!file.type) {
          throw new Error("File type is missing");
        }

        const media = await prisma.media.create({
          data: {
            url: file.url.replace("/f/", `/a/${appId}/`),
            type: file.type.startsWith("image") ? "IMAGE" : "VIDEO",
          },
        });

        return { mediaId: media.id };
      } catch (error) {
        console.error("Error in attachment upload complete:", error);
        throw error;
      }
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;