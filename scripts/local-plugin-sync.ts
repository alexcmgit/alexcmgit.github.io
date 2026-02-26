#!/usr/bin/env ts-node

import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

type PackageManager = "yarn" | "npm" | "pnpm";

const SUPPORTED_MANAGERS: PackageManager[] = ["yarn", "npm", "pnpm"];

function getPackageManager(): PackageManager {
  const arg = process.argv[2] as PackageManager | undefined;
  if (arg && SUPPORTED_MANAGERS.includes(arg)) return arg;
  return "yarn";
}

function getUninstallCommand(pm: PackageManager, packages: string[]): string {
  const pkgs = packages.join(" ");
  switch (pm) {
    case "yarn":
      return `yarn remove ${pkgs}`;
    case "npm":
      return `npm uninstall ${pkgs}`;
    case "pnpm":
      return `pnpm remove ${pkgs}`;
  }
}
function getInstallCommand(
  pm: PackageManager,
  plugins: { name: string; path: string; isDev: boolean }[]
): string[] {
  const deps = plugins.filter((p) => !p.isDev).map((p) => p.path);
  const devDeps = plugins.filter((p) => p.isDev).map((p) => p.path);
  const cmds: string[] = [];

  if (deps.length > 0) {
    switch (pm) {
      case "yarn":
        cmds.push(`yarn add ${deps.join(" ")}`);
        break;
      case "npm":
        cmds.push(`npm install ${deps.join(" ")}`);
        break;
      case "pnpm":
        cmds.push(`pnpm add ${deps.join(" ")}`);
        break;
    }
  }

  if (devDeps.length > 0) {
    switch (pm) {
      case "yarn":
        cmds.push(`yarn add --dev ${devDeps.join(" ")}`);
        break;
      case "npm":
        cmds.push(`npm install --save-dev ${devDeps.join(" ")}`);
        break;
      case "pnpm":
        cmds.push(`pnpm add --save-dev ${devDeps.join(" ")}`);
        break;
    }
  }

  return cmds;
}

function findFilePlugins(): { name: string; path: string; isDev: boolean }[] {
  const pkgPath = join(process.cwd(), "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));

  const filePlugins: { name: string; path: string; isDev: boolean }[] = [];

  for (const [depsKey, isDev] of [
    ["dependencies", false],
    ["devDependencies", true],
  ] as const) {
    const deps = pkg[depsKey];
    if (!deps) continue;
    for (const [name, version] of Object.entries(deps)) {
      if (typeof version === "string" && version.startsWith("file:")) {
        filePlugins.push({ name, path: version, isDev });
      }
    }
  }

  return filePlugins;
}

function main() {
  const pm = getPackageManager();
  const plugins = findFilePlugins();

  if (plugins.length === 0) {
    console.log("No file: plugins found in package.json.");
    return;
  }

  console.log(`Found ${plugins.length} file plugin(s):`);
  plugins.forEach((p) => console.log(`  - ${p.name} (${p.path})`));

  // Uninstall
  const uninstallCmd = getUninstallCommand(pm, plugins.map((p) => p.name));
  console.log(`\nUninstalling: ${uninstallCmd}\n`);

  try {
    execSync(uninstallCmd, { stdio: "inherit" });
  } catch (err) {
    console.error("Failed to uninstall plugins.", err);
    process.exit(1);
  }

  // Write backup temp file with install commands
  const installCmds = getInstallCommand(pm, plugins);
  const backupFile = join(process.cwd(), ".plugin-sync-reinstall.sh");
  writeFileSync(backupFile, installCmds.join("\n") + "\n", { mode: 0o755 });
  console.log(`\nBackup install script written to: ${backupFile}`);

  // Reinstall
  for (const cmd of installCmds) {
    console.log(`\nInstalling: ${cmd}\n`);
    try {
      execSync(cmd, { stdio: "inherit" });
    } catch (err) {
      console.error("Failed to install plugins.", err);
      process.exit(1);
    }
  }

  console.log("\nFile plugins synced successfully.");
}

main();
