import { Effect, pipe } from "effect";

const checkShortnameTaken = Effect.fn("checkShortnameTaken")(function* (
  shortname: string
) {
  yield* Effect.annotateCurrentSpan({
    shortname: shortname,
  });

  return shortname === "taken-name";
});
