import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { api } from "~/trpc/server";
import type { inferRouterInputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";
import { z } from "zod";
import auth from "#auth";
import { defaultLogLevel, Logger } from "#logger";
import chalk from "chalk";

const utfsLogger = new Logger("utfs", defaultLogLevel, {
  customMethods: {
    test: {
      color: chalk.gray,
      type: "TEST",
    },
  },
});

type InputData = inferRouterInputs<AppRouter>["files"]["create"];

const f = createUploadthing();

async function createFile({ input }: { input: InputData }) {
  utfsLogger.trace(`Creating file with input: ${JSON.stringify(input)}`);

  let response;
  try {
    response = await api.files.create(input);
  } catch (error) {
    utfsLogger.error(
      `Error creating file: ${error instanceof Error ? error.message : String(error)}`,
    );
    throw new Error(
      `Error creating file: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  utfsLogger.info(
    `Server asigned UUID ${response?.file?.id} to ${response?.file?.ufsKey}`,
  );

  return response;
}

// FileRouter for your app, can contain multiple FileRoutes
export const UploadthingRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  presentationUploader: f({
    "application/vnd.apple.keynote": {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      {
        maxFileSize: "16MB",
        maxFileCount: 1,
      },
    "application/vnd.openxmlformats-officedocument.presentationml.slideshow": {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
    "application/vnd.ms-powerpoint.presentation.macroenabled.12": {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
    "application/vnd.oasis.opendocument.presentation": {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
    "application/vnd.ms-powerpoint": {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
    "application/vnd.openxmlformats-officedocument.presentationml.slide": {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
    pdf: {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
  })
    .input(
      z.object({
        presentationId: z.string().uuid(),
      }),
    )
    .middleware(async ({ req, input }) => {
      const authData = await auth.api.getSession({ headers: req.headers });
      // console.log("Auth Data: ", authData);
      if (!authData) throw new UploadThingError("Unauthorized");

      return {
        userId: authData.user.id,
        presentationId: input.presentationId,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // console.log("Uploaded ", file.name, " for ", metadata.owner);
      // console.log(metadata.presentationId, ".presentation = ", file.key);

      const request: InputData = {
        name: file.name,
        fileType: "presentation",
        dataType: file.type,
        size: file.size,
        ufsKey: file.key,
        url: file.ufsUrl,

        presentationId: metadata.presentationId,
        ownerId: metadata.userId,
      };

      const response = await createFile({ input: request });

      return { id: response?.file?.id, success: true };
    }),
  imageUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .input(
      z.object({
        presentationId: z.string().uuid(),
        fileType: z.enum(["logo", "cover"]),
      }),
    )
    .middleware(async ({ req, input }) => {
      const authData = await auth.api.getSession({ headers: req.headers });
      // console.log("Auth Data: ", authData);
      if (!authData) throw new UploadThingError("Unauthorized");

      return {
        userId: authData.user.id,
        presentationId: input.presentationId,
        fileType: input.fileType,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // console.log("Uploaded ", file.name, " for ", metadata.owner);
      // console.log(metadata.presentationId, ".presentation = ", file.key);

      const request: InputData = {
        name: file.name,
        fileType: metadata.fileType,
        dataType: file.type,
        size: file.size,

        ufsKey: file.key,
        url: file.ufsUrl,

        presentationId: metadata.presentationId,
        ownerId: metadata.userId,
      };

      const response = await createFile({ input: request });

      return { id: response?.file?.id, success: true };
    }),

  documentUploader: f({
    pdf: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
    "application/vnd.ms-word.document.macroenabled.12": {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .input(
      z.object({
        presentationId: z.string().uuid(),
        fileType: z.enum(["handout", "research"]),
      }),
    )
    .middleware(async ({ req, input }) => {
      const authData = await auth.api.getSession({ headers: req.headers });
      // console.log("Auth Data: ", authData);
      if (!authData) throw new UploadThingError("Unauthorized");

      return {
        userId: authData.user.id,
        presentationId: input.presentationId,
        fileType: input.fileType,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // console.log("Uploaded ", file.name, " for ", metadata.owner);
      // console.log(metadata.presentationId, ".presentation = ", file.key);

      const request: InputData = {
        name: file.name,
        fileType: metadata.fileType,
        dataType: file.type,
        size: file.size,
        ufsKey: file.key,
        url: file.ufsUrl,

        presentationId: metadata.presentationId,
        ownerId: metadata.userId,
      };

      const response = await createFile({ input: request });

      return { id: response?.file?.id, success: true };
    }),
} satisfies FileRouter;

export type UploadthingRouter = typeof UploadthingRouter;
