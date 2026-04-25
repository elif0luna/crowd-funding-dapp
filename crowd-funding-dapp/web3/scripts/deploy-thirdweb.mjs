import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import "dotenv/config";

const secretKey = (process.env.THIRDWEB_SECRET_KEY ?? process.argv[2] ?? "").trim();

if (!secretKey || secretKey.includes("{") || secretKey.includes("}")) {
  console.error("Set THIRDWEB_SECRET_KEY to your real thirdweb secret key before deploying.");
  process.exit(1);
}

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "..");
const sourceContractsDir = join(projectRoot, "contracts");
const tempProjectDir = mkdtempSync(join(tmpdir(), "thirdweb-deploy-"));
const tempContractsDir = join(tempProjectDir, "contracts");

// Keep a minimal manifest in the temp project to avoid thirdweb trying to parse
// unrelated local project metadata during compile.
writeFileSync(
  join(tempProjectDir, "package.json"),
  JSON.stringify({ name: "thirdweb-temp-deploy", private: true, version: "1.0.0" }, null, 2),
);

function copyDeployableContracts(sourceDir, targetDir) {
  if (!existsSync(sourceDir)) {
    return;
  }

  mkdirSync(targetDir, { recursive: true });

  for (const entry of readdirSync(sourceDir, { withFileTypes: true })) {
    const sourcePath = join(sourceDir, entry.name);
    const targetPath = join(targetDir, entry.name);

    if (entry.isDirectory()) {
      copyDeployableContracts(sourcePath, targetPath);
      continue;
    }

    if (!entry.name.endsWith(".sol") || entry.name.endsWith(".t.sol")) {
      continue;
    }

    cpSync(sourcePath, targetPath);
  }
}

copyDeployableContracts(sourceContractsDir, tempContractsDir);

const result = spawnSync(
  "npx",
  [
    "--yes",
    "thirdweb@latest",
    "deploy",
    "--ci",
    "--contract",
    "./contracts/CrowdFunding.sol",
    "-k",
    secretKey,
  ],
  {
    cwd: tempProjectDir,
    stdio: "inherit",
    shell: process.platform === "win32",
  },
);

if (result.error) {
  console.error(result.error);
}

rmSync(tempProjectDir, { recursive: true, force: true });

process.exit(result.status ?? 1);