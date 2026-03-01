- Read https://www.npmjs.com/package/yalc this has a compreensive doc on how to handle plugin development outside the Gatsby project that require (or not) peerDependencies.

Old script for legacy purpose:

```js
#!/usr/bin/env ts-node

import { execSync } from "child_process";
import { readFileSync } from "fs";
import { join } from "path";

function findYalcPackages(): string[] {
  const pkgPath = join(process.cwd(), "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  const packages: string[] = [];

  for (const depsKey of ["dependencies", "devDependencies"] as const) {
    const deps = pkg[depsKey];
    if (!deps) continue;
    for (const [name, version] of Object.entries(deps)) {
      if (typeof version === "string" && version.startsWith("file:.yalc/")) {
        packages.push(name);
      }
    }
  }

  return packages;
}

function main() {
  const packages = findYalcPackages();

  if (packages.length === 0) {
    console.log("No .yalc packages found in package.json.");
    return;
  }

  console.log(`Found ${packages.length} yalc package(s):`);
  packages.forEach((p) => console.log(`  - ${p}`));
  console.log();

  const cmd = `yalc update ${packages.join(" ")}`;
  console.log(`> ${cmd}\n`);
  execSync(cmd, { stdio: "inherit" });

  console.log("\nYalc packages synced successfully.");
}

main();
```