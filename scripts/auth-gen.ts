#!/usr/bin/env bun
import { $ } from "bun";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const AUTH_FILE_PATH = path.join(process.cwd(), "src/server/auth.ts");

async function runCommand(command: string) {
  console.log(`\n🚀 Running: ${command}`);
  try {
    await $`${{ raw: command }}`;
  } catch (error) {
    console.error(`❌ Command failed: ${command}`);
    throw error;
  }
}

async function main() {
  const mode = process.argv[2];

  if (!["generate", "migrate", "push"].includes(mode)) {
    console.error("Usage: bun scripts/auth-gen.ts [generate|migrate|push]");
    process.exit(1);
  }

  console.log("🛡️ Temporarily disabling 'server-only' in auth.ts...");
  const originalContent = await readFile(AUTH_FILE_PATH, "utf-8");

  // Robust replacement for server-only to satisfy Better Auth CLI
  const disabledContent = originalContent.replace(
    /import\s+["']server-only["'];?/g,
    '// import "server-only"; // disabled for CLI',
  );

  if (
    originalContent === disabledContent &&
    originalContent.includes("server-only")
  ) {
    console.warn(
      "⚠️ Could not find 'server-only' import with exact regex, skipping replacement.",
    );
  }

  await writeFile(AUTH_FILE_PATH, disabledContent);

  try {
    const baseCli = `bunx @better-auth/cli`;
    const configFlag = `--config ./src/server/auth.ts -y`;

    if (mode === "generate") {
      try {
        await runCommand(
          `${baseCli} generate ${configFlag} --output ./src/server/auth/schema.ts`,
        );
      } catch (e) {
        console.warn(
          "⚠️ 'generate' failed (likely better-sqlite3), falling back to 'migrate'...",
        );
        await runCommand(`${baseCli} migrate ${configFlag}`);
      }
      await runCommand("bunx drizzle-kit generate");
    } else if (mode === "migrate") {
      await runCommand(`${baseCli} migrate ${configFlag}`);
      await runCommand("bunx drizzle-kit migrate");
    } else if (mode === "push") {
      await runCommand(`${baseCli} migrate ${configFlag}`);
      await runCommand("bunx drizzle-kit push");
    }

    console.log("\n✅ Auth and DB operations completed successfully.");
  } catch (error) {
    console.error("\n💥 Operation failed during execution.");
    throw error;
  } finally {
    console.log("🔒 Restoring 'server-only' in auth.ts...");
    await writeFile(AUTH_FILE_PATH, originalContent);
  }
}

main().catch(() => {
  process.exit(1);
});
