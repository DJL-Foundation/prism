//#region Imports

import type {
  GenericActionCtx,
  GenericMutationCtx,
  GenericQueryCtx,
} from "convex/server";
import { v } from "convex/values";
import {
  zCustomAction,
  zCustomMutation,
  zCustomQuery,
} from "convex-helpers/server/zod4";
// import { api } from "#";
// import type { DataModel, Doc } from "#/dataModel";
import {
  action,
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "#/server";
// import { result } from "#utility";
//#endregion

//#region Documentation
/**
 * Naming conventions for Zod-wrapped Convex functions:
 *
 * first letter always small z (to indicate Zod)
 * next letter differentiates between internal and external functions
 * i = internal (only callable from server-side code)
 *
 * next letter differentiates between function types
 * M = Mutation
 * Q = Query
 * A = Action
 *
 * If a Checker is running use Uppercase Letters
 *
 * If additional data is being passed use Lowercase Letters
 *
 */
//#endregion

//#region Mutations

// Zod (Convex) Mutation with authentication data
// export const zMa = zCustomMutation(mutation, {
//   args: { userId: v.id("users") },
//   input: async (
//     ctx,
//     args,
//   ): Promise<{
//     ctx: GenericMutationCtx<DataModel> & { user: Doc<"users"> | null };
//     args: Record<string, never>;
//   }> => {
//     const user =
//       result(
//         await ctx.runQuery(api.poc.users.getUserById, {
//           userId: args.userId,
//         }),
//       )
//         .deconstruct()
//         .content() ?? null;
//     return { ctx: { ...ctx, user }, args: {} };
//   },
// });

// Zod (Convex) Mutation
export const zM = zCustomMutation(mutation, {
  args: {},
  input: async (ctx, args) => {
    return { ctx, args };
  },
});

// Zod (Convex) Internal Mutation
export const ziM = zCustomMutation(internalMutation, {
  args: {},
  input: async (ctx, args) => {
    return { ctx, args };
  },
});
//#endregion

//#region Queries

// Zod (Convex) Query
export const zQ = zCustomQuery(query, {
  args: {},
  input: async (ctx, args) => {
    return { ctx, args };
  },
});

// Zod (Convex) Internal Query
export const ziQ = zCustomQuery(internalQuery, {
  args: {},
  input: async (ctx, args) => {
    return { ctx, args };
  },
});

// Zod (Convex) Query with authentication data
// export const zQa = zCustomQuery(query, {
//   args: { userId: v.id("users") },
//   input: async (
//     ctx,
//     args,
//   ): Promise<{
//     ctx: GenericQueryCtx<DataModel> & { user: Doc<"users"> | null };
//     args: Record<string, never>;
//   }> => {
//     const user =
//       result(
//         await ctx.runQuery(api.poc.users.getUserById, {
//           userId: args.userId,
//         }),
//       )
//         .deconstruct()
//         .content() ?? null;
//     return { ctx: { ...ctx, user }, args: {} };
//   },
// });
//#endregion

//#region Actions

// Zod (Convex) Action
export const zA = zCustomAction(action, {
  args: {},
  input: async (ctx, args) => {
    return { ctx, args };
  },
});

// Zod (Convex) Internal Action
export const ziA = zCustomAction(internalAction, {
  args: {},
  input: async (ctx, args) => {
    return { ctx, args };
  },
});

// Zod (Convex) Action with authentication data
// export const zAa = zCustomAction(action, {
//   args: { userId: v.id("users") },
//   input: async (
//     ctx,
//     args,
//   ): Promise<{
//     ctx: GenericActionCtx<DataModel> & { user: Doc<"users"> | null };
//     args: Record<string, never>;
//   }> => {
//     const user =
//       result(
//         await ctx.runQuery(api.poc.users.getUserById, {
//           userId: args.userId,
//         }),
//       )
//         .deconstruct()
//         .content() ?? null;
//     return { ctx: { ...ctx, user }, args: {} };
//   },
// });
//#endregion
