#!/usr/bin/env node
const { spawnSync } = require("node:child_process");

function readConfigValue() {
  try {
    require("ts-node/register/transpile-only");
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const tooling = require("../config/tooling");
    if (typeof tooling.PRE_COMMIT_ENABLED === "boolean") {
      return tooling.PRE_COMMIT_ENABLED;
    }
  } catch {
    // ignore missing config/ts-node
  }
  return undefined;
}

function resolveEnabled() {
  const envVar = process.env.PRE_COMMIT_ENABLED;
  if (typeof envVar === "string") {
    return !["false", "0", "off"].includes(envVar.toLowerCase());
  }
  const configValue = readConfigValue();
  if (typeof configValue === "boolean") {
    return configValue;
  }
  return true;
}

function main() {
  if (!resolveEnabled()) {
    console.info("Pre-commit checks are disabled via configuration.");
    process.exit(0);
  }

  const result = spawnSync("pnpm", ["lint-staged"], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }

  process.exit(result.status ?? 1);
}

main();
